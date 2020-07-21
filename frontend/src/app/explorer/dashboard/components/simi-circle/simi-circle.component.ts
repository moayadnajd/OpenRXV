import { Component, OnInit } from '@angular/core';
import { ChartMathodsService } from '../services/chartCommonMethods/chart-mathods.service';
import * as Highcharts from 'highcharts';
import { ParentChart } from '../parent-chart';
import { ComponentLookup } from '../dynamic/lookup.registry';
import { SettingsService } from 'src/app/admin/services/settings.service';

@ComponentLookup('SimiCircleComponent')
@Component({
  selector: 'app-simi-circle',
  templateUrl: './simi-circle.component.html',
  styleUrls: ['./simi-circle.component.scss'],
  providers: [ChartMathodsService],
})
export class SimiCircleComponent extends ParentChart implements OnInit {
  colors: string[];
  constructor(cms: ChartMathodsService,
    private settingsService: SettingsService) {
    super(cms);
  }

 async ngOnInit() {
    let appearance = await this.settingsService.readAppearanceSettings()
    this.colors = appearance.chartColors;
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
      colors: this.colors,
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
