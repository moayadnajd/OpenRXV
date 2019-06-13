import { Component, OnInit } from '@angular/core';
import { ChartMathodsService } from '../services/chartCommonMethods/chart-mathods.service';
import * as Highcharts from 'highcharts';
import { ParentChart } from '../parent-chart';
import { Bucket } from 'src/app/filters/services/interfaces';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
  providers: [ChartMathodsService],
})
export class PieComponent extends ParentChart implements OnInit {
  constructor(cms: ChartMathodsService) {
    super(cms);
  }

  ngOnInit(): void {
    this.init('pie');
    this.buildOptions.subscribe(
      (buckets: Array<Bucket>) => (this.chartOptions = this.setOptions(buckets))
    );
  }

  private setOptions(buckets: Array<Bucket>): Highcharts.Options {
    return {
      chart: {
        type: 'pie',
        animation: true,
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          showInLegend: true,
          tooltip: {
            pointFormat: ' <b>{point.y}</b>',
            headerFormat: '{point.key}:',
          },
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [
        {
          type: 'pie',
          data: buckets.map((b: Bucket) => ({ name: b.key, y: b.doc_count })),
        },
      ],
      ...this.cms.commonProperties(),
    };
  }
}
