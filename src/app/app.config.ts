import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(), // Améliore la liaison des données entre routes
      withViewTransitions() // Améliore les transitions entre pages
    ), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()) // Configuration de HttpClient pour faire des requêtes HTTP
  ]
};
