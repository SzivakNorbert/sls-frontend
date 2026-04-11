import { Routes } from '@angular/router';
import { authGuard, adminGuard, courierGuard } from './core/guards/auth.guard';

export const routes: Routes = [
       {
              path: 'login',
              loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
       },
       {
              path: 'dashboard',
              loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
              canActivate: [authGuard]
       },
       {
              path: 'packages',
              canActivate: [authGuard],
              children: [
                     {
                            path: '',
                            loadComponent: () => import('./features/packages/package-list/package-list.component').then(m => m.PackageListComponent)
                     },
                     {
                            path: 'create',
                            loadComponent: () => import('./features/packages/package-create/package-create.component').then(m => m.PackageCreateComponent),
                            canActivate: [adminGuard]
                     },
                     {
                            path: 'assign',
                            loadComponent: () => import('./features/packages/package-assign/package-assign.component').then(m => m.PackageAssignComponent),
                            canActivate: [adminGuard]
                     },
                     {
                            path: 'tracking',
                            loadComponent: () => import('./features/packages/package-tracking/package-tracking.component').then(m => m.PackageTrackingComponent)
                     },
                     {
                            path: ':id',
                            loadComponent: () => import('./features/packages/package-detail/package-detail.component').then(m => m.PackageDetailComponent)
                     }
              ]
       },
       {
              path: 'couriers',
              canActivate: [authGuard, adminGuard],
              children: [
                     {
                            path: '',
                            loadComponent: () => import('./features/couriers/courier-list/courier-list.component').then(m => m.CourierListComponent)
                     },
                     {
                            path: 'create',
                            loadComponent: () => import('./features/couriers/courier-create/courier-create.component').then(m => m.CourierCreateComponent)
                     },
                     {
                            path: ':id',
                            loadComponent: () => import('./features/couriers/courier-detail/courier-detail.component').then(m => m.CourierDetailComponent)
                     }
              ]
       },
       {
              path: 'deliveries',
              canActivate: [authGuard],
              children: [
                     {
                            path: '',
                            loadComponent: () => import('./features/deliveries/delivery-list/delivery-list.component').then(m => m.DeliveryListComponent),
                            canActivate: [adminGuard]
                     },
                     {
                            path: 'my-deliveries',
                            loadComponent: () => import('./features/deliveries/my-deliveries/my-deliveries.component').then(m => m.MyDeliveriesComponent),
                            canActivate: [courierGuard]
                     },
                     {
                            path: ':id',
                            loadComponent: () => import('./features/deliveries/delivery-detail/delivery-detail.component').then(m => m.DeliveryDetailComponent)
                     }
              ]
       },
       {
              path: '',
              redirectTo: '/dashboard',
              pathMatch: 'full'
       },
       {
              path: '**',
              redirectTo: '/dashboard'
       }
];