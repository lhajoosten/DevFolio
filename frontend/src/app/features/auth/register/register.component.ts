import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/app/portfolio']);
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const registerRequest: RegisterRequest = this.registerForm.value;

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.snackBar.open('Registration successful! Welcome!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/app/portfolio']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error || 'Registration failed', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }
}
