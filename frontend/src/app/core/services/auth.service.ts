import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthTokens,
  CurrentUser,
  RegisterResponse,
  LoginResponse,
  refreshTokenResponse,
} from '../models/core.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'https://localhost:7175/api/v1/auth';
  private readonly TOKEN_KEY = 'devfolio_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private initialLoadCompleteSubject = new BehaviorSubject<boolean>(false);
  public initialLoadComplete$ = this.initialLoadCompleteSubject.asObservable();

  constructor() {
    // Delay token loading to avoid circular dependency
    setTimeout(() => {
      this.loadTokensFromStorage();
    }, 0);
  }

  /**
   * Login gebruiker
   */
  public login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, loginRequest)
      .pipe(
        tap((response) => {
          if (response) {
            // Backend returns LoginResponseDto directly
            const userData: User = {
              id: response.id,
              email: response.email,
              username: response.username,
              role: response.role,
              isEmailConfirmed: true,
              lastLoginAt: new Date(),
            };

            this.setAuthData(userData, response.token);
            this.initialLoadCompleteSubject.next(true);
          }
        }),
        catchError(this.handleError),
      );
  }

  /**
   * Registreer nieuwe gebruiker
   */
  public register(
    registerRequest: RegisterRequest,
  ): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.API_URL}/register`, registerRequest)
      .pipe(
        tap((response) => {
          if (response) {
            // Backend returns RegisterResponseDto directly
            const userData: User = {
              id: response.id,
              email: response.email,
              username: response.username,
              isEmailConfirmed: false,
              role: 'User', // Default role for new users
              lastLoginAt: new Date(),
            };

            this.setAuthData(userData, response.token);
            this.initialLoadCompleteSubject.next(true); // Mark initial load as complete after login
          }
        }),
        catchError(this.handleError),
      );
  }
  /**
   * Logout gebruiker
   */
  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.initialLoadCompleteSubject.next(true); // Mark as complete for immediate navigation
    // Only navigate if not already on auth pages
    if (!this.router.url.includes('/auth/')) {
      this.router.navigate(['/auth/login']);
    }
  }

  /**
   * Get current user info
   */
  public getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.API_URL}/me`).pipe(
      tap((response) => {
        if (response) {
          this.currentUserSubject.next(response);
        }
      }),
      catchError((error) => {
        return this.handleError(error);
      }),
    );
  }

  /**
   * Refresh authentication token
   */
  public refreshToken(): Observable<refreshTokenResponse> {
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<refreshTokenResponse>(`${this.API_URL}/refresh`, {
        refreshToken: tokens.refreshToken,
      })
      .pipe(
        tap((response) => {
          if (response && response.accessToken) {
            const currentUser = this.currentUserSubject.value;
            if (currentUser) {
              this.setAuthData(currentUser, response.accessToken);
            }
          }
        }),
        catchError(this.handleError),
      );
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return !!(tokens?.accessToken && new Date(tokens.expiresAt) > new Date());
  }

  /**
   * Check if user is admin
   */
  public isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'Admin';
  }

  /**
   * Get access token
   */
  public getAccessToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.accessToken || null;
  }

  private setAuthData(user: User, token: string): void {
    localStorage.setItem(
      this.TOKEN_KEY,
      JSON.stringify({ accessToken: token }),
    );
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private loadTokensFromStorage(): void {
    const tokens = this.getStoredTokens();
    if (tokens && new Date(tokens.expiresAt) > new Date()) {
      // Don't set isAuthenticated to true yet - wait for user data validation
      this.getCurrentUser().subscribe({
        next: () => {
          this.isAuthenticatedSubject.next(true);
          this.initialLoadCompleteSubject.next(true);
        },
        error: () => {
          this.logout();
        },
      });
    } else {
      this.isAuthenticatedSubject.next(false);
      this.initialLoadCompleteSubject.next(true);
    }
  }

  private getStoredTokens(): AuthTokens | null {
    const tokenString = localStorage.getItem(this.TOKEN_KEY);
    if (tokenString) {
      try {
        return JSON.parse(tokenString);
      } catch {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
    return null;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Auth service error:', error);
    return throwError(() => error);
  }
}
