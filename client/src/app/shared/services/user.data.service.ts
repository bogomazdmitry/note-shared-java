import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actionRoutes, controllerRoutes } from '../constants/url.constants';
import { ChangeUserInfo } from '../models/change-user-info.model';
import { User } from '../models/user.model';
import { BaseDataService } from './base.data.service';

@Injectable({ providedIn: 'root' })
export class UserDataService extends BaseDataService {
  public constructor(protected readonly httpClient: HttpClient) {
    super(httpClient, controllerRoutes.user);
  }

  public getUserInfo(): Observable<User> {
    return this.sendGetRequest('', actionRoutes.userInfo);
  }

  public changeUserInfo(changeUserInfo: ChangeUserInfo): Observable<User> {
    return this.sendPostRequest(
      JSON.stringify(changeUserInfo), actionRoutes.userChangeInfo);
  }
}
