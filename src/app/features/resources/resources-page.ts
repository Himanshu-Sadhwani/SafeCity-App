import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ResourceService } from '../../core/services/resource.service';
import { ResourceItem } from '../../core/models/api-models';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-resources-page',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
  <h2 class="page-title">Resources</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm bg-red-50 text-red-700">
    {{ message }}
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Available Resources</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !resources.length" class="text-slate-500">No resources found.</p>

    <div *ngIf="!loading && resources.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr><th>ID</th><th>Unit Name</th><th>Type</th><th>Availability</th><th>Location</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of resources">
            <td>{{ r.resourceID }}</td>
            <td>{{ r.unitName }}</td>
            <td>{{ r.type }}</td>
            <td><span [class]="badgeClass(r.availability)">{{ r.availability }}</span></td>
            <td>{{ r.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
})
export class ResourcesPage implements OnInit {
  resources: ResourceItem[] = [];
  loading = false;
  message = '';

  constructor(private api: ResourceService) {}

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.loading = true;
    this.message = '';
    try {
      this.resources = await this.api.list();
    } catch (err: any) {
      if (err?.status === 404) this.resources = [];
      else this.message = extractError(err, 'Failed to load resources.');
    } finally {
      this.loading = false;
    }
  }

  badgeClass(av: string): string {
    const s = (av ?? '').toLowerCase();
    if (s === 'available') return 'badge-green';
    if (s === 'ontask') return 'badge-amber';
    return 'badge-slate';
  }
}
