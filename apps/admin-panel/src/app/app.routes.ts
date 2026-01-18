import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'booking', pathMatch: 'full' },
    {
        path: 'booking',
        loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent)
    }
];
