import { Component, OnInit, Input } from '@angular/core';
import {
  FileType,
  ExporterResponse,
  ExportFilesModal
} from '../paginated-list/filter-paginated-list/types.interface';
import { ExportService } from '../services/export/export.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ElasticsearchQuery } from 'src/app/filters/services/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
  providers: [ExportService]
})
export class ExportComponent implements OnInit {
  @Input() type: FileType;
  @Input() query: Observable<ElasticsearchQuery>;
  installing: boolean;
  delegationArr: Array<ExportFilesModal>;
  indexToToggleLoaded: number;
  downloadPath: string;
  exportPoint: string;

  get finishedExporting(): boolean {
    if (!this.delegationArr) {
      return false;
    }
    return (
      this.delegationArr.filter(({ loaded }: ExportFilesModal) => loaded)
        .length === this.delegationArr.length
    );
  }

  constructor(private readonly exportService: ExportService) {
    this.installing = false;
    this.indexToToggleLoaded = 0;
    this.exportPoint = environment.exportPoint;
  }

  ngOnInit(): void {}

  markasDownloaded(name: string): void {
    this.delegationArr = this.delegationArr.map((v: ExportFilesModal) => {
      if (name === v.name) {
        v.downloaded = true;
      }
      return v;
    });
  }

  exportFile(id?: string): void {
    this.installing = true;
    const exporter: Observable<ExporterResponse> = this.query.pipe(
      switchMap((q: ElasticsearchQuery) =>
        this.exportService.export({
          type: this.type,
          scrollId: id,
          body: q
        })
      )
    );

    exporter.subscribe(
      ({
        scrollId,
        end,
        per_doc_size,
        total,
        path,
        fileName
      }: ExporterResponse) => {
        if (!this.downloadPath) {
          this.downloadPath = path;
        }
        if (!this.delegationArr) {
          this.delegationArr = Array.from(
            { length: Math.ceil(total / per_doc_size) },
            (v: unknown, i: number): ExportFilesModal => ({
              name: `Part ${i + 1}`,
              downloaded: false,
              loaded: i === this.indexToToggleLoaded,
              fileName
            })
          );
        }
        // ONLY FALSE if undefined STOP
        if (end === false) {
          this.delegationArr = this.delegationArr.map(
            (efm: ExportFilesModal, i: number) => {
              if (i === this.indexToToggleLoaded) {
                efm.loaded = true;
              }
              return efm;
            }
          );
          this.indexToToggleLoaded++;
          this.exportFile(scrollId);
        } else {
          // this.installing = false;
        }
      }
    );
  }
}
