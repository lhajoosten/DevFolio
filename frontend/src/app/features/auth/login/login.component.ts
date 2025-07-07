import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected themeService = inject(ThemeService);

  protected loginForm: FormGroup;
  protected isLoading = false;
  protected errorMessage = '';

  // Legacy constructors removed; using inject() only
  constructor() {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          // Backend returns LoginResponseDto directly on success
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.error ||
            error.error?.message ||
            'Er is een fout opgetreden bij het inloggen';
        },
      });
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
