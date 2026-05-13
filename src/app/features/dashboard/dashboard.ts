import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { getCurrentUser, normalizeRole } from '../../shared/auth-utils';
import { ROLES } from '../../shared/constants';

interface Tile { label: string; path: string; roles: string[]; desc: string; color: string; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  template: `
  <h2 class="page-title">Welcome{{ name ? ', ' + name : '' }}</h2>
  <p class="text-sm text-slate-500 mb-6">Role: <span class="font-medium">{{ roleLabel }}</span></p>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <a *ngFor="let t of visibleTiles" [routerLink]="t.path"
       class="card hover:shadow-md transition border-l-4" [style.borderColor]="t.color">
      <h3 class="text-lg font-semibold text-slate-800">{{ t.label }}</h3>
      <p class="text-sm text-slate-500 mt-1">{{ t.desc }}</p>
    </a>
  </div>

  <div *ngIf="!visibleTiles.length" class="card text-center text-slate-500">
    No actions available for your role yet.
  </div>
  `,
})
export class Dashboard {
  user = getCurrentUser();
  role = normalizeRole(getCurrentUser()?.role ?? '');
  name = '';
  roleLabel = '';

  tiles: Tile[] = [
    { label: 'Report Incident', path: '/incidents', desc: 'File new incidents and view history.',
      roles: [ROLES.CITIZEN, ROLES.ADMIN], color: '#3b82f6' },
    { label: 'My Cases', path: '/cases', desc: 'Track your case status.',
      roles: [ROLES.CITIZEN], color: '#10b981' },
    { label: 'Case Management', path: '/cases', desc: 'Create and manage cases.',
      roles: [ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN], color: '#10b981' },
    { label: 'Field Reports', path: '/field-reports', desc: 'Submit and review field reports.',
      roles: [ROLES.POLICE, ROLES.ADMIN], color: '#f59e0b' },
    { label: 'Patrols', path: '/patrols', desc: 'Schedule and monitor patrols.',
      roles: [ROLES.ADMIN], color: '#8b5cf6' },
    { label: 'Dispatch Center', path: '/dispatch', desc: 'Assign and manage dispatch.',
      roles: [ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN], color: '#ef4444' },
    { label: 'Resources', path: '/resources', desc: 'View available resources.',
      roles: [ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN], color: '#06b6d4' },
    { label: 'Audits', path: '/audits', desc: 'Create compliance audits.',
      roles: [ROLES.COMPLIANCE_OFFICER], color: '#6366f1' },
    { label: 'Compliance', path: '/compliance', desc: 'Record compliance results.',
      roles: [ROLES.COMPLIANCE_OFFICER], color: '#6366f1' },
    { label: 'Crisis', path: '/crisis', desc: 'Create crisis events.',
      roles: [ROLES.ADMIN], color: '#dc2626' },
    { label: 'Response', path: '/response', desc: 'Assign teams to crises.',
      roles: [ROLES.ADMIN], color: '#dc2626' },
    { label: 'Users', path: '/users', desc: 'Manage system users.',
      roles: [ROLES.ADMIN], color: '#0f172a' },
    { label: 'Notifications', path: '/notifications', desc: 'Send group notifications.',
      roles: [ROLES.ADMIN], color: '#0f172a' },
  ];

  constructor() {
    this.name = (this.user?.email ?? '').split('@')[0];
    this.roleLabel = this.role.replace(/_/g, ' ') || 'Guest';
  }

  get visibleTiles(): Tile[] {
    return this.tiles.filter(t => t.roles.includes(this.role));
  }
}
