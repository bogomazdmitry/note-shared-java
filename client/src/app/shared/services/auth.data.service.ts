import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  actionRoutes,
  controllerRoutes,
  authTokenRequestNames,
  authTokenRequestValues,
} from '../constants/url.constants';
import { SignInModel } from '../models/sigin.model';
import { SignUpModel } from '../models/signup.model';
import { BaseDataService } from './base.data.service';

@Injectable({ providedIn: 'root' })
export class AuthDataService extends BaseDataService {
  constructor(
    httpClient: HttpClient
  ) {
    super(httpClient, controllerRoutes.auth);
  }

  public signUp(signUpModel: SignUpModel): Observable<any> {
    const subSignUp = this.sendPostRequest(
      JSON.stringify(signUpModel),
      actionRoutes.authSignup
    ).pipe(share());
    subSignUp.subscribe((answer) => {
      const signInModel: SignInModel = {
        email: answer.email,
        password: answer.password,
      };
      this.sigIn(signInModel);
    });
    return subSignUp;
  }

  public sigIn(signInModel: SignInModel): Observable<any> {
    const sub = this.sendPostRequest(
      JSON.stringify(signInModel),
      actionRoutes.authToken,
    ).pipe(share());
    return sub;
  }

  public checkUniqueUserName(userName: string): Observable<any> {
    return this.sendGetRequest(
      { userName },
      actionRoutes.authCheckUniqueUserName
    );
  }

  public checkUniqueEmail(email: string): Observable<any> {
    return this.sendGetRequest({ email }, actionRoutes.authCheckUniqueEmail);
  }
}
