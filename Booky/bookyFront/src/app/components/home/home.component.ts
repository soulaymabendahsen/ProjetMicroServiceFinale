import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../../services/keycloak.service';
import { DualAuthService } from '../../services/dual-auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private keycloakService: KeycloakService,
    private dualAuthService: DualAuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.checkKeycloakStatus();
    this.checkDualAuthStatus();
  }

  checkKeycloakStatus(): void {
    console.log('=== Keycloak Status Check ===');
    console.log('Is Authenticated:', this.keycloakService.isAuthenticated());
    console.log(
      'Token:',
      this.keycloakService.getToken() ? 'Present' : 'Not available'
    );
    console.log('Username:', this.keycloakService.getUsername());
    console.log('Environment Gateway URL:', environment.gatewayUrl);
    console.log('Environment Keycloak URL:', environment.keycloakUrl);
  }

  checkDualAuthStatus(): void {
    console.log('=== Dual Auth Status Check ===');
    const userInfo = this.dualAuthService.getCurrentUserInfo();
    console.log('Dual Auth Status:', userInfo);
    console.log(
      'Both Systems Ready:',
      this.dualAuthService.isBothSystemsReady()
    );
  }

  testLogin(): void {
    console.log('Attempting to login...');
    this.keycloakService.login();
  }

  testDualAuthSync(): void {
    console.log('Testing manual dual auth sync...');
    this.dualAuthService.syncWithPersonalAuth().subscribe({
      next: (result) => {
        console.log('✅ Dual auth sync result:', result);
        this.checkDualAuthStatus();
      },
      error: (error) => {
        console.error('❌ Dual auth sync error:', error);
      },
    });
  }

  testApiCall(): void {
    console.log('Testing API call...');
    this.http.get(environment.cartUrl + '/all').subscribe({
      next: (data) => console.log('API Success:', data),
      error: (error) => console.error('API Error:', error),
    });
  }

  testPersonalAuthAPI(): void {
    console.log('Testing personal auth API with stored token...');
    const personalToken = this.dualAuthService.getPersonalAuthToken();

    if (personalToken) {
      const headers = { Authorization: `Bearer ${personalToken}` };
      this.http
        .get(`${environment.gatewayUrl}/api/users/profile`, { headers })
        .subscribe({
          next: (data) => console.log('✅ Personal Auth API Success:', data),
          error: (error) => console.error('❌ Personal Auth API Error:', error),
        });
    } else {
      console.log('⚠️ No personal auth token available');
    }
  }
}
