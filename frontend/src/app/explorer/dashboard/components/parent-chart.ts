import { EventEmitter } from '@angular/core';
import {
  ComponentDashboardConfigs,
  MergedSelect
} from 'src/app/explorer/configs/generalConfig.interface';
import { ChartMathodsService } from './services/chartCommonMethods/chart-mathods.service';
import { Bucket } from 'src/app/explorer/filters/services/interfaces';
import { ParentComponent } from 'src/app/explorer/parent-component.class';

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

      if (bu.length ==0)
     this.cms.setExpanded = false
      else {
        this.cms.setExpanded = true
      }
      this.buildOptions.emit(bu);
    });
  }

  private checkExpandedForObject(bu: MergedSelect): boolean {
    const arr: Array<Bucket> = [];
    for (const key in bu) {
      if (bu.hasOwnProperty(key)) {
        arr.push(...bu[key]);
      }
    }
    return arr.length >= 1;
  }
}
