import { InjectionToken } from '@angular/core';
import { AppConfig } from '../models/app-config';

export const APP_CONFIG = new InjectionToken<AppConfig>(
  'Application Configuration',
);
