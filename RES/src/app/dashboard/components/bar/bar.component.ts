import { Component, OnInit } from '@angular/core';
import { ParentChart } from '../parent-chart';
import { ChartMathodsService } from '../services/chartCommonMethods/chart-mathods.service';
import {
  ChartTypes,
  ComponentDashboardConfigs,
  MergedSelect,
} from 'src/configs/generalConfig.interface';
import {
  ResetCaller,
  BuildQueryObj,
  ElasticsearchQuery,
  ElasticsearchResponse,
  BucketWithInnerBuckts,
  Bucket,
} from 'src/app/filters/services/interfaces';
import { RangeService } from 'src/app/filters/services/range/range.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../store';
import { BarService } from './services/bar/bar.service';
import { ItemsService } from 'src/services/itemsService/items.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  providers: [ChartMathodsService, RangeService, BarService],
})
export class BarComponent extends ParentChart implements OnInit {
  sources: MergedSelect;
  selectedCategories: Array<Bucket>;
  selectedYears: Array<Bucket>;

  constructor(
    cms: ChartMathodsService,
    private readonly rangeService: RangeService,
    private readonly store: Store<fromStore.AppState>,
    private readonly barService: BarService,
    private readonly itemsService: ItemsService
  ) {
    super(cms);
    this.rangeService.storeVal = this.store;
  }

  ngOnInit() {
    const { source } = this.componentConfigs as ComponentDashboardConfigs;
    this.rangeService.sourceVal = (source as Array<string>).reduce(
      (prev: string, curr: string) => (curr.includes('year') ? curr : undefined)
    );
    this.init(ChartTypes.column, this.getYears.bind(this));
    this.buildOptions.subscribe(
      (() => {
        let flag = true;
        return (b: MergedSelect) => {
          this.sources = { ...this.sources, ...b };
          if (flag) {
            this.getData();
          }
          flag = false;
        };
      })()
    );
  }

  private getYears(caller?: ResetCaller): void {
    const qb: BuildQueryObj = {
      size: 100000,
    };
    this.rangeService
      .getYears(this.rangeService.buildquery(qb).build() as ElasticsearchQuery)
      .subscribe();
  }

  private getData(): void {
    this.itemsService
      .getItems(this.barService.buildQuery())
      .pipe(map(this.mapDataToColmns.bind(this)))
      .subscribe(
        (series: Array<Highcharts.SeriesColumnOptions>) =>
          (this.chartOptions = this.setOptions(series))
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

  private setOptions(
    series: Array<Highcharts.SeriesColumnOptions>
  ): Highcharts.Options {
    return {
      chart: { type: ChartTypes.column },
      xAxis: { type: 'category', crosshair: true },
      yAxis: { min: 0, title: { text: 'Publications' } },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          borderRadius: 2.5,
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      series: [...series],
      ...this.cms.commonProperties(),
    };
  }
}
