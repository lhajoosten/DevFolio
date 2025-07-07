import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'projecten',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./projects/projects-list/projects-list.component').then(
                (m) => m.ProjectsListComponent,
              ),
          },
          {
            path: 'nieuw',
            loadComponent: () =>
              import('./projects/project-form/project-form.component').then(
                (m) => m.ProjectFormComponent,
              ),
          },
          {
            path: ':id/bewerken',
            loadComponent: () =>
              import('./projects/project-form/project-form.component').then(
                (m) => m.ProjectFormComponent,
              ),
          },
        ],
      },
      {
        path: 'profiel',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'instellingen',
        loadComponent: () =>
          import('./settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
];
