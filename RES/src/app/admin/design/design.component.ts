import { Component, OnInit } from '@angular/core';
import { ComponentCounterConfigs, ComponentFilterConfigs, searchOptions, ComponentDashboardConfigs } from 'src/app/explorer/configs/generalConfig.interface';
import { SettingsService } from '../services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { GridComponent } from './components/grid/grid.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit {
  constructor(public dialog: MatDialog, private settingsService: SettingsService) { }
  counters: Array<any> = []
  filters: Array<any> = []
  dashboard: Array<any> = []
  icons = []
  newRow(): void {
    const dialogRef = this.dialog.open(GridComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.dashboard.push(result)
    });
  }
  async ngOnInit() {

    let { counters, filters, dashboard } = await this.settingsService.readExplorerSettings()
    this.counters = counters;
    this.filters = filters;
    this.dashboard = dashboard;
    this.icons = this.dashboard.map(d => d[0]?.scroll?.icon);
    console.log(this.icons)
  }

  onAddDashboardComponent(index2, index) {
    console.log('onAddDashboardComponent', index2, index)
    this.dashboard[index][index2] = this.createDashboardItem({}, index, index2);
  }
  dashboardEdited(event, index) {
    this.dashboard[index][event.index] = this.createDashboardItem(event.result, index, event.index);
    console.log(this.dashboard);
  }

  filtersEdited(value, index) {
    this.filters[index] = this.createFilter(value);
  }
  onFilterDelete(bool, i) {
    // console.log("deleted", bool)
    if (bool)
      this.filters.splice(i, 1);
  }
  dashboardRawDeleted(bool, index) {
    console.log('dashboardRawDeleted')
    if (bool)
      this.dashboard.splice(index, 1);
  }
  onDashboardItemDelete(index, index2) {
    delete this.dashboard[index2][index].component;
    delete this.dashboard[index2][index].componentConfigs;
  }



  counterEdited(value, index) {
    this.counters[index] = this.createCounter(value);
  }
  dropDashboard(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dashboard, event.previousIndex, event.currentIndex);
    this.icons = this.dashboard.map(d => d[0]?.scroll?.icon);
  }
  dropFilter(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.filters, event.previousIndex, event.currentIndex);
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
    await this.settingsService.saveExplorerSettings({ counters: this.counters, filters: this.filters, dashboard: this.dashboard });
  }
  createDashboardItem(obj, index, index1) {
    let temp = {};
    if (obj.title)
      temp['title'] = obj.title

    if (obj.description)
      temp['description'] = obj.description

    if (obj.source)
      temp['source'] = obj.source == 'total' ? obj.source : obj.source
    if (obj.source)
      temp['id'] = temp['source'] + '_' + index + '_' + index1

    var class_name = null

    if (typeof obj.class == 'string')
      class_name = obj.class

    return {
      class: class_name + ' no-side-padding',
      show: true,
      component: obj.component ? obj.component : null,
      componentConfigs: temp as ComponentFilterConfigs,
      scroll: obj.scroll ? obj.scroll : null,
      tour: true
    }
  }
  createFilter(obj) {
    let temp = {};
    if (obj.text)
      temp['text'] = obj.text

    if (obj.placeholder)
      temp['placeholder'] = obj.placeholder
    if (obj.description)
      temp['description'] = obj.description

    if (obj.border)
      temp['border'] = obj.border

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
