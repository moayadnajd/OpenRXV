import { Injectable, EventEmitter } from '@angular/core';
import { BodyBuilderService } from 'src/app/filters/services/bodyBuilder/body-builder.service';
import * as bodybuilder from 'bodybuilder';
import {
  ElasticsearchQuery,
  ResetOptions,
  ElasticsearchResponse,
  BucketWithInnerBuckts,
  Bucket,
} from 'src/app/filters/services/interfaces';
import { MergedSelect } from 'src/configs/generalConfig.interface';
import { Subject } from 'rxjs';
import { ItemsService } from 'src/services/itemsService/items.service';
import { RangeService } from 'src/app/filters/services/range/range.service';
import { map, first } from 'rxjs/operators';
import { ESHttpError } from 'src/store/actions/actions.interfaces';

interface ComposerHelper {
  subFlag: boolean;
  forgetYearsFromStore: boolean;
}
@Injectable()
export class BarService {
  buckets: MergedSelect;
  setChartOptinos: EventEmitter<Array<Highcharts.SeriesColumnOptions>>;
  selectedCategories: Array<Bucket>;
  selectedYears: Array<Bucket>;
  private rangeService: RangeService;

  constructor(private readonly itemsService: ItemsService) {
    this.setChartOptinos = new EventEmitter<
      Array<Highcharts.SeriesColumnOptions>
    >();
  }

  init(rangeService: RangeService) {
    this.rangeService = rangeService;
  }

  getData(addTermsQueryToQuery: boolean = false): void {
    this.itemsService
      .getItems(
        this.buildQuery(
          this.rangeService
            .buildquery({ size: 12 })
            .build() as ElasticsearchQuery,
          addTermsQueryToQuery
        )
      )
      .pipe(
        map(this.mapDataToColmns.bind(this)),
        first()
      )
      .subscribe(
        (series: Array<Highcharts.SeriesColumnOptions>) => {
          this.setChartOptinos.emit(series);
        },
        (error: ESHttpError) => this.setChartOptinos.emit()
      );
  }

  private buildQuery(
    queryToMerge?: ElasticsearchQuery,
    addTermsQueryToQuery?: boolean
  ): ElasticsearchQuery {
    const q = bodybuilder()
      .size(0)
      .aggregation('terms', 'year.keyword', { size: 12 }, 'y', query =>
        query.aggregation(
          'terms',
          '',
          {
            field: 'type.keyword',
            size: 12,
          },
          'x'
        )
      );

    if (addTermsQueryToQuery) {
      queryToMerge.query = {
        ...queryToMerge.query,
        terms: {
          'year.keyword': this.selectedYears.map(({ key }) => +key),
        },
      };
    }

    const finalQuery: ElasticsearchQuery = {
      ...(q.build() as ElasticsearchQuery),
      query: { ...queryToMerge.query },
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
    };
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
        this.getData();
      }
    );
  }

  private mapDataToColmns(
    res: ElasticsearchResponse
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
        } as Highcharts.SeriesColumnOptions)
    );
    this.selectDefaultOptions(series);
    return series;
  }

  private selectDefaultOptions(
    series: Array<Highcharts.SeriesColumnOptions>
  ): void {
    const [{ data }] = series;

    this.selectedCategories = data.map(
      ({ y, name }: { y: number; name: string }) =>
        ({
          key: name,
          doc_count: y,
        } as Bucket)
    );
    this.selectedYears = series.map(
      ({ name, value }: Highcharts.SeriesColumnOptions & { value: any }) =>
        ({
          key: name,
          doc_count: value,
        } as Bucket)
    );
  }
}
