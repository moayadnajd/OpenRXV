
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  form_data = [
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
    }

  ];

  @Input() configs ;

  delete() {
    this.onDelete.emit(true)
  }

  controls = [];
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

    if (!this.configs.componentConfigs.source)
      this.openDialog();

  }

  openDialog(): void {

    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '456px',
      data: { form_data: this.form_data, configs: this.configs }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.edited.emit(result)
    });
  }

}
