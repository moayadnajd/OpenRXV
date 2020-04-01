import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }
  async  save(data) {
    return await this.http.post(environment.api + 'settings', data).pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

  async  read() {
    return await this.http.get(environment.api + 'settings').pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

}
