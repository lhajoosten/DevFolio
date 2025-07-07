import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// Modern functional interceptor
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Try to refresh token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry original request with new token
            const accessToken = authService.getAccessToken();
            const authReq = req.clone({
              headers: req.headers.set(
                'Authorization',
                `Bearer ${accessToken}`
              ),
            });
            return next(authReq);
          }),
          catchError(() => {
            // Refresh failed, logout user
            authService.logout();
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
};
