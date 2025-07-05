import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthState
} from '../models/user.model';
import { ApiError } from '../models/api.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl || 'https://localhost:7175/api/v1';
  private readonly TOKEN_KEY = 'portfolio_token';
  private readonly USER_KEY = 'portfolio_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    user: this.getUserFromStorage(),
    token: this.getTokenFromStorage(),
    isAuthenticated: this.hasValidToken(),
    isLoading: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getTokenFromStorage();
    const user = this.getUserFromStorage();

    if (token && user && !this.isTokenExpired(token)) {
      this.updateAuthState({ user, token, isAuthenticated: true, isLoading: false });
      this.scheduleTokenRefresh(token);
    } else {
      this.logout();
    }
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    this.setLoading(true);

    return this.http.post<RegisterResponse>(`${this.API_URL}/auth/register`, request)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response.token, {
            id: response.id,
            email: response.email,
            username: response.username,
            role: 'User', // Default role for new registrations
            isEmailConfirmed: response.isEmailConfirmed,
            profile: {
              firstName: '',
              lastName: '',
              fullName: response.fullName
            }
          });
        }),
        catchError(this.handleError.bind(this)),
        tap(() => this.setLoading(false))
      );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);

    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, request)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response.token, {
            id: response.id,
            email: response.email,
            username: response.username,
            role: response.role,
            isEmailConfirmed: true,
            profile: {
              firstName: '',
              lastName: '',
              fullName: response.fullName
            }
          });
        }),
        catchError(this.handleError.bind(this)),
        tap(() => this.setLoading(false))
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/me`)
      .pipe(
        tap(user => {
          const currentState = this.authStateSubject.value;
          this.updateAuthState({
            ...currentState,
            user
          });
          this.saveUserToStorage(user);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void {
    this.clearStorage();
    this.updateAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<any> {
    // For now, we'll just redirect to login if token is expired
    // In a production app, you might implement refresh token logic
    this.logout();
    return throwError(() => new Error('Token expired'));
  }

  private handleAuthSuccess(token: string, user: User): void {
    this.saveTokenToStorage(token);
    this.saveUserToStorage(user);
    this.updateAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    });
    this.scheduleTokenRefresh(token);
  }

  private handleError(error: any): Observable<never> {
    this.setLoading(false);

    let errorMessage = 'An unknown error occurred';

    if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    const apiError: ApiError = {
      error: errorMessage,
      statusCode: error.status
    };

    return throwError(() => apiError);
  }

  private updateAuthState(newState: Partial<AuthState>): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({ ...currentState, ...newState });
  }

  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.updateAuthState({ ...currentState, isLoading: loading });
  }

  private saveTokenToStorage(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private hasValidToken(): boolean {
    const token = this.getTokenFromStorage();
    return token ? !this.isTokenExpired(token) : false;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  }

  private scheduleTokenRefresh(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const refreshTime = expirationTime - Date.now() - (5 * 60 * 1000); // 5 minutes before expiry

      if (refreshTime > 0) {
        setTimeout(() => {
          this.refreshToken().subscribe();
        }, refreshTime);
      }
    } catch {
      // If we can't parse the token, logout immediately
      this.logout();
    }
  }

  // Getters for template usage
  get currentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  get isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  get isLoading(): boolean {
    return this.authStateSubject.value.isLoading;
  }

  get token(): string | null {
    return this.authStateSubject.value.token;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  get isUser(): boolean {
    return this.currentUser?.role === 'User';
  }
}
