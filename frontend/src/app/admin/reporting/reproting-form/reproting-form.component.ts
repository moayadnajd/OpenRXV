import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SettingsService } from "../../../admin/services/settings.service";
import { FormDialogComponent } from '../../design/components/form-dialog/form-dialog.component';
import { ReportingComponent } from "../reporting.component";
import { throwIfEmpty } from 'rxjs/operators';
import { objectEach } from 'highcharts';
@Component({
  selector: 'app-reproting-form',
  templateUrl: './reproting-form.component.html',
  styleUrls: ['./reproting-form.component.scss'],
})
export class ReprotingFormComponent implements OnInit {
  openDialogs: MatDialogRef<any>;
  constructor(private settingsService: SettingsService,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  preReport: any
  preform: any
  formValues: any
  file
  a
  ngOnInit(): void {
    this.formValues = Object.assign(this.data.form_data)
    this.a = Object.getOwnPropertyDescriptors(this.data.form_data)

  }
  src(value) {
    console.log(value)
  }
  onClick() {
    console.log('upload works')
  }

  saveForm() {
    if (this.data.index == -1)
      this.data.reports.push(this.formValues)
    else {
      this.data.reports[this.data.index] = this.formValues
    }
    this.settingsService.saveReportsSettings(this.data.reports);
    this.dialogRef.close(this.formValues)

  }


  closeForm() {
    this.formValues.title = this.a.title.value
    this.formValues.file = this.a.file.value
    this.formValues.fileType = this.a.fileType.value
    this.data.reports[this.data.index] = this.formValues
    this.dialogRef.close()
  }

  fileChange(event) {
    this.upload(event.target.files[0])
  }

  removeFile() {
    this.formValues.file = ''
  }

  async upload(file: File) {

    this.formValues.file = await this.settingsService.uploadFile(file)
  }

}
