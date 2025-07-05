import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { KeycloakService } from './keycloak.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DualAuthService {
  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient
  ) {}

  /**
   * Simple dual auth: after Keycloak success, sync with your personal auth
   */
  syncWithPersonalAuth(): Observable<any> {
    if (!this.keycloakService.isAuthenticated()) {
      console.warn(
        '⚠️ Keycloak not authenticated, skipping personal auth sync'
      );
      return of(null);
    }

    console.log('🔄 Starting personal auth sync after Keycloak success...');

    // Get user info from Keycloak
    const tokenParsed = this.keycloakService.getTokenParsed();
    const email = tokenParsed?.email || tokenParsed?.preferred_username;
    const username = tokenParsed?.preferred_username || email;

    if (!email) {
      console.warn('⚠️ No email found in Keycloak token, skipping sync');
      return of(null);
    }

    console.log(`👤 Syncing user: ${email}`);

    // Try to login with existing user service API
    return this.loginToPersonalAuth(email, username).pipe(
      switchMap((loginResult) => {
        if (loginResult.success) {
          console.log('✅ Personal auth login successful');
          this.storePersonalToken(loginResult.token);
          return of(loginResult);
        } else {
          console.log('📝 Personal auth login failed, trying to register...');
          return this.registerToPersonalAuth(email, username);
        }
      }),
      catchError((error) => {
        console.log('🔄 Login failed, attempting registration...', error);
        return this.registerToPersonalAuth(email, username);
      })
    );
  }

  /**
   * Try to login using your existing user service login API
   */
  private loginToPersonalAuth(
    email: string,
    username: string
  ): Observable<any> {
    const loginData = {
      email: email,
      password: `sync_${email}`, // Use a predictable sync password
      username: username,
    };

    return this.http
      .post<any>(`${environment.gatewayUrl}/api/auth/signin`, loginData)
      .pipe(
        map((response) => ({
          success: true,
          token: response.token || response.accessToken,
          user: response.user,
          message: 'Personal auth login successful',
        })),
        catchError((error) => {
          console.log('Personal auth login error:', error);
          return of({
            success: false,
            message: error.message || 'Login failed',
          });
        })
      );
  }

  /**
   * Register using your existing user service register API
   */
  private registerToPersonalAuth(
    email: string,
    username: string
  ): Observable<any> {
    const keycloakRoles = this.keycloakService.getUserRoles();

    const registerData = {
      email: email,
      username: username,
      password: `sync_${email}`, // Use predictable sync password
      firstName: this.keycloakService.getTokenParsed()?.given_name || '',
      lastName: this.keycloakService.getTokenParsed()?.family_name || '',
      // Map Keycloak roles to your system
      roles: this.mapKeycloakRoles(keycloakRoles),
    };

    console.log('📝 Registering user:', {
      email,
      username,
      roles: registerData.roles,
    });

    return this.http
      .post<any>(`${environment.gatewayUrl}/api/auth/signup`, registerData)
      .pipe(
        switchMap((registerResponse) => {
          console.log('✅ Registration successful, now logging in...');
          // After successful registration, login
          return this.loginToPersonalAuth(email, username);
        }),
        map((loginResponse) => {
          if (loginResponse.success) {
            console.log('✅ Auto-login after registration successful');
            this.storePersonalToken(loginResponse.token);
            return loginResponse;
          } else {
            throw new Error('Auto-login after registration failed');
          }
        }),
        catchError((error) => {
          console.error('❌ Registration or auto-login failed:', error);
          return of({
            success: false,
            message: `Registration failed: ${error.message}`,
          });
        })
      );
  }

  /**
   * Map Keycloak roles to your personal auth system roles
   */
  private mapKeycloakRoles(keycloakRoles: string[]): string[] {
    const mappedRoles: string[] = [];

    for (const role of keycloakRoles) {
      switch (role.toUpperCase()) {
        case 'ROLE_USER':
        case 'USER':
          mappedRoles.push('USER');
          break;
        case 'ROLE_ADMIN':
        case 'ADMIN':
          mappedRoles.push('ADMIN');
          break;
        default:
          mappedRoles.push('USER'); // Default role
          break;
      }
    }

    // Ensure at least USER role
    if (mappedRoles.length === 0) {
      mappedRoles.push('USER');
    }

    return mappedRoles;
  }

  /**
   * Store personal auth token
   */
  private storePersonalToken(token: string): void {
    if (token) {
      localStorage.setItem('personalAuthToken', token);
      console.log('💾 Personal auth token stored');
    }
  }

  /**
   * Get personal auth token
   */
  getPersonalAuthToken(): string | null {
    return localStorage.getItem('personalAuthToken');
  }

  /**
   * Check if both systems are authenticated
   */
  isBothSystemsReady(): boolean {
    return (
      this.keycloakService.isAuthenticated() && !!this.getPersonalAuthToken()
    );
  }

  /**
   * Clear personal auth data
   */
  clearPersonalAuth(): void {
    localStorage.removeItem('personalAuthToken');
    console.log('🗑️ Personal auth token cleared');
  }

  /**
   * Get current user info from both systems
   */
  getCurrentUserInfo(): any {
    const keycloakInfo = this.keycloakService.getTokenParsed();
    const personalToken = this.getPersonalAuthToken();

    return {
      keycloak: {
        authenticated: this.keycloakService.isAuthenticated(),
        email: keycloakInfo?.email,
        username: keycloakInfo?.preferred_username,
        roles: this.keycloakService.getUserRoles(),
      },
      personalAuth: {
        authenticated: !!personalToken,
        token: personalToken ? 'Present' : 'None',
      },
    };
  }
}
