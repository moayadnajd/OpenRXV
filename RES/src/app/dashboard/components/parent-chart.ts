import { EventEmitter } from '@angular/core';
import { ComponentDashboardConfigs } from 'src/configs/generalConfig.interface';
import { ChartMathodsService } from './services/chartCommonMethods/chart-mathods.service';
import { Bucket } from 'src/app/filters/services/interfaces';
import { ParentComponent } from 'src/app/parent-component.class';

export class ParentChart extends ParentComponent {
  chartOptions: Highcharts.Options;
  protected buildOptions: EventEmitter<Array<Bucket>>;
  constructor(public readonly cms: ChartMathodsService) {
    super();
    this.buildOptions = new EventEmitter();
    this.chartOptions = {};
  }

  protected init(type: string) {
    this.cms.init(type, this.componentConfigs as ComponentDashboardConfigs);
    this.cms.goBuildDataSeries.subscribe((bu: Bucket[]) => {
      this.cms.setExpanded = bu.length >= 1;
      this.buildOptions.emit(bu);
    });
  }
}
