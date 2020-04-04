import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShareComponent>,
    private clipboard: Clipboard,
    @Inject(MAT_DIALOG_DATA) public data: { link: string }) { }

  ngOnInit(): void {
  }

  copy(link) {
    this.clipboard.copy(link);
  }

}
