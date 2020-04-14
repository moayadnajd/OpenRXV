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
  @Output() onDelete: EventEmitter<boolean> = new EventEmitter()
  @Input() configs;

  dialogRef: MatDialogRef<any>
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
    }
  ];
  @Input() grid;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addComponent(event) {
    console.log(event);
  }

  icon(component) {
    let icons = {
      PieComponent: 'pie_chart'
    }
    return icons[component];
  }

  delete() {

  }



  openDialog(index): void {

    this.dialogRef = this.dialog.open(FormDialogComponent, {
      width: '456px',
      data: { form_data: this.form_data, configs: this.grid[index] }
    });


    this.dialogRef.afterClosed().subscribe(result => {
      // if (result)
      //   this.edited.emit(result)

    });
  }
}
