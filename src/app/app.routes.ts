import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Registeruser } from './features/registeruser/registeruser';
import { Updateuser } from './features/updateuser/updateuser';
import { Deleteuser } from './features/deleteuser/deleteuser';
import { Getallusers } from './features/getallusers/getallusers';

export const routes: Routes = [
  // Home page — no layout shell
  {
    path: '',
    component: Home
  },

  // These go INSIDE the dashboard shell (if you have one)
  {
    path: 'register',
    component: Registeruser
  },
  {
    path: 'update',
    component: Updateuser
  },
  {
    path: 'delete',
    component: Deleteuser
  },
  {
    path: 'getall',
    component: Getallusers
  }
];
