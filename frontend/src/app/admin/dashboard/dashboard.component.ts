import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private setttingService: SettingsService) { }
  completed_count = 0
  completed = new MatTableDataSource<Array<any>>([])
  active_count = 0;
  waiting_count = 0;
  failed_count = 0;
  active = new MatTableDataSource<Array<any>>([])
  waiting = new MatTableDataSource<Array<any>>([]);
  failed = new MatTableDataSource<Array<any>>([]);
  interval = null
  refreshCounter = 0;
  ngOn
  async ngOnInit() {
    this.Init();
  }
  ngOnDestroy() {
    this.clearInterval();
  }
  setinterval() {
    if (!this.interval)
      this.interval = setInterval(() => {
        this.Init()
      }, 6000)
  }

  clearInterval() {
    if (this.interval != null){
      clearInterval(this.interval)
      this.interval=null;
    }
  }

  async startIndex() {
    await this.setttingService.startIndexing();
    this.refreshCounter = 0
    this.Init()

  }

  async stopIndex() {
    this.refreshCounter = 0
    await this.setttingService.stopIndexing();
    this.Init()
  }

  async Init() {

    let { completed_count, active_count, failed_count, waiting_count, waiting, completed, active, failed } = await this.setttingService.getHarvesterInfo();
    this.completed = completed
    this.completed = new MatTableDataSource<Array<any>>(completed)
    this.completed_count = completed_count

    this.active_count = active_count
    this.active = active
    this.active = new MatTableDataSource<Array<any>>(active)
    

    this.failed = failed
    this.failed = new MatTableDataSource<Array<any>>(failed)
    this.failed_count = failed_count

    this.waiting = waiting
    this.waiting = new MatTableDataSource<Array<any>>(waiting)
    this.waiting_count = waiting_count
    if (active_count == 0 && waiting_count == 0 && this.refreshCounter >= 3)
      this.clearInterval()

    if (this.refreshCounter == 0)
      this.setinterval()

    this.refreshCounter++;
  }

}
