import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'booking', pathMatch: 'full' },
    {
        path: 'booking',
        loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent)
    },
    {
        path: 'calculator',
        loadComponent: () => import('./features/calculator/service-calculator.component').then(m => m.ServiceCalculatorComponent)
    },
    {
        path: 'chat',
        loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent)
    },
    {
        path: 'queue',
        loadComponent: () => import('./features/queue/queue-dashboard.component').then(m => m.QueueDashboardComponent)
    },
    {
        path: 'take-queue',
        loadComponent: () => import('./features/queue/take-queue.component').then(m => m.TakeQueueComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
    }
];
