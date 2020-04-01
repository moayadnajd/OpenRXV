import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup = new FormGroup({
    elasticsearch: new FormControl('empty'),
    redis: new FormControl('empty'),
  });
  secondFormGroup: FormGroup = new FormGroup({
    index_name: new FormControl('empty'),
    cron: new FormControl('empty'),
    asd: new FormControl(true),
  });

  repositories: FormArray = new FormArray([
    new FormGroup({
      name: new FormControl(),
      startPage: new FormControl(),
      itemsEndPoint: new FormControl(),
      allCores: new FormControl(),
      schema: new FormArray([
        new FormGroup({
          id: new FormControl(),
          handle: new FormControl(),
        })
      ])
    })
  ]);

  constructor(private settingService: SettingsService) { }

  ngOnInit() {



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
          new FormGroup({
            id: new FormControl(),
            handle: new FormControl(),
          })
        ])
      })
    )
  }
  delete(schema: FormArray, index: number) {
    schema.removeAt(index);
  }

  AddNewMetadata(schema: FormArray) {

    schema.push(
      new FormGroup({
        id: new FormControl(),
        handle: new FormControl(),
      }))

  }

}
