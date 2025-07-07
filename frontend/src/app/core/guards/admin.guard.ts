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
  ) { }

  canActivate(): Observable<boolean> {
    return this.authService.initialLoadComplete$.pipe(
      filter(loadComplete => {
        return loadComplete === true;
      }),
      take(1),
      switchMap(() => {
        return this.authService.currentUser$;
      }),
      take(1),
      map(user => {
        if (user && user.role === 'Admin') {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}
