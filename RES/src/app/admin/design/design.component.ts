import { Component, OnInit } from '@angular/core';
import { ComponentCounterConfigs, ComponentFilterConfigs, searchOptions, ComponentDashboardConfigs } from 'src/app/explorer/configs/generalConfig.interface';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit {

  constructor(private settingsService: SettingsService) { }
  counters: Array<any> = []
  filters: Array<any> = []
  dashboard: Array<any> =
    [
      {
        grid: [
          {
            class: 'col-md-12 no-side-padding' ,
            show: true,
            component: 'PieComponent',
            componentConfigs: {
              id: 'pie',
              title: 'Info Products by Type',
              source: 'type',
              description: `
                    All the available information products are represented here and disaggregated by Type.
                    You can toggle on/off individual type of visualization in the list at the right side of
                    the graphic. Click on ICONS:view_headline to export this graphic, click on ICONS:expand_less to collapse it.
                `
            } as ComponentDashboardConfigs,
            scroll: {
              icon: 'pie_chart'
            },
            tour: true
          },
        ]
      },
      {
        grid: [
          { class: 'col-md-6' },
          { class: 'col-md-6' }
        ]
      },
      {
        grid: [
          { class: 'col-md-3' },
          { class: 'col-md-9' }
        ]
      }
    ]

  async ngOnInit() {

    let settings = await this.settingsService.readExplorerSettings()
    this.counters = settings.counters;
    this.filters = settings.filters;

  }

  filtersEdited(value, index) {
    this.filters[index] = this.createFilter(value);
  }
  onFilterDelete(bool, i) {
    // console.log("deleted", bool)
    if (bool)
      this.filters.splice(i, 1);
  }

  counterEdited(value, index) {
    this.counters[index] = this.createCounter(value);
  }


  newFilter() {
    this.filters.push(this.createFilter({ source: null, placeholder: null, addInMainQuery: null }));
  }

  newCounter() {
    this.counters.push(this.createCounter({ source: null, title: null, description: null }));
  }

  onCounterDelete(bool, i) {
    console.log("deleted", bool)
    if (bool)
      this.counters.splice(i, 1);
  }
  async save() {
    await this.settingsService.saveExplorerSettings({ counters: this.counters, filters: this.filters });
  }

  createFilter(obj) {
    let temp = {};
    if (obj.text)
      temp['text'] = obj.text

    if (obj.placeholder)
      temp['placeholder'] = obj.placeholder

    if (obj.source)
      temp['source'] = obj.source == 'total' ? obj.source : obj.source + '.keyword'

    if (obj.addInMainQuery)
      temp['addInMainQuery'] = obj.addInMainQuery

    if (obj.component == "SearchComponent")
      temp['type'] = searchOptions.allSearch

    return {
      show: true,
      component: obj.component ? obj.component : null,
      componentConfigs: temp as ComponentFilterConfigs,
    }
  }
  createCounter(obj) {
    return {
      show: true,
      componentConfigs: {
        id: 'counter_' + obj.source,
        title: obj.title,
        source: obj.source ? obj.source == 'total' ? obj.source : obj.source + '.keyword' : null,
        description: obj.description,
      } as ComponentCounterConfigs,
      scroll: {
        icon: 'dashboard',
      },
      tour: true
    }
  }


}
