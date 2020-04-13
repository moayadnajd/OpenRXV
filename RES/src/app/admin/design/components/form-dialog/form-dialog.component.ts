import { Component, OnInit, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { MetadataService } from 'src/app/admin/services/metadata.service';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {
  controls = [];
  form: FormGroup;
  metadata = []
  constructor(
    private metadataService: MetadataService,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  submit() {
    if (this.form.valid)
      this.dialogRef.close(this.form.value);

  }
  async ngOnInit() {
    let FormGroupControls: any = {};
    this.data.form_data.forEach(element => {
      console.log(this.data.configs.componentConfigs[element.name])
      if (this.data.configs.componentConfigs[element.name]!=null)
        FormGroupControls[element.name] = new FormControl(this.data.configs.componentConfigs[element.name]);
      else
        FormGroupControls[element.name] = new FormControl(null);
    });
    this.form = new FormGroup(FormGroupControls);
    this.metadata = await this.metadataService.get()
  }

}
