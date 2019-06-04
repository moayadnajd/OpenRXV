import { EventEmitter } from '@angular/core';
import { ComponentDashboardConfigs } from 'src/configs/generalConfig.interface';
import { ChartMathodsService } from './services/chartCommonMethods/chart-mathods.service';
import { Bucket } from 'src/app/filters/services/interfaces';
import { ParentComponent } from 'src/app/parent-component.class';

export class ParentChart extends ParentComponent {
  chartOptions: Highcharts.Options;
  private type: string;
  protected buildOptions: EventEmitter<Array<Bucket>>;
  constructor(public readonly cms: ChartMathodsService) {
    super();
    this.buildOptions = new EventEmitter();
    this.chartOptions = {};
  }

  protected init(type: string) {
    this.type = type;
    this.cms.init(type, this.componentConfigs as ComponentDashboardConfigs);
    this.cms.goBuildDataSeries.subscribe((bu: Bucket[]) =>
      this.buildDataSeries(bu).buildOptions.emit(bu)
    );
  }

  /**
   * the default value is just for safe checking,
   * so if there is no buckets, no errors will be
   * logged to the console
   */
  private buildDataSeries(bu: Bucket[] = []): ParentChart {
    const { title } = this.componentConfigs as ComponentDashboardConfigs;
    const series = [
      {
        name: title,
        data: [],
        type: this.type,
        allowPointSelect: true
      }
    ];
    this.cms.setExpanded = bu.length >= 1;
    return this;
  }
}
