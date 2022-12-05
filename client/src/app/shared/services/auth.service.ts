import { AuthDataService } from 'src/app/shared/services/auth.data.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { fieldLocalStorage } from '../constants/local-storage.constants';
import { SignInModel } from '../models/sigin.model';
import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SignUpModel } from '../models/signup.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtHelperService: JwtHelperService;

  public constructor(
    private readonly router: Router,
    private readonly authDataService: AuthDataService,
    private readonly userService: UserService
  ) {
    this.jwtHelperService = new JwtHelperService();
  }

  public isAuthorize(): boolean {
    const token = localStorage.getItem(fieldLocalStorage.accessToken);
    return token != null && !this.jwtHelperService.isTokenExpired(token);
  }

  public saveAccessToken(token: any): void {
    localStorage.setItem(fieldLocalStorage.accessToken, token);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(fieldLocalStorage.accessToken);
  }

  public signOut(): void {
    localStorage.removeItem(fieldLocalStorage.accessToken);
    localStorage.removeItem(fieldLocalStorage.user);
    this.router.navigate(['/']);
    location.reload();
  }

  public signIn(
    signinModel: SignInModel,
    backUrl: string | undefined,
    errorHandler: (httpErrorResponse: HttpErrorResponse) => void | undefined
  ): any {
    this.authDataService.sigIn(signinModel).subscribe(
      (token) => {
        this.saveAccessToken(token.token);
        this.userService.getUserFromServer().subscribe((userInfo) => {
          this.userService.saveUser(userInfo);
          this.router.navigate([backUrl ? backUrl : '/']).then((navigated) => {
            if (!navigated) {
              this.router.navigate(['/']).then(location.reload);
            }
          });
        });
      },
      (error) => {
        if (errorHandler) {
          errorHandler(error);
        }
      }
    );
  }

  public signUp(
    signUpModel: SignUpModel,
    errorHandler: (httpErrorResponse: HttpErrorResponse) => void | undefined
  ): any {
    this.authDataService.signUp(signUpModel).subscribe(
      (answer) => {
        this.router.navigate(['/']);
      },
      (httpErrorResponse) => {
        if (errorHandler) {
          errorHandler(httpErrorResponse);
        }
      }
    );
  }
}
