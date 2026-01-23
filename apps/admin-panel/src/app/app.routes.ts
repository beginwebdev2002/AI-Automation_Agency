import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./widgets/layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'booking',
        loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./pages/inventory/inventory.component').then(m => m.InventoryComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
