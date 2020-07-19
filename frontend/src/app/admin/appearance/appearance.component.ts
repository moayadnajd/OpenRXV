import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {
  color
  appearance
  logo
  form: FormGroup = new FormGroup({
    primary_color: new FormControl(this.color),
    website_name: new FormControl(''),
    logo: new FormControl(''),
    tracking_code: new FormControl(''),
    chartColors: new FormArray([])
  })
  constructor(private settingsService: SettingsService) { }
  src(value) {
    return environment.api + '/' + value;
  }
  async ngOnInit() {
    let appearance = await this.settingsService.readAppearanceSettings();
    this.appearance = appearance
    this.form.patchValue(appearance)
    this.color = appearance.primary_color;
    this.logo = appearance.logo;
    await appearance.chartColors.map(a => { this.colors.push(new FormControl(a)) })

  }
  colorPickerClose(event) {
    this.form.get('primary_color').setValue(event);

  }
  addColor() {
    this.colors.push(new FormControl(''))
  }
  get colors(): FormArray {
    return this.form.get('chartColors') as FormArray;
  }

  async save() {
    this.form.controls.logo.setValue(this.logo);
    if (this.form.valid)
      await this.settingsService.saveAppearanceSettings(this.form.value);
  }

  logoChange(event) {
    this.upload(event.target.files[0])
  }

  async upload(file: File) {
    this.logo = await this.settingsService.upload(file)
    this.form.controls.logo.setValue(this.logo);
  }
  deleteColor(index) {
    this.colors.removeAt(index)
  }

}
