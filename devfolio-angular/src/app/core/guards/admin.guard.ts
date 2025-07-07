import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    console.log('AdminGuard: canActivate called');
    return this.authService.initialLoadComplete$.pipe(
      filter(loadComplete => {
        console.log('AdminGuard: initialLoadComplete =', loadComplete);
        return loadComplete === true;
      }),
      take(1),
      switchMap(() => {
        console.log('AdminGuard: Initial load complete, checking user role...');
        return this.authService.currentUser$;
      }),
      take(1),
      map(user => {
        console.log('AdminGuard: Current user =', user);
        if (user && user.role === 'Admin') {
          console.log('AdminGuard: Admin access granted');
          return true;
        } else {
          console.log('AdminGuard: Access denied, redirecting to home');
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}
