import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ValuesService } from '../../services/values.service';
import { ValuesForm } from './form/values-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-mapping-values',
  templateUrl: './mapping-values.component.html',
  styleUrls: ['./mapping-values.component.scss']
})
export class MappingValuesComponent implements OnInit {

  constructor(private valuesService: ValuesService, public dialog: MatDialog) { }



  openDialog(): void {

    const dialogRef = this.dialog.open(ValuesForm, {
      disableClose: true ,
      width: '30%',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.ngOnInit();
    });
  }

  async toDelete(id) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: { title: "Confirmation", subtitle: "Are you sure you want to delete this user ?" }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.valuesService.delete(id);
        this.ngOnInit();
      }
    })
  }
  async toEdit(id) {
    let user = await this.valuesService.findOne(id);

    const dialogRef = this.dialog.open(ValuesForm, {
      width: '30%',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.ngOnInit();
    });
  }

  displayedColumns: string[] = ['id', 'find', 'replace', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  async ngOnInit() {

    let mappingvalues = await this.valuesService.find();
    this.dataSource = new MatTableDataSource<any>(mappingvalues.hits);
    this.dataSource.paginator = this.paginator;
  }
}



