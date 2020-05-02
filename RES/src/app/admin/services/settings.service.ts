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
    return await this.http.post(environment.api + '/settings', data).pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

  async  saveExplorerSettings(data) {
    return await this.http.post(environment.api + '/settings/explorer', data).pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

  async  readExplorerSettings() {
    return await this.http.get(environment.api + '/settings/explorer').pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

  async  read() {
    return await this.http.get(environment.api + '/settings').pipe(map((data: any) => {
      return data;
    })).toPromise();
  }


  async retreiveMetadata(linlk) {

    return await this.http.get(environment.api + '/settings/autometa?link=' + linlk).pipe(map((data: any) => {
      return data;
    })).toPromise();

  }

  async upload(file: File, name: string) {
    let formdata = new FormData()
    formdata.append('file', file)
    return await this.http.post(environment.api + '/settings/upload/image/' + name, formdata).pipe(map((data: any) => {
      return data.location;
    })).toPromise();
  }

  async getHarvesterInfo() {
    return await this.http.get(environment.api + '/harvester/info').pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

  async startIndexing() {
    return await this.http.get(environment.api + '/harvester/startindex').pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

  async stopIndexing() {
    return await this.http.get(environment.api + '/harvester/stopindex').pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

}
