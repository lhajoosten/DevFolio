import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'app',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'portfolio',
        loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent)
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'projects',
            loadComponent: () => import('./features/admin/projects/admin-projects.component').then(m => m.AdminProjectsComponent)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'portfolio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'portfolio',
    redirectTo: '/app/portfolio',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
