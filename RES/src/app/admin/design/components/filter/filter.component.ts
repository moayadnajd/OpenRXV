
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
  iconText: string;
  pre: any
  baseform = [
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
      required: true,
      onChange: (event) => {
        this.pre = event;
        this.setFormDataOprions(event.value)
        this.dialogRef.close();
        this.openDialog();


      },
    }
  ];


  setFormDataOprions(value) {

    switch (value) {
      case 'SearchComponent':
        this.form_data = [...this.baseform, ...
          [
            {
              name: 'placeholder',
              label: 'Placeholder',
              type: 'text',
              required: true,
            }
          ]
        ]
        break;
      case 'LabelComponent':
        this.form_data = [...this.baseform, ...
          [
            {
              name: 'text',
              label: 'Text',
              type: 'textarea',
              required: true,
            },
            {
              name: 'border',
              label: 'Border under label',
              type: 'check',
              required: true,
            },
            {
              name: 'description',
              label: 'Text',
              type: 'textarea',
              required: false,
            }
          ]
        ]
        break;
      case 'RangeComponent':
        this.form_data = [...this.baseform, ...
          [
            {
              name: 'placeholder',
              label: 'Placeholder',
              type: 'text',
              required: true,
            }
          ]
        ]
        break;
      case 'SelectComponent':
        this.form_data = [...this.baseform, ...
          [
            {
              name: 'source',
              label: 'Data Source',
              type: 'metadata',
              required: true,
            },
            {
              name: 'placeholder',
              label: 'Placeholder',
              type: 'text',
              required: true,
            },
            {
              name: 'addInMainQuery',
              label: 'Add the aggrigation in main query',
              type: 'check',
              required: true,
            }
          ]
        ]
        break;
      default:
        this.form_data = this.baseform;
        break;
    }
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
  }
  ngOnInit(): void {
    this.form_data = this.baseform;
    if (!this.configs.component) {

      this.openDialog();

    } else {
      this.setFormDataOprions(this.configs.component)
      this.setIcon()
    }



  }

  openDialog(): void {
    if (this.pre)
      this.configs.component = this.pre.value;

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