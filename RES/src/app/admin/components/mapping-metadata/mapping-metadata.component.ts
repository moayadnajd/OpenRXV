import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MetadataService } from '../../services/metadata.service';
import { MetadataForm } from './form/metadata-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-mapping-metadata',
  templateUrl: './mapping-metadata.component.html',
  styleUrls: ['./mapping-metadata.component.scss']
})
export class MappingMetadataComponent implements OnInit {

  constructor(private metadataService: MetadataService, public dialog: MatDialog) { }



  openDialog(): void {

    const dialogRef = this.dialog.open(MetadataForm, {
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
        await this.metadataService.delete(id);
        this.ngOnInit();
      }
    })
  }
  async toEdit(id) {
    let user = await this.metadataService.find(id);

    const dialogRef = this.dialog.open(MetadataForm, {
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

    let mappingmetadata = await this.metadataService.find();
    this.dataSource = new MatTableDataSource<any>(mappingmetadata.hits);
    this.dataSource.paginator = this.paginator;
  }
}



