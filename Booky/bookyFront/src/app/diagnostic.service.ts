import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DiagnosticService {
  constructor(private http: HttpClient) {}

  async testConnections() {
    console.log('=== COMPREHENSIVE CONNECTIVITY TEST ===');
    console.log('Environment URLs:');
    console.log('Gateway:', environment.gatewayUrl);
    console.log('Keycloak:', environment.keycloakUrl);
    console.log('Cart URL:', environment.cartUrl);

    // Test 1: Simple Gateway health check
    await this.testEndpoint(
      'Gateway Health',
      environment.gatewayUrl + '/health'
    );

    // Test 2: Gateway actuator
    await this.testEndpoint(
      'Gateway Actuator',
      environment.gatewayUrl + '/actuator/health'
    );

    // Test 3: Keycloak realm
    await this.testEndpoint(
      'Keycloak Realm',
      environment.keycloakUrl + 'realms/JobBoardKeyClock'
    );

    console.log('=== END CONNECTIVITY TEST ===');
  }

  private async testEndpoint(name: string, url: string) {
    try {
      console.log(`Testing ${name}: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include', // Match Gateway credentials setting
      });

      console.log(`Response headers for ${name}:`);
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });

      if (response.ok) {
        console.log(`✅ ${name}: SUCCESS (${response.status})`);
        const text = await response.text();
        console.log(`Response body: ${text.substring(0, 200)}...`);
      } else {
        console.log(
          `❌ ${name}: FAILED (${response.status} ${response.statusText})`
        );
        const text = await response.text();
        console.log(`Error response: ${text}`);
      }
    } catch (error) {
      console.log(`❌ ${name}: ERROR`, error);
    }
  }
}
