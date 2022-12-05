import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalErrorService } from './global-error.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorInterceptor implements HttpInterceptor {
  constructor(private readonly globalErrorService: GlobalErrorService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse): Observable<HttpEvent<any>> => {
        if (error.status >= 500 || !error.status) {
          this.globalErrorService.setError(error.message);
        }
        return throwError(error);
      })
    );
  }
}
