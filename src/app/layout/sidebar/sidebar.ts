import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { getCurrentUser, normalizeRole } from '../../shared/auth-utils';
import { ROLES } from '../../shared/constants';

interface NavLink { label: string; path: string; roles: string[]; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgFor],
  template: `
  <aside class="w-64 bg-brand-900 text-white min-h-screen flex flex-col">
    <div class="px-5 py-4 border-b border-brand-700">
      <h1 class="text-xl font-bold">SafeCity</h1>
      <p class="text-xs text-brand-100 mt-1" *ngIf="user">{{ user.email }}</p>
      <p class="text-xs text-brand-100 mt-0.5" *ngIf="user">{{ roleLabel }}</p>
    </div>

    <nav class="flex-1 px-2 py-3 space-y-1 text-sm">
      <ng-container *ngFor="let link of links">
        <a *ngIf="canSee(link)"
           [routerLink]="link.path"
           routerLinkActive="bg-brand-700"
           class="block px-3 py-2 rounded hover:bg-brand-700 transition">
          {{ link.label }}
        </a>
      </ng-container>
    </nav>

    <div class="px-3 py-3 border-t border-brand-700">
      <button (click)="logout()" class="w-full btn-secondary text-sm">Logout</button>
    </div>
  </aside>
  `,
})
export class Sidebar implements OnInit {
  user = getCurrentUser();
  role = '';
  roleLabel = '';

  links: NavLink[] = [
    { label: 'Dashboard',        path: '/dashboard',     roles: ['*'] },
    { label: 'My Incidents',     path: '/incidents',     roles: [ROLES.CITIZEN, ROLES.ADMIN] },
    { label: 'Cases',            path: '/cases',         roles: [ROLES.CITIZEN, ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN] },
    { label: 'Patrols',          path: '/patrols',       roles: [ROLES.ADMIN] },
    { label: 'Field Reports',    path: '/field-reports', roles: [ROLES.POLICE, ROLES.ADMIN] },
    { label: 'Dispatch',         path: '/dispatch',      roles: [ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN] },
    { label: 'Resources',        path: '/resources',     roles: [ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN] },
    { label: 'Audits',           path: '/audits',        roles: [ROLES.COMPLIANCE_OFFICER] },
    { label: 'Compliance',       path: '/compliance',    roles: [ROLES.COMPLIANCE_OFFICER] },
    { label: 'Crisis',           path: '/crisis',        roles: [ROLES.ADMIN] },
    { label: 'Response',         path: '/response',      roles: [ROLES.ADMIN] },
    { label: 'Users',            path: '/users',         roles: [ROLES.ADMIN] },
    { label: 'Notifications',    path: '/notifications', roles: [ROLES.ADMIN] },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.role = normalizeRole(this.user?.role ?? '');
    this.roleLabel = this.role.replace(/_/g, ' ');
  }

  canSee(link: NavLink): boolean {
    if (link.roles.includes('*')) return true;
    return link.roles.includes(this.role);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
