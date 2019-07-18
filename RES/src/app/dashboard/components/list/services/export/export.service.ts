import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ExportService {
  private readonly api_end_export_point: string = environment.exportPoint;
  constructor(private readonly http: HttpClient) {}

  // TODO resolve any
  export(
    fileType: 'pdf' | 'docx' | 'xlsx',
    scrollId?: string
  ): Observable<any> {
    return this.http.get(
      `${this.api_end_export_point}/${fileType}/${scrollId ? scrollId : ''}`
    );
  }
}
