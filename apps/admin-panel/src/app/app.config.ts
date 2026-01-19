import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { appRoutes } from './app.routes';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withHashLocation()),
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
};
