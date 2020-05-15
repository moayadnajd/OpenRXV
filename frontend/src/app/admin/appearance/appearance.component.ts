import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {
  color
  logo
  form: FormGroup = new FormGroup({
    primary_color: new FormControl(this.color),
    website_name: new FormControl(''),
    logo: new FormControl('')
  })
  constructor(private settingsService: SettingsService) { }
  src(value) {
    return environment.api + '/' + value;
  }
  async ngOnInit() {
    let { appearance } = await this.settingsService.readExplorerSettings();
    this.form.patchValue(appearance)
    this.color = appearance.primary_color;
    this.logo = appearance.logo;
  }
  colorPickerClose(event) {
    console.log(event, this.color)
    this.form.get('primary_color').setValue(event);

  }
  async save() {
    console.log(this.color, this.form.value)
    this.form.controls.logo.setValue(this.logo);
    if (this.form.valid)
      await this.settingsService.saveExplorerSettings({ appearance: this.form.value });
  }

  logoChange(event) {
    this.upload(event.target.files[0], 'logo')
  }

  async upload(file: File, name: string) {
    this.logo = await this.settingsService.upload(file, name)
    this.form.controls.logo.setValue(this.logo);
  }

}
