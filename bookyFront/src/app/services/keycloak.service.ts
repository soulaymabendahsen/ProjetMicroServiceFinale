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

  init(): Promise<boolean> {
    return this.keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        return authenticated;
      })
      .catch((err) => {
        console.error('Keycloak init failed', err);
        return false;
      });
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  logout(): void {
    this.keycloak.logout();
  }

  getUsername(): string | undefined {
    return this.keycloak?.tokenParsed?.['preferred_username'];
  }
}
