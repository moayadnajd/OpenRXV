import { Component, OnInit } from '@angular/core';
import { ComponentCounterConfigs, ComponentFilterConfigs } from 'src/app/explorer/configs/generalConfig.interface';
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
    return {
      show: true,
      component: 'SelectComponent',
      componentConfigs: {
        placeholder: obj.placeholder,
        source: obj.source ? obj.source == 'total' ? obj.source : obj.source + '.keyword' : null,
        addInMainQuery: obj.placeholder ? obj.placeholder : false,
      } as ComponentFilterConfigs,
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
