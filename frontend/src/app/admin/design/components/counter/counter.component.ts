import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { isEmpty } from 'ramda';


@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  @Output() edited: EventEmitter<any> = new EventEmitter()
  @Output() onDelete: EventEmitter<boolean> = new EventEmitter()

  form_data = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'source',
      label: 'Data Source',
      type: 'metadata',
      required: true
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      items: [
        { name: "Count of distinct values", value: "cardinality" },
        { name: "Sums up numeric values", value: "sum" },
        { name: "Computes the average of numeric values", value: "avg" }
      ],
      required: true
    },
    {
      name: 'description',
      label: 'Tour Description',
      type: 'textarea',
      required: true
    },
    {
      name: 'filter',
      label: 'Value to filter the counter on',
      type: 'text',
      required: false
    },
    {
      name: 'percentageFromTotal',
      label: 'Show Percentage From Total',
      type: 'check',
      required: false
    },
  ];

  @Input() configs;

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
      if (!result && isEmpty(this.configs.componentConfigs))
        this.onDelete.emit(!result)
    });
  }

}
