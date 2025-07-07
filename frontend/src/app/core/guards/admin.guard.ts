import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Controleert of de gebruiker een admin is.
   * Als de gebruiker een admin is, wordt de route geactiveerd.
   * Anders wordt de gebruiker doorgestuurd naar de homepagina.
   */
  canActivate(): Observable<boolean> {
    return this.authService.initialLoadComplete$.pipe(
      filter((loadComplete) => {
        return loadComplete === true;
      }),
      take(1),
      switchMap(() => {
        return this.authService.currentUser$;
      }),
      take(1),
      map((user) => {
        if (user && user.role === 'Admin') {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }),
    );
  }
}
