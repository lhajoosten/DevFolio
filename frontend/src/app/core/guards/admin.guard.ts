import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.authState$.pipe(
      map(authState => authState.isAuthenticated && authState.user?.role === 'Admin'),
      tap(isAdmin => {
        if (!isAdmin) {
          if (this.authService.isAuthenticated) {
            // User is authenticated but not admin
            this.router.navigate(['/app/portfolio']);
          } else {
            // User is not authenticated
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: state.url }
            });
          }
        }
      })
    );
  }
}
