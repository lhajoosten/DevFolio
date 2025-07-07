import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CurrentUser } from '../../../core';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  protected themeService = inject(ThemeService);
  private router = inject(Router);

  protected showUserMenu = false;
  protected showMobileMenu = false;
  protected currentUser: CurrentUser | null = null;

  public ngOnInit(): void {
    // Get current user info
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      },
    });
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showMobileMenu = false;
  }

  protected closeUserMenu(): void {
    this.showUserMenu = false;
  }

  protected toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    this.showUserMenu = false;
  }

  protected closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
