import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { ROLES } from './shared/constants';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login',           loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'register',        loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword) },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      { path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) },

      { path: 'incidents',
        canActivate: [roleGuard([ROLES.CITIZEN, ROLES.ADMIN])],
        loadComponent: () => import('./features/incidents/incidents-page').then(m => m.IncidentsPage) },

      { path: 'cases',
        canActivate: [roleGuard([ROLES.CITIZEN, ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN])],
        loadComponent: () => import('./features/cases/cases-page').then(m => m.CasesPage) },

      { path: 'patrols',
        canActivate: [roleGuard([ROLES.ADMIN])],
        loadComponent: () => import('./features/patrols/patrols-page').then(m => m.PatrolsPage) },

      { path: 'field-reports',
        canActivate: [roleGuard([ROLES.POLICE, ROLES.ADMIN])],
        loadComponent: () => import('./features/field-reports/field-reports-page').then(m => m.FieldReportsPage) },

      { path: 'dispatch',
        canActivate: [roleGuard([ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN])],
        loadComponent: () => import('./features/dispatch/dispatch-page').then(m => m.DispatchPage) },

      { path: 'resources',
        canActivate: [roleGuard([ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN])],
        loadComponent: () => import('./features/resources/resources-page').then(m => m.ResourcesPage) },

      { path: 'audits',
        canActivate: [roleGuard([ROLES.COMPLIANCE_OFFICER])],
        loadComponent: () => import('./features/audits/audits-page').then(m => m.AuditsPage) },

      { path: 'compliance',
        canActivate: [roleGuard([ROLES.COMPLIANCE_OFFICER])],
        loadComponent: () => import('./features/compliance/compliance-page').then(m => m.CompliancePage) },

      { path: 'crisis',
        canActivate: [roleGuard([ROLES.ADMIN])],
        loadComponent: () => import('./features/crisis/crisis-page').then(m => m.CrisisPage) },

      { path: 'response',
        canActivate: [roleGuard([ROLES.ADMIN])],
        loadComponent: () => import('./features/response/response-page').then(m => m.ResponsePage) },

      { path: 'users',
        canActivate: [roleGuard([ROLES.ADMIN])],
        loadComponent: () => import('./features/users/users-page').then(m => m.UsersPage) },

      { path: 'notifications',
        canActivate: [roleGuard([ROLES.ADMIN])],
        loadComponent: () => import('./features/notifications/notifications-page').then(m => m.NotificationsPage) },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
