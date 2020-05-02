import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss']
})
export class InfoTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'page', 'processedOn', 'repo', 'attemptsMade'];

  @Input() data = []
  constructor() { }

  ngOnInit(): void {
  }

}
