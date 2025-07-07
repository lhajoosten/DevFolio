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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  themeService = inject(ThemeService);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  // Legacy constructors removed; using inject() only
  constructor() {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMatch: true });
    } else if (confirmPassword?.errors?.['passwordMatch']) {
      delete confirmPassword.errors['passwordMatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          // Backend returns RegisterResponseDto directly on success
          this.router.navigate(['/admin']);
        },
        error: (error: unknown) => {
          this.isLoading = false;
          const errorObj = error as {
            error?: { error?: string; message?: string };
          };
          this.errorMessage =
            errorObj.error?.error ||
            errorObj.error?.message ||
            'Er is een fout opgetreden bij de registratie';
        },
      });
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
