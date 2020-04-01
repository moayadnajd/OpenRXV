import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { async } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup = new FormGroup({
    elasticsearch: new FormControl(''),
    redis: new FormControl(''),
  });
  secondFormGroup: FormGroup = new FormGroup({
    index_name: new FormControl(''),
    cron: new FormControl(''),
    startOnFirstInit: new FormControl(),
  });

  baseSchema() {
    return {
      metadata: new FormControl(),
      disply_name: new FormControl(),
    }

  }

  repositories: FormArray = new FormArray([
    new FormGroup({
      name: new FormControl(),
      startPage: new FormControl(),
      itemsEndPoint: new FormControl(),
      allCores: new FormControl(),
      schema: new FormArray([
        new FormGroup(this.baseSchema())
      ])
    })
  ]);

  constructor(private settingService: SettingsService, private toastr: ToastrService) { }

  async ngOnInit() {
  
    let data = await this.settingService.read()
    await this.firstFormGroup.patchValue(data);
    await this.secondFormGroup.patchValue(data);
    data.repositories.forEach((element, repoindex) => {
      console.log(repoindex);
      if (repoindex > 0)
        this.AddNewRepo()
      element.schema.forEach((element, index) => {
        if (index > 0)
          this.AddNewMetadata(this.repositories.at(repoindex).get('schema'))
      });
    });
    await this.repositories.patchValue(data.repositories)


    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  submit() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.repositories.valid) {
      let settings = { ...this.firstFormGroup.value, ...this.secondFormGroup.value, ...{ repositories: this.repositories.value } }
      this.settingService.save(settings);
    }

  }

  AddNewRepo() {
    this.repositories.push(
      new FormGroup({
        name: new FormControl(),
        startPage: new FormControl(),
        itemsEndPoint: new FormControl(),
        allCores: new FormControl(),
        schema: new FormArray([
          new FormGroup(
            this.baseSchema(),
          )
        ])
      })
    )
  }
  delete(schema: FormArray, index: number) {
    schema.removeAt(index);
  }

  AddNewMetadata(schema: any) {

    schema.push(new FormGroup(this.baseSchema()))

  }

}
