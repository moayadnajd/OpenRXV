import { EventEmitter } from '@angular/core';
import {
  ComponentDashboardConfigs,
  MergedSelect,
} from 'src/configs/generalConfig.interface';
import { ChartMathodsService } from './services/chartCommonMethods/chart-mathods.service';
import { Bucket } from 'src/app/filters/services/interfaces';
import { ParentComponent } from 'src/app/parent-component.class';

export class ParentChart extends ParentComponent {
  chartOptions: Highcharts.Options;
  protected buildOptions: EventEmitter<Array<Bucket> | MergedSelect>;
  constructor(public readonly cms: ChartMathodsService) {
    super();
    this.buildOptions = new EventEmitter<Array<Bucket>>();
    this.chartOptions = {};
  }

  protected init(type: string, cb?: () => any) {
    this.cms.init(type, this.componentConfigs as ComponentDashboardConfigs, cb);
    this.cms.goBuildDataSeries.subscribe((bu: Bucket[] | MergedSelect) => {
      if (bu) {
        if (Array.isArray(bu)) {
          this.cms.setExpanded = bu.length >= 1;
        } else {
          //   TODO :::::
          this.cms.setExpanded = true;
        }
      } else {
        this.cms.setExpanded = false;
      }
      this.buildOptions.emit(bu);
    });
  }
}
