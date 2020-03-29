import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as  querystring from 'querystring'
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  constructor(private http: HttpClient) { }


  async find(obj = null) {
    let query = '';
    if (obj != null) {

      query = '?' + querystring.stringify(obj)
    }


    return await this.http.get(environment.api + 'metadata' + query).pipe(map((data: any) => {

      data.hits = data.hits.map(element => { return { ...{ id: element._id }, ...element._source } })
      return data;
    })).toPromise();
  }

  async  post(data) {
    return await this.http.post(environment.api + 'metadata', data).pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

  async  put(id, data) {
    return await this.http.put(environment.api + `metadata/${id}`, data).pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

  async  delete(id) {
    return await this.http.delete(environment.api + `metadata/${id}`).pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

  async  findOne(id) {
    return await this.http.get(environment.api + `metadata/${id}`).pipe(map((data: any) => {
      return data;
    })).toPromise();
  }

}
