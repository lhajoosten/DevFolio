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
  private readonly API_URL = 'https://localhost:7058/api/v1/auth'; // Backend API URL
  private readonly TOKEN_KEY = 'lh_portfolio_tokens';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadTokensFromStorage();
  }

  /**
   * Login gebruiker
   */
  login(loginRequest: LoginRequest): Observable<ApiResponse<{ user: User, tokens: AuthTokens }>> {
    return this.http.post<ApiResponse<{ user: User, tokens: AuthTokens }>>(`${this.API_URL}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data.user, response.data.tokens);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Registreer nieuwe gebruiker
   */
  register(registerRequest: RegisterRequest): Observable<ApiResponse<{ user: User, tokens: AuthTokens }>> {
    return this.http.post<ApiResponse<{ user: User, tokens: AuthTokens }>>(`${this.API_URL}/register`, registerRequest)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data.user, response.data.tokens);
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
    this.router.navigate(['/login']);
  }

  /**
   * Get current user info
   */
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/me`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<ApiResponse<AuthTokens>> {
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<AuthTokens>>(`${this.API_URL}/refresh`, {
      refreshToken: tokens.refreshToken
    }).pipe(
      tap(response => {
        if (response.success && response.data) {
          const currentUser = this.currentUserSubject.value;
          if (currentUser) {
            this.setAuthData(currentUser, response.data);
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
      this.getCurrentUser().subscribe();
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
