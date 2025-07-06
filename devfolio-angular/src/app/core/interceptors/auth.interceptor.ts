import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    
    console.log('AuthInterceptor - Request URL:', req.url);
    console.log('AuthInterceptor - Access Token:', accessToken ? 'Present' : 'Missing');
    
    if (accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      console.log('AuthInterceptor - Added Authorization header');
      return next.handle(authReq);
    }
    
    console.log('AuthInterceptor - No token, sending request without Authorization');
    return next.handle(req);
  }
}
