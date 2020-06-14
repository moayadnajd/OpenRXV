import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReprotingFormComponent } from "./reproting-form/reproting-form.component";
import { SettingsService } from '../services/settings.service';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  reports:any;
  fileName;

  confirmation = false
  dialogRef: MatDialogRef<any>
  constructor(private settingsService: SettingsService, public dialog: MatDialog,) { }
  async ngOnInit() {
    this.reports = await this.settingsService.readReports()
  }

  newReport() {
    let dialogRef = this.dialog.open(ReprotingFormComponent, {
      data: { form_data: { title: '', fileType: '', file: '' }, reports: this.reports, index: -1 }
    });
  }
  
  clickMethod(title: string, index) {
    if(confirm("Are you sure you want to delete " + title)) {
     this.reports.splice(index, 1)
     this.settingsService.saveReportsSettings(this.reports)
    }
    
  }

  delete(index) {
    this.reports.splice(index, 1)
  }
  getFile(index) {
    console.log(this.reports[index].file.substring(6, this.reports[index].file.length))
    this.settingsService.getFile(this.reports[index].file.substring(6, this.reports[index].file.length))
  
  }
  edit(index) {
    this.dialogRef = this.dialog.open(ReprotingFormComponent, {
      data: { form_data: this.reports[index], reports: this.reports, index: index }
    });
  }


}


