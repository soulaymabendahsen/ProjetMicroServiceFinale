import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../../services/keycloak.service';
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
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.checkKeycloakStatus();
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

  testLogin(): void {
    console.log('Attempting to login...');
    this.keycloakService.login();
  }

  testApiCall(): void {
    console.log('Testing API call...');
    this.http.get(environment.cartUrl + '/all').subscribe({
      next: (data) => console.log('API Success:', data),
      error: (error) => console.error('API Error:', error),
    });
  }
}
