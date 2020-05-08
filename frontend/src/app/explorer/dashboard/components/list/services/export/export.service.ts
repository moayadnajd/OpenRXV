import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ExporterResponse,
  DataForExporter,
  ExportFilesModal
} from '../../paginated-list/filter-paginated-list/types.interface';
import { utils, writeFile } from 'xlsx';
import { hits } from 'src/app/explorer/filters/services/interfaces';

@Injectable()
export class ExportService {
  private readonly api_end_export_point: string = environment.exportPoint;
  constructor(private readonly http: HttpClient) { }

  export(d: DataForExporter): Observable<ExporterResponse> {
    return this.http.post(this.api_end_export_point, d) as Observable<
      ExporterResponse
    >;
  }

  createXlsxFile({ hits }: ExportFilesModal): Array<Array<string>> {
    return hits.map(({ _source }: hits) => [
      this.formatter(_source.title),
      this.formatter(_source.citation),
      this.formatter(_source.date),
      this.formatter(_source.author),
      this.formatter(_source.publisher),
      this.formatter(_source.status),
      this.formatter(_source.crp),
      this.formatter(_source.affiliation),
      this.formatter(_source.language),
      this.formatter(_source.subject),
      this.formatter(_source.region),
      this.formatter(_source.country),
      this.formatter(_source.repo),
      this.formatter(_source.handle)
    ]);
  }

  downloadFile(excelData: Array<Array<string>>, fileName: string): void {
    const sheet = utils.aoa_to_sheet([this.getHeader(), ...excelData]);
    const workBook = utils.book_new();
    utils.book_append_sheet(workBook, sheet, 'Publications');
    writeFile(workBook, fileName, { bookType: 'xlsx' });
  }
  replaceSTR(string) {
    return string.replace(new RegExp('\\&|\\||\\!|\\(|\\)|\\{|\\}|\\[|\\]|\\^|\\"|\\~|\\*|\\?|\\:|\\-|\\\\|\\/|\\=|\\+|\\%|\\,|\\@', 'gm'), ' ');//remove special characters
  }
  private formatter(toFormat: any): string {
    return this.replaceSTR((Array.isArray(toFormat) && toFormat.length) ? toFormat.join('; ') : toFormat || '' || '');
  }

  private getHeader(): Array<string> {
    return [
      'Title',
      'Citation',
      'Date',
      'Author(s)',
      'Publisher',
      'Status',
      'CRP',
      'Affiliation(s)',
      'Language',
      'Subject(s)',
      'Region',
      'Country(ies)',
      'Repository(ies)',
      'Handle'
    ];
  }
}
