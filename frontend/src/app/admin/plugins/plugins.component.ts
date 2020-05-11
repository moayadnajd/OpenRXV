import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.scss']
})
export class PluginsComponent implements OnInit {
  plugins = []
  pluginsForms = {};
  constructor(private settingsService: SettingsService) { }

  async ngOnInit() {
    this.plugins = await this.settingsService.readPluginsSettings();
  }

  onEdited(event, name) {
    this.pluginsForms[name] = event;
    console.log(this.pluginsForms);
  }

  async save() {
    let final = Object.values(this.pluginsForms).filter((data: any) => data.active).filter((data: any) => data.form.valid)
    await this.settingsService.writePluginsSettings(
      final.map(
        (data: any) => {
          let obj = {}; obj['name'] = data.name; obj['value'] = data.form.value; return obj
        })
    );
  }

}
