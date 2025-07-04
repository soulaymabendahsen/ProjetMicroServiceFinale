import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak = new Keycloak({
    url: environment.keycloakUrl,
    realm: 'JobBoardKeyClock',
    clientId: 'frontend-client',
  });

  private _isInitialized = false;

  init(): Promise<boolean> {
    return this.keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        enableLogging: true, // Enable logging for debugging
      })
      .then((authenticated) => {
        this._isInitialized = true;
        console.log(
          'Keycloak initialized successfully. Authenticated:',
          authenticated
        );
        console.log('Keycloak URL:', environment.keycloakUrl);
        if (authenticated) {
          console.log(
            'Keycloak token:',
            this.keycloak.token?.substring(0, 50) + '...'
          );
        }
        return authenticated;
      })
      .catch((err) => {
        console.error('Keycloak init failed', err);
        console.error('Keycloak URL attempted:', environment.keycloakUrl);
        console.error('Realm:', 'JobBoardKeyClock');
        console.error('Client ID:', 'frontend-client');
        this._isInitialized = false;
        return false;
      });
  }

  getToken(): string | undefined {
    if (!this._isInitialized) {
      console.warn('Keycloak not initialized yet');
      return undefined;
    }
    return this.keycloak?.token;
  }

  isAuthenticated(): boolean {
    return this._isInitialized && !!this.keycloak?.authenticated;
  }

  login(): Promise<void> {
    return this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  register(): Promise<void> {
    return this.keycloak.register();
  }

  updateToken(minValidity?: number): Promise<boolean> {
    return this.keycloak.updateToken(minValidity || 30);
  }

  getUsername(): string | undefined {
    return this.keycloak?.tokenParsed?.['preferred_username'];
  }

  getUserRoles(): string[] {
    return this.keycloak?.tokenParsed?.['realm_access']?.['roles'] || [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  getTokenParsed(): any {
    return this.keycloak?.tokenParsed;
  }
}
