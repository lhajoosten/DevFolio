import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/app/portfolio';

    // Redirect if already authenticated
    if (this.authService.isAuthenticated) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error || 'Login failed', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }
}
