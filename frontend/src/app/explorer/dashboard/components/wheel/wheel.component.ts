import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ChartMathodsService } from '../services/chartCommonMethods/chart-mathods.service';
import * as Highcharts from 'highcharts';
import { ParentChart } from '../parent-chart';
import { Bucket } from 'src/app/explorer/filters/services/interfaces';
import { ComponentLookup } from '../dynamic/lookup.registry';
import { SettingsService } from 'src/app/admin/services/settings.service';
@ComponentLookup('WheelComponent')
@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss'],
  providers: [ChartMathodsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WheelComponent extends ParentChart implements OnInit {
  colors: string[]
  constructor(
    cms: ChartMathodsService,
    private settingsService: SettingsService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(cms);
  }


  async ngOnInit() {
    let appearance = await this.settingsService.readAppearanceSettings()
    this.colors = appearance.chartColors;
    this.init('dependencywheel');
    this.buildOptions.subscribe((buckets: Array<Bucket>) => {
      if (buckets) {
        this.chartOptions = this.setOptions(buckets);
      }
      this.cdr.detectChanges();
    });
  }

  private setOptions(buckets: Array<Bucket>): any {

    let data = buckets.map((b: Bucket) => (b.related.buckets.filter(d => b.key != d.key).map(d => [b.key.substr(0, 50), d.key.substr(0, 50), d.doc_count]))).flat(1)
    return {
    
      accessibility: {
        point: {
          valueDescriptionFormat: '{index}. From {point.from} to {point.to}: {point.weight}.'
        }
      },
      colors: this.colors,
      series: [{
        keys: ['from', 'to', 'weight'],
        data: data,
        type: 'dependencywheel',
        dataLabels: {
          color: '#333',
          textPath: {
            enabled: true,
            attributes: {
              dy: 5
            }
          },
          distance: 10
        },
        size: '95%'
      }],
      ...this.cms.commonProperties(),
    };
  }
}
