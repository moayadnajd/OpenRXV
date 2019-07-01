import { Injectable, EventEmitter } from '@angular/core';
import * as bodybuilder from 'bodybuilder';
import {
  ElasticsearchQuery,
  ResetOptions,
  ElasticsearchResponse,
  BucketWithInnerBuckts,
  Bucket,
} from 'src/app/filters/services/interfaces';
import { MergedSelect } from 'src/configs/generalConfig.interface';
import { ItemsService } from 'src/services/itemsService/items.service';
import { RangeService } from 'src/app/filters/services/range/range.service';
import { map, first, delay } from 'rxjs/operators';
import { ESHttpError } from 'src/store/actions/actions.interfaces';
import { UpdateCallerBarChart } from '../../../list/paginated-list/filter-paginated-list/types.interface';
import { Observable } from 'rxjs';

interface ComposerHelper {
  subFlag: boolean;
  forgetYearsFromStore: boolean;
}
/**
 * right now `buckets` will contain
 *   - `type`: `Array<Bucket>`
 *   - `'year.keyword'`: `Array<Bucket>`
 * `selectedCategories` & `selectedYears` is the selected options which get set for the first time when
 * the user loads the page, when the user select a filter from the side filters, and when the bar
 * filters changes the selected values stays the same.
 * `barTypes` & `barYears`: is just the mapped buckets to array of primitives(string | number) for
 * the bar select options.
 * `barLoading`: a boolean that shows a `ngx-loading` separated from another `ngx-loading` which is linked
 * with the side filters.
 */
@Injectable()
export class BarService {
  buckets: MergedSelect;
  setChartOptinos: EventEmitter<Array<Highcharts.SeriesColumnOptions>>;
  selectedCategories: Array<string>;
  selectedYears: Array<number>;
  barTypes: Array<string>;
  barYears: Array<number>;
  barLoading: boolean;
  private rangeService: RangeService;
  private doWeHaveQueryInTheMainQuery: boolean;

  constructor(private readonly itemsService: ItemsService) {
    this.setChartOptinos = new EventEmitter<
      Array<Highcharts.SeriesColumnOptions>
    >();
    this.barLoading = false;
  }

  init(
    rangeService: RangeService,
    isThereIsQueryInTheMainQuery$: Observable<boolean>
  ): void {
    this.rangeService = rangeService;
    // the delay is just to allow `doWeHaveQueryInTheMainQuery` to change the query behavior
    // before changing ~ in `yearAndLenSize` method.
    isThereIsQueryInTheMainQuery$
      .pipe(delay(1))
      .subscribe((b: boolean) => (this.doWeHaveQueryInTheMainQuery = b));
  }

  /**
   * gets called when the `side filters`, `bar filters` changes, and on the first load.
   * @param changeBy determine if you should change the `selectedYears` & `selectedTypes`.
   * we are getting the query that the filters uses and merged with a custom query
   * for the bar chart (the `this.rangeService.buildQuery()` line...).
   */
  getData(changeBy?: UpdateCallerBarChart): void {
    this.barLoading = true;
    this.itemsService
      .getItems(
        this.buildQuery(this.rangeService.buildquery({ size: 12 }), changeBy)
      )
      .pipe(
        map<ElasticsearchResponse, Array<Highcharts.SeriesColumnOptions>>(
          (value: ElasticsearchResponse) =>
            this.mapDataToColmns(value, changeBy)
        ),
        first<
          Array<Highcharts.SeriesColumnOptions>,
          Array<Highcharts.SeriesColumnOptions>
        >()
      )
      .subscribe(
        (series: Array<Highcharts.SeriesColumnOptions>) => {
          this.barLoading = false;
          this.setChartOptinos.emit(series);
        },
        (error: ESHttpError) => {
          this.barLoading = false;
          this.setChartOptinos.emit();
        }
      );
  }

  private buildQuery(
    queryToMerge?: bodybuilder.Bodybuilder,
    changeBy?: UpdateCallerBarChart
  ): ElasticsearchQuery {
    const [yearsLen, typeLen] = this.yearAndLenSize();
    const q = bodybuilder()
      .size(0)
      .aggregation('terms', 'year.keyword', { size: yearsLen }, 'y', query =>
        query.aggregation(
          'terms',
          '',
          {
            field: 'type.keyword',
            size: typeLen,
          },
          'x'
        )
      );

    if (changeBy === UpdateCallerBarChart.BarChartNgSelect) {
      this.addYearsAndTypesToQuery(queryToMerge, changeBy);
    }

    const finalQuery: ElasticsearchQuery = {
      ...(q.build() as ElasticsearchQuery),
      query: { ...(queryToMerge.build() as ElasticsearchQuery).query },
    };
    if (!Object.keys(finalQuery.query).length) {
      delete finalQuery.query;
    }
    return finalQuery;
  }

  yearsComposer(source: string): (b: MergedSelect) => void {
    const composer: ComposerHelper = {
      subFlag: true,
      forgetYearsFromStore: false,
    };
    return (b: MergedSelect) => {
      if (composer.subFlag) {
        this.getData();
        this.subToShouldReset(composer, source);
      }
      if (!composer.forgetYearsFromStore) {
        this.buckets = { ...b };
      }
      composer.subFlag = false;
      composer.forgetYearsFromStore = false;
      this.updateNgSelectOptions();
    };
  }

  private updateNgSelectOptions(): void {
    if (this.buckets.type) {
      this.barTypes = this.buckets.type.map(({ key }: Bucket) => key);
    }
    if (this.buckets['year.keyword']) {
      this.barYears = this.buckets['year.keyword'].map(
        ({ key }: Bucket) => +key
      );
    }
  }

  private yearAndLenSize(): [number, number] {
    return [
      this.selectedYears
        ? this.selectedYears.length === 0
          ? 2147483647
          : this.doWeHaveQueryInTheMainQuery
          ? 5
          : this.selectedYears.length
        : 5,
      this.selectedCategories
        ? this.selectedCategories.length === 0
          ? 2147483647
          : this.doWeHaveQueryInTheMainQuery
          ? 5
          : this.selectedCategories.length
        : 5,
    ];
  }

  private addYearsAndTypesToQuery(
    queryToMerge: bodybuilder.Bodybuilder,
    changeBy: UpdateCallerBarChart
  ): void {
    if (changeBy === UpdateCallerBarChart.BarChartNgSelect) {
      if (this.selectedYears.length) {
        queryToMerge.query('terms', 'year.keyword', this.selectedYears);
      }
      if (this.selectedCategories.length) {
        queryToMerge.query('terms', 'type.keyword', this.selectedCategories);
      }
    }
  }

  private subToShouldReset(composer: ComposerHelper, source: string) {
    this.rangeService.shouldReset.subscribe(
      ({ caller, data }: ResetOptions) => {
        if (caller === 'range' && data) {
          const { min, max } = data;
          const filterdYearsRange = [];
          for (let i = min; i < max; i++) {
            filterdYearsRange.push(i);
          }
          this.buckets = {
            ...this.buckets,
            [source]: filterdYearsRange,
          };
          composer.forgetYearsFromStore = true;
        }
        this.getData(UpdateCallerBarChart.SideFilters);
      }
    );
  }

  private mapDataToColmns(
    res: ElasticsearchResponse,
    changeBy: UpdateCallerBarChart
  ): Array<Highcharts.SeriesColumnOptions> {
    const series: Array<
      Highcharts.SeriesColumnOptions
    > = res.aggregations.y.buckets.map(
      (yBucket: BucketWithInnerBuckts) =>
        ({
          type: 'column',
          name: yBucket.key,
          value: yBucket.doc_count,
          data: yBucket.x.buckets.map(xBucket => ({
            name: xBucket.key,
            y: xBucket.doc_count,
          })),
          animation: true,
        } as Highcharts.SeriesColumnOptions)
    );
    this.selectDefaultOptions(series, changeBy);
    return series;
  }

  private selectDefaultOptions(
    series: Array<Highcharts.SeriesColumnOptions>,
    changeBy: UpdateCallerBarChart
  ): void {
    // binding the default selected values only the first time first two conditions.
    // replace the selected options when the SideFilters update the data.
    if (
      this.selectedCategories &&
      this.selectedYears &&
      changeBy === UpdateCallerBarChart.BarChartNgSelect
    ) {
      return;
    }
    const catSet: Set<string> = new Set<string>();
    series
      .flatMap(({ data }) => data)
      .forEach(({ name }: { y: number; name: string }) => catSet.add(name));
    this.selectedCategories = Array.from(catSet);
    this.selectedYears = series.map(
      ({ name }: Highcharts.SeriesColumnOptions) => +name
    );
  }
}
