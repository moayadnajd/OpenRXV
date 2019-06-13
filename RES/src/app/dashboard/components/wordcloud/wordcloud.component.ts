import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartMathodsService } from '../services/chartCommonMethods/chart-mathods.service';
import { ParentChart } from '../parent-chart';
import { Bucket } from 'src/app/filters/services/interfaces';

@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.scss'],
  providers: [ChartMathodsService],
})
export class WordcloudComponent extends ParentChart implements OnInit {
  constructor(cms: ChartMathodsService) {
    super(cms);
  }

  ngOnInit(): void {
    this.init('wordcloud');
    this.buildOptions.subscribe(
      (buckets: Array<Bucket>) => (this.chartOptions = this.setOptions(buckets))
    );
  }

  private setOptions(buckets: Array<Bucket>): Highcharts.Options {
    return {
      chart: {
        type: 'wordcloud',
        animation: true,
      },
      plotOptions: {
        wordcloud: {
          tooltip: {
            pointFormat: ' <b>{point.weight}</b>',
            headerFormat: '{point.key}:',
          } as Highcharts.TooltipOptions,
          rotation: 90,
          cursor: 'pointer',
          allowPointSelect: false,
        } as Highcharts.PlotWordcloudOptions,
      },
      series: [
        {
          type: 'wordcloud',
          data: buckets.map((b: Bucket) => ({
            name: b.key,
            weight: b.doc_count,
          })),
        },
      ],
      ...this.cms.commonProperties(),
    };
  }
}
