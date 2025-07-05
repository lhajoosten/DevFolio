import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil, fromEvent } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../core/services/auth.service';
import { User, AuthState } from '../core/models/user.model';
import { SharedModule } from '../shared/shared.module';
import { BaseComponent } from '../core/base/base.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent extends BaseComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  currentUser: User | null = null;
  isMobile = false;
  private readonly MOBILE_BREAKPOINT = 768;

  constructor(private authService: AuthService, private router: Router) {
    super();
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.subscribeToAuthState();
    this.subscribeToWindowResize();
  }

  private subscribeToAuthState(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        this.currentUser = authState.user;
      });
  }

  private subscribeToWindowResize(): void {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  closeSidenavIfMobile(): void {
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.closeSidenavIfMobile();
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
    this.closeSidenavIfMobile();
  }

  logout(): void {
    this.authService.logout();
  }

  // Utility methods for template
  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  get userDisplayName(): string {
    return this.currentUser?.profile?.fullName || this.currentUser?.username || 'User';
  }

  get userAvatarUrl(): string | null {
    return this.currentUser?.profile?.profilePictureUrl || null;
  }
}
