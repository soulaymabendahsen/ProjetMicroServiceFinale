// src/app/services/keycloak.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from './keycloak.service';
import { environment } from '../../environments/environment';

@Injectable()
export class KeycloakHttpInterceptor implements HttpInterceptor {
  constructor(private keycloakService: KeycloakService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.keycloakService.getToken();
    console.log('KeycloakHttpInterceptor: Intercepting request', req.url);
    console.log(
      'KeycloakHttpInterceptor: Token',
      token ? 'Present' : 'undefined'
    );

    // Clone request with appropriate headers
    let clonedReq = req;

    // If token exists, add it to the request (but don't require it)
    if (token && this.keycloakService.isAuthenticated()) {
      clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log('✅ Adding Bearer token to request');
    } else {
      console.log('🔓 No token available, proceeding without authentication');
      // No token, but proceed anyway
      clonedReq = req.clone({
        withCredentials: true,
      });
    }

    return next.handle(clonedReq);
  }
}
