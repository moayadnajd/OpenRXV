import { Component, OnInit } from '@angular/core';
import { ParentChart } from '../parent-chart';
import { ChartMathodsService } from '../services/chartCommonMethods/chart-mathods.service';
import {
  ChartTypes,
  ComponentDashboardConfigs,
} from 'src/configs/generalConfig.interface';
import {
  Bucket,
  ResetCaller,
  BuildQueryObj,
  ElasticsearchQuery,
} from 'src/app/filters/services/interfaces';
import { RangeService } from 'src/app/filters/services/range/range.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../store';

// Notes
/**
 * 1 - The keys are: [`crps_by_count`, `funders_by_count`, `top_authors`, `top_affiliations`, `types_sorted_by_count`]
 * 2 - we need to modify the general configs to allow us to get multiple sources
 * 3 - THE YEARS SHOULD BE STORED IN THE STORE AND WE NEED TO GET THEM ONLY ONE TIME (FOR THE RANGE COMP & THIS).
 */

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  providers: [ChartMathodsService, RangeService],
})
export class BarComponent extends ParentChart implements OnInit {
  constructor(
    cms: ChartMathodsService,
    private readonly rangeService: RangeService,
    private readonly store: Store<fromStore.AppState>
  ) {
    super(cms);
    this.rangeService.storeVal = this.store;
  }

  ngOnInit() {
    const { source } = this.componentConfigs as ComponentDashboardConfigs;
    this.rangeService.sourceVal = (source as Array<string>).reduce(
      (prev: string, curr: string) => (curr.includes('year') ? curr : undefined)
    );
    this.init(ChartTypes.bar, this.getYears.bind(this));
    this.buildOptions.subscribe((buckets: Array<Bucket>) => {});
  }

  private getYears(caller?: ResetCaller): void {
    const qb: BuildQueryObj = {
      size: 100000,
    };
    this.rangeService
      .getYears(this.rangeService.buildquery(qb).build() as ElasticsearchQuery)
      .subscribe();
  }
}
