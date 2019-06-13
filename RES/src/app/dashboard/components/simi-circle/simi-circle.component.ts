import { Component, OnInit } from '@angular/core';
import { ChartMathodsService } from '../services/chartCommonMethods/chart-mathods.service';
import * as Highcharts from 'highcharts';
import { ParentChart } from '../parent-chart';

@Component({
  selector: 'app-simi-circle',
  templateUrl: './simi-circle.component.html',
  styleUrls: ['./simi-circle.component.scss'],
  providers: [ChartMathodsService],
})
export class SimiCircleComponent extends ParentChart implements OnInit {
  constructor(cms: ChartMathodsService) {
    super(cms);
  }

  ngOnInit(): void {
    this.init('pie');
    this.buildOptions.subscribe(() => (this.chartOptions = this.setOptions()));
  }

  private setOptions(): any {
    return {
      chart: {
        type: 'pie',
        animation: true,
      },
      title: {
        text: 'Items status',
        align: 'center',
        verticalAlign: 'middle',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
          },
        },
      },
      series: [{ innerSize: '70%', ...this.chartOptions.series[0] }],
      ...this.cms.commonProperties(),
    };
  }
}
