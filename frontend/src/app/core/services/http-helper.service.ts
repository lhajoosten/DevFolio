import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpHelperService {
  private authService = inject(AuthService);

  // Legacy constructors removed; using inject() only

  /**
   * Get HTTP headers with authentication token
   */
  getAuthHeaders(): HttpHeaders {
    // Get token from auth service (aanpassen aan jouw auth service implementatie)
    const tokens = this.getStoredTokens();

    if (tokens?.accessToken) {
      return new HttpHeaders({
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      });
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  /**
   * Get basic headers without authentication
   */
  getBasicHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private getStoredTokens(): {
    accessToken: string;
    refreshToken?: string;
  } | null {
    const tokenString = localStorage.getItem('devfolio_token');
    if (tokenString) {
      try {
        return JSON.parse(tokenString);
      } catch {
        return null;
      }
    }
    return null;
  }
}
