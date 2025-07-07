import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    console.log('AuthGuard: canActivate called');
    return this.authService.initialLoadComplete$.pipe(
      filter(loadComplete => {
        console.log('AuthGuard: initialLoadComplete =', loadComplete);
        return loadComplete === true;
      }),
      take(1),
      switchMap(() => {
        console.log('AuthGuard: Initial load complete, checking authentication...');
        return this.authService.isAuthenticated$;
      }),
      take(1),
      map(isAuthenticated => {
        console.log('AuthGuard: isAuthenticated =', isAuthenticated);
        if (isAuthenticated) {
          console.log('AuthGuard: Access granted');
          return true;
        } else {
          console.log('AuthGuard: Access denied, redirecting to login');
          this.router.navigate(['/auth/login']);
          return false;
        }
      })
    );
  }
}
