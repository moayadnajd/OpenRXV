import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  constructor(private http: HttpClient) {}

  async get() {
    return await this.http
      .get(environment.api + `/settings/metadata`)
      .pipe(
        map((data: any) => {
          return data;
        }),
      )
      .toPromise();
  }
}
