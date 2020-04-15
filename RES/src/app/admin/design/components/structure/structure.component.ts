import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class StructureComponent implements OnInit {
  @Output() edited: EventEmitter<any> = new EventEmitter()
  @Output() onAdd: EventEmitter<any> = new EventEmitter()
  @Output() onDelete: EventEmitter<boolean> = new EventEmitter()
  @Output() rowDeleted: EventEmitter<boolean> = new EventEmitter()
  class_names = []
  options = [
    { name: "Pie Chart", value: "PieComponent", icon: "pie_chart" },
    { name: "Word Cloud", value: "WordcloudComponent", icon: "filter_drama" }
  ]
  pre
  dialogRef: MatDialogRef<any>
  form_data = [
    {
      name: 'component',
      label: 'Compinent Type',
      type: 'select',
      items: this.options,
      onChange: (event) => {
        this.pre = event;
      },
      required: true,
    },
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
      required: true,
    },
    {
      name: 'description',
      label: 'Tour Desctiption',
      type: 'textarea',
      required: true,
    }

  ];
  @Input() grid;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.grid.forEach((element, index) => {
      this.class_names[index] = element.class
    });

    console.log(this.grid)
  }

  addComponent(event) {
    console.log('emit', event)
    this.onAdd.emit(event)
    this.openDialog(event)
  }



  icon(component) {
    let filterd = this.options.filter(d => d.value == component)
    if (filterd.length && filterd[0])
      return filterd[0].icon
  }

  word(component) {
    let filterd = this.options.filter(d => d.value == component)
    if (filterd.length && filterd[0])
      return filterd[0].name
  }

  delete(index) {
    console.log('delete', index)
    this.onDelete.emit(index)
  }

  rowDelete() {
    this.rowDeleted.emit(true)
  }



  openDialog(index): void {

    this.dialogRef = this.dialog.open(FormDialogComponent, {
      width: '456px',
      data: { form_data: this.form_data, configs: this.grid[index] }
    });


    this.dialogRef.afterClosed().subscribe(result => {

      if (result) {
        result.class = this.class_names[index];
        this.edited.emit({ result, index })
      }
      else if (!this.grid[index].component)
        this.delete(index)

    });
  }
}
