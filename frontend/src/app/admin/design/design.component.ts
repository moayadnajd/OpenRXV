import { Component, OnInit } from '@angular/core';
import { ComponentCounterConfigs, ComponentFilterConfigs, searchOptions, ComponentDashboardConfigs } from 'src/app/explorer/configs/generalConfig.interface';
import { SettingsService } from '../services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { GridComponent } from './components/grid/grid.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SortComponent } from './components/sort/sort.component';
import { environment } from 'src/environments/environment';

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
  footer: any = null;
  footerEditor = {
    height: 500,
    menubar: 'insert',
    forced_root_block: 'div',
    forced_root_block_attrs: {
      'class': 'row'
    },
    images_upload_url: environment.api + '/settings/upload/image',
    images_upload_base_path: environment.api + '/',
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
      'image code'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | image | code'

  }
  newRow(): void {
    const dialogRef = this.dialog.open(GridComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.dashboard.push(result)
    });
  }

  sortCounter() {
    const dialogRef = this.dialog.open(SortComponent, {
      data: this.counters,
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.counters = result
    });
  }
  async ngOnInit() {

    let { counters, filters, dashboard, footer } = await this.settingsService.readExplorerSettings()
    this.counters = counters;
    this.filters = filters;
    this.dashboard = dashboard;
    this.footer = footer
  }

  onAddDashboardComponent(index2, index) {
    this.dashboard[index][index2] = this.createDashboardItem({}, index, index2);

  }
  dashboardEdited(event, index) {
    this.dashboard[index][event.index] = this.createDashboardItem(event.result, index, event.index);
  }

  filtersEdited(value, index) {
    this.filters[index] = this.createFilter(value);
  }
  onFilterDelete(bool, i) {
    if (bool)
      this.filters.splice(i, 1);
  }
  dashboardRawDeleted(bool, index) {
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
    if (bool)
      this.counters.splice(i, 1);
  }
  async save() {
    await this.settingsService.saveExplorerSettings({ counters: this.counters, filters: this.filters, dashboard: this.dashboard, footer: this.footer });
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


    if (obj.source_x && obj.source_y) {
      temp['source'] = [obj.source_x, obj.source_y + '.keyword'];
      temp['source_y'] = obj.source_y;
      temp['source_x'] = obj.source_x;
      temp['id'] = obj.source_x + '_' + obj.source_y + '_' + index + '_' + index1
    }

    if (obj.content) {
      temp['content'] = obj.content;
      temp['content'].icon = 'repo';
    }

    if (obj.component == 'MainListComponent')
      temp['id'] = 'main_list' + '_' + index + '_' + index1




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
    let temp = {};


    if (obj.title)
      temp['title'] = obj.title;

    if (obj.description)
      temp['description'] = obj.description;

    if (obj.source) {
      temp['source'] = obj.source == 'total' ? obj.source : obj.source + '.keyword'

      temp['id'] = 'counter_' + obj.source;
      if (obj.filter) {
        temp['id'] = 'counter_' + obj.source + obj.filter.replace(/\s/g, '');
      }
    }


    if (obj.filter)
      temp['filter'] = obj.filter

    if (obj.percentageFromTotal)
      temp['percentageFromTotal'] = obj.percentageFromTotal

    return {
      show: true,
      componentConfigs: temp as ComponentCounterConfigs,
      scroll: {
        icon: 'dashboard',
      },
      tour: true
    }
  }


}
