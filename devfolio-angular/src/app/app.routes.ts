import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Publieke routes - Portfolio weergave
  {
    path: '',
    loadComponent: () => import('./features/portfolio/portfolio-home/portfolio-home.component')
      .then(m => m.PortfolioHomeComponent)
  },
  {
    path: 'projecten',
    loadComponent: () => import('./features/portfolio/projects-overview/projects-overview.component')
      .then(m => m.ProjectsOverviewComponent)
  },
  {
    path: 'over-mij',
    loadComponent: () => import('./features/portfolio/about/about.component')
      .then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/portfolio/contact/contact.component')
      .then(m => m.ContactComponent)
  },

  // Auth routes
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./features/auth/auth.routes')
  //     .then(m => m.AUTH_ROUTES)
  // },

  // Admin dashboard routes (protected)
  // {
  //   path: 'admin',
  //   canActivate: [AuthGuard, AdminGuard],
  //   loadChildren: () => import('./features/admin/admin.routes')
  //     .then(m => m.ADMIN_ROUTES)
  // },

  // Fallback route
  {
    path: '**',
    redirectTo: ''
  }
];
