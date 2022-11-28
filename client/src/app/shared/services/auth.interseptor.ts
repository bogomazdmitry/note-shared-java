import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('sadasd');
    request = request.clone({
      setHeaders: {
        /* eslint-disable */
        Authorization: `Bearer ${this.authService.getAccessToken()}`,
        /* eslint-enable */
      },
    });
    return next.handle(request);
  }
}
