import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiResponse, User, LoginRequest, RegisterRequest, AuthTokens } from '../models/core.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7175/api/v1/auth'; // Backend API URL
  private readonly TOKEN_KEY = 'devfolio_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Delay token loading to avoid circular dependency
    setTimeout(() => {
      this.loadTokensFromStorage();
    }, 0);
  }

  /**
   * Login gebruiker
   */
  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response) {
            // Backend returns LoginResponseDto directly
            const userData: User = {
              id: response.id,
              email: response.email,
              username: response.username,
              role: response.role,
              isEmailConfirmed: true, // Assuming logged in users are confirmed
              lastLoginAt: new Date()
            };

            const tokenData: AuthTokens = {
              accessToken: response.token,
              refreshToken: '', // Backend might not provide refresh token yet
              expiresAt: new Date(response.expiresAt)
            };

            this.setAuthData(userData, tokenData);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Registreer nieuwe gebruiker
   */
  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, registerRequest)
      .pipe(
        tap(response => {
          if (response) {
            // Backend returns RegisterResponseDto directly
            const userData: User = {
              id: response.id,
              email: response.email,
              username: response.username,
              role: response.role,
              isEmailConfirmed: false, // New users might need email confirmation
              lastLoginAt: new Date()
            };

            const tokenData: AuthTokens = {
              accessToken: response.token,
              refreshToken: '', // Backend might not provide refresh token yet
              expiresAt: new Date(response.expiresAt)
            };

            this.setAuthData(userData, tokenData);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Logout gebruiker
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    // Only navigate if not already on auth pages
    if (!this.router.url.includes('/auth/')) {
      this.router.navigate(['/auth/login']);
    }
  }

  /**
   * Get current user info
   */
  getCurrentUser(): Observable<any> {
    console.log('getCurrentUser called, token:', this.getAccessToken());
    return this.http.get<any>(`${this.API_URL}/me`)
      .pipe(
        tap(response => {
          console.log('getCurrentUser response:', response);
          if (response) {
            // Backend returns GetCurrentUserDto directly (not wrapped in ApiResponse)
            this.currentUserSubject.next(response);
          }
        }),
        catchError(error => {
          console.error('getCurrentUser error:', error);
          return this.handleError(error);
        })
      );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<any> {
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(`${this.API_URL}/refresh`, {
      refreshToken: tokens.refreshToken
    }).pipe(
      tap(response => {
        if (response && response.token) {
          const currentUser = this.currentUserSubject.value;
          if (currentUser) {
            const tokenData = {
              accessToken: response.token,
              refreshToken: response.refreshToken || tokens.refreshToken,
              expiresAt: new Date(response.expiresAt)
            };
            this.setAuthData(currentUser, tokenData);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return !!(tokens?.accessToken && new Date(tokens.expiresAt) > new Date());
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'Admin';
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.accessToken || null;
  }

  private setAuthData(user: User, tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private loadTokensFromStorage(): void {
    const tokens = this.getStoredTokens();
    if (tokens && new Date(tokens.expiresAt) > new Date()) {
      this.isAuthenticatedSubject.next(true);
      // Load user data
      this.getCurrentUser().subscribe({
        next: (user) => {
          console.log('User loaded from token:', user);
        },
        error: (error) => {
          console.error('Failed to load user, clearing tokens:', error);
          this.logout();
        }
      });
    } else {
      console.log('No valid tokens found in storage');
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

  private handleError(error: any): Observable<never> {
    console.error('Auth service error:', error);
    return throwError(() => error);
  }
}
