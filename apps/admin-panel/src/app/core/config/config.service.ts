import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    get(key: string): string {
        return (environment as any)[key] || '';
    }
}
