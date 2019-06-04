import { Component, OnInit } from '@angular/core';
import { ParentChart } from '../parent-chart';
import { ChartMathodsService } from '../services/chartCommonMethods/chart-mathods.service';
import { ChartTypes } from 'src/configs/generalConfig.interface';
import { Bucket } from 'src/app/filters/services/interfaces';

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
  providers: [ChartMathodsService]
})
export class BarComponent extends ParentChart implements OnInit {
  constructor(cms: ChartMathodsService) {
    super(cms);
  }

  ngOnInit() {
    this.init(ChartTypes.bar);
    this.buildOptions.subscribe((buckets: Array<Bucket>) => {
      console.log(buckets);
    });
  }
}
