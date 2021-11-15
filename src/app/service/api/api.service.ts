import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private util: UtilService
  ) { }

  public async AccessApi(parameters: any): Promise<Observable<any>> {
    const params: any = parameters;
    params.url = environment.defaultUrl;

    const headers: HttpHeaders = await this.GetHeaders();
    const requestTypes = ['post', 'get'];
    if (!requestTypes.includes(params.type)) {
      console.error('Invalid request type');
    }

    if (params.type === 'post') {
      return this.post(params, headers);
    }

    return this.get(params, headers);

  }
  private post({url, method, data}: any, headers: HttpHeaders) {
    return this.http.post(url + method, data, {headers});
  }

  private get({url, method}: any, headers: HttpHeaders) {
    return this.http.get(url + method, {headers});
  }

  private async GetHeaders(): Promise<HttpHeaders> {
      let headers = new HttpHeaders();
      const token = await this.util.GetStorage('token');
      headers = headers.append('Accept', '/');
      headers = headers.append('Access-Control-Allow-Origin', '*');
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', 'Bearer ' + token);
      // headers = headers.append('withCredentials', 'true');
      return headers;
  }
}
