import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Try to refresh token
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // Retry original request with new token
              const accessToken = this.authService.getAccessToken();
              const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
              });
              return next.handle(authReq);
            }),
            catchError(() => {
              // Refresh failed, logout user
              this.authService.logout();
              return throwError(() => error);
            })
          );
        }

        if (error.status === 403) {
          // Access denied - redirect or show message
          console.error('Access denied');
        }

        return throwError(() => error);
      })
    );
  }
}
