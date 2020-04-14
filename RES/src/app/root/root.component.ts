import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../admin/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  loadSettigs: boolean = false;
  constructor(

    private readonly settingsService: SettingsService
  ) { }

  async ngOnInit() {
    let settings = await this.settingsService.readExplorerSettings();
    await localStorage.setItem('configs', JSON.stringify(settings))
    this.loadSettigs = true
  }

}
