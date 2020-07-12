

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ValuesService } from '../../services/values.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SharedService } from '../../services/shared.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnInit {
  currentUrl: string;
  currenRoute: any;

  constructor(private sharedService: SharedService,
    public dialog: MatDialog,
    private readonly currentRouter: Router
  ) { }

  displayedColumns: string[] = ['id', 'created_at', 'hashedItem', 'attr', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  async ngOnInit() {

    let mappingshared = await this.sharedService.getSharedLinks();
    this.dataSource = new MatTableDataSource<any>(mappingshared.hits);
    this.dataSource.paginator = this.paginator;
    this.currenRoute = Object.getOwnPropertyDescriptors(this.currentRouter)
  }
  view(id) {
    window.open(`${this.currenRoute.location.value._platformLocation.location.origin}/explorer/shared/${id}`)
  }
}



