
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { searchOptions, ComponentSearchConfigs, ComponentFilterConfigs } from 'src/app/explorer/configs/generalConfig.interface';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() edited: EventEmitter<any> = new EventEmitter()
  @Output() onDelete: EventEmitter<boolean> = new EventEmitter()
  dialogRef: MatDialogRef<any>
  form_data = [];
  icon: string;
  iconText:string;
  pre: any
  restart() {
    this.form_data = [
      {
        name: 'component',
        label: 'Item Type',
        type: 'select',
        items: [
          { name: "Label", value: "LabelComponent" },
          { name: "Select", value: "SelectComponent" },
          { name: "Search", value: "SearchComponent" },
          { name: "Range", value: "RangeComponent" },
        ],
        onChange: (event) => {
          if (event.name == 'Search') {
            this.form_data.splice(1, 1)
            this.form_data.splice(2, 2)
          }
          else {
            if (this.pre && this.pre.name == "Search") {
              this.restart()
              this.dialogRef.close();
              this.openDialog();
            }
          }

          if (event.name == 'Label')
            this.form_data.splice(2, 3)
          else {
            if (this.pre && this.pre.name == "Label") {
              this.restart()
              this.dialogRef.close();
              this.openDialog();
            }
          }
          this.pre = event;
        },
        required: true,
      },
      {
        ngIf: (event = null) => {
          if (this.pre)
            return this.pre.name == "Label" || event == "Label"
          else
            return false
        },
        name: 'text',
        label: 'Text',
        type: 'textarea',
        required: false,
      },
      {
        name: 'placeholder',
        label: 'Placeholder',
        type: 'text',
        required: true,
      },
      {
        name: 'source',
        label: 'Data Source',
        type: 'metadata',
        required: true,
      },
      {
        name: 'addInMainQuery',
        label: 'Add the aggrigation in main query',
        type: 'check',
        required: true,
      }];


  }

  @Input() configs;

  delete() {
    this.onDelete.emit(true)
  }

  controls = [];
  constructor(public dialog: MatDialog) { }
  setIcon() {
    let icons = {
      SelectComponent: 'list',
      LabelComponent: 'label',
      SearchComponent: 'search',
      RangeComponent: 'settings_ethernet'
    }
    let iconsTexts = {
      SelectComponent: 'Select',
      LabelComponent: 'Label',
      SearchComponent: 'Search',
      RangeComponent: 'Range'
    }


    this.icon = icons[this.configs.component]
    this.iconText = iconsTexts[this.configs.component];
    console.log(this.icon);
  }
  ngOnInit(): void {
    this.restart()
    console.log(this.configs);
    if (this.configs.component == 'LabelComponent') {
      this.form_data.splice(2, 3)
      this.pre = { name: "Label", value: "LabelComponent" }
    }
    if (!this.configs.component) {
      this.openDialog();

    } else
      this.setIcon()




  }

  openDialog(): void {

    this.dialogRef = this.dialog.open(FormDialogComponent, {
      width: '456px',
      data: { form_data: this.form_data, configs: this.configs }
    });


    this.dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.edited.emit(result)

    });
  }

}
