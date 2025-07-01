// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { KeycloakService } from './app/services/keycloak.service';

const keycloakService = new KeycloakService();

keycloakService.init().then(authenticated => {
  if (authenticated) {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  } else {
    console.error('User is not authenticated');
  }
});
