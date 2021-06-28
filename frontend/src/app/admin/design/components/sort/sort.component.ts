import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
})
export class SortComponent implements OnInit {
  sortedItems = [];
  constructor(
    public dialogRef: MatDialogRef<SortComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.sortedItems = [].concat(this.data);
  }

  submit() {
    this.dialogRef.close(this.sortedItems);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sortedItems, event.previousIndex, event.currentIndex);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
