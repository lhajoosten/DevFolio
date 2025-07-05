import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token;

    let authReq = req;
    if (token && !this.isAuthEndpoint(req.url)) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthEndpoint(req.url)) {
          // Token expired or invalid
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // Retry the request with new token
              const newToken = this.authService.token;
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next.handle(retryReq);
            }),
            catchError(() => {
              this.authService.logout();
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/register');
  }
}
