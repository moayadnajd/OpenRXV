import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ChartMathodsService } from '../services/chartCommonMethods/chart-mathods.service';
const mapWorld = require('@highcharts/map-collection/custom/world-robinson-highres.geo.json');
import * as Highcharts from 'highcharts';
import { ParentChart } from '../parent-chart';
import { Bucket } from 'src/app/explorer/filters/services/interfaces';
import { getCountryCode } from '../services/countryList.helper';
import { ComponentLookup } from '../dynamic/lookup.registry';

@ComponentLookup('MapComponent')
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [ChartMathodsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent extends ParentChart implements OnInit {
  constructor(
    cms: ChartMathodsService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(cms);
  }

  ngOnInit(): void {
    this.init('map');
    this.buildOptions.subscribe((buckets: Array<Bucket>) => {
      if (buckets) {
        this.chartOptions = this.setOptions(buckets);
      }
      this.cdr.detectChanges();
    });
  }

  private setOptions(buckets: Array<Bucket>): Highcharts.Options {
    return {
      chart: {
        map: mapWorld
      },
      mapNavigation: {
        enabled: true,
        enableMouseWheelZoom: true,
        buttonOptions: {
          alignTo: 'spacingBox',
          verticalAlign: 'bottom'
        }
      },
      colorAxis: {
        min: 1,
        type: 'logarithmic',
        minColor: localStorage.getItem('minColor'),
        maxColor:  localStorage.getItem('primaryColor'),
        stops: [
          [0,  localStorage.getItem('minColor')],
          [0.67, localStorage.getItem('midColor')],
          [1, localStorage.getItem('primaryColor')]
        ]
      },
      series: [
        {
          data: buckets.map((b: Bucket) => [
            getCountryCode(b.key),
            b.doc_count
          ]),
          mapData: mapWorld,
          showInLegend: false,
          cursor: 'pointer',
          enableMouseTracking: true,
          allowPointSelect: true,
          tooltip: {
            pointFormat: '{point.name}: <b>{point.value} Publications</b><br/>',
            headerFormat: undefined
          },
          animation: {
            duration: 0
          },
          states: {
            hover: {
              color: '#427730',
            },
            select: {
              color: '#427730',
              borderColor: '#000000'
            }
          }
        }
      ],
      ...this.cms.commonProperties()
    } as Highcharts.Options;
  }
}
