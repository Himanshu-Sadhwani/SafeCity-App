// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Home }             from './features/home/home';
import { Login }            from './features/login/login';
import { Registeruser }     from './features/registeruser/registeruser';
import { Updateuser }       from './features/updateuser/updateuser';
import { Deleteuser }       from './features/deleteuser/deleteuser';
import { Getallusers }      from './features/getallusers/getallusers';
import { ProfileComponent } from './features/profile/profile';
import { LayoutComponent }  from './core/components/layout/layout';
import { CitizenDashboard } from './features/citizen-dashboard/citizen-dashboard';
import { AdminHome }        from './features/admin-home/admin-home';

export const routes: Routes = [

  // ── Public pages ──
  { path: '',         component: Home },
  { path: 'login',    component: Login },
  { path: 'register', component: Registeruser },
  { path: 'admin/users/edit', component: Updateuser },
  { path: 'delete',   component: Deleteuser },

  // ── Citizen pages ──
  {
    path: 'citizen',
    component: CitizenDashboard,
    children: [
      { path: 'profile', component: ProfileComponent },
    ]
  },

  // ── Admin pages (layout with sidebar) ──
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'admin',         component: AdminHome },      // ← default admin home
      { path: 'admin/users',   component: Getallusers },
      { path: 'admin/profile', component: ProfileComponent },
    ]
  },

  { path: 'getall',    redirectTo: 'admin/users' },
  { path: 'dashboard', redirectTo: 'admin' },
  { path: '**',        redirectTo: '' }
];
