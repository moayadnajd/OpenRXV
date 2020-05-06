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
    if (Object.values(this.pluginsForms).filter((form: FormArray) => form.valid).length == Object.values(this.pluginsForms).length)
      await this.settingsService.writePluginsSettings(
        Object.values(this.pluginsForms).map(
          (form: FormArray, index) => {
            let obj = {}; obj['name'] = Object.keys(this.pluginsForms)[index]; obj['value'] = form.value; return obj
          })
      );
  }

}
