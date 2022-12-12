import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class BaseDataService {
  constructor(
    protected readonly httpClient: HttpClient,
    private readonly controllerRoute: string
  ) {}

  public sendPostRequest<TModel>(
    model: TModel,
    actionRoute: string,
    headers: HttpHeaders = new HttpHeaders(),
    prefix: boolean = true
  ): Observable<any> {
    if (!headers.get('Content-type')) {
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('responseType', 'text');
    }
    return this.httpClient.post(
      environment.serverUrl + (prefix ? this.controllerRoute : '') + actionRoute,
      model,
      { headers }
    );
  }

  public sendDeleteRequest<TModel>(
    model: TModel,
    actionRoute: string,
    headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json'),
    prefix: boolean = true
  ): Observable<any> {
    if (!headers.get('Content-type')) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return this.httpClient.delete(
      `${environment.serverUrl}${
        prefix ? this.controllerRoute : ''
      }${actionRoute}${this.generateGetRequest(model)}`,
      { headers }
    );
  }

  private generateGetRequest<TModel>(model: TModel): string {
    const jsModel = Object.assign({}, model);
    let result = '?';
    for (const [key, value] of Object.entries(jsModel)) {
      result += `${key}=${value}&`;
    }
    return result;
  }

  public sendGetRequest<TModel>(
    model: TModel,
    actionRoute: string,
    headers: HttpHeaders = new HttpHeaders(),
    prefix: boolean = true
  ): Observable<any> {
    if (!headers.get('Content-type')) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return this.httpClient.get(
      `${environment.serverUrl}${
        prefix ? this.controllerRoute : ''
      }${actionRoute}${this.generateGetRequest(model)}`,
      { headers }
    );
  }
}
