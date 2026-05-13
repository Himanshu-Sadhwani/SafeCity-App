import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IncidentService } from '../../core/services/incident.service';
import {
  Incident, INCIDENT_TYPES, INCIDENT_STATUSES,
} from '../../core/models/api-models';
import { getCurrentUser, normalizeRole } from '../../shared/auth-utils';
import { ROLES } from '../../shared/constants';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-incidents-page',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Incidents</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div *ngIf="canCreate" class="card mb-6">
    <h3 class="text-lg font-semibold mb-3">Report a new incident</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">Type</label>
        <select class="input" formControlName="type">
          <option *ngFor="let t of types" [ngValue]="t.value">{{ t.label }}</option>
        </select>
      </div>
      <div>
        <label class="label">Date</label>
        <input class="input" type="date" formControlName="date" />
        <p class="field-error" *ngIf="form.controls.date.touched && form.controls.date.errors?.['required']">Date is required.</p>
      </div>
      <div class="md:col-span-2">
        <label class="label">Location</label>
        <input class="input" formControlName="location" />
        <p class="field-error" *ngIf="form.controls.location.touched && form.controls.location.errors?.['required']">Location is required.</p>
      </div>
      <div class="md:col-span-2">
        <button type="submit" class="btn-primary" [disabled]="submitting">
          {{ submitting ? 'Submitting…' : 'Submit Incident' }}
        </button>
      </div>
    </form>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Incident History</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !incidents.length" class="text-slate-500">No incidents yet.</p>

    <div *ngIf="!loading && incidents.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr>
            <th>ID</th><th>Type</th><th>Location</th><th>Date</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let i of incidents">
            <td>{{ i.incidentID }}</td>
            <td>{{ i.type }}</td>
            <td>{{ i.location }}</td>
            <td>{{ i.date | date:'medium' }}</td>
            <td><span [class]="badgeClass(i.status)">{{ i.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
})
export class IncidentsPage implements OnInit {
  types = INCIDENT_TYPES;
  statuses = INCIDENT_STATUSES;

  canCreate = false;
  incidents: Incident[] = [];
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  form;

  constructor(private fb: FormBuilder, private api: IncidentService) {
    this.form = this.fb.nonNullable.group({
      type: [1, [Validators.required]],
      location: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const role = normalizeRole(getCurrentUser()?.role ?? '');
    this.canCreate = role === ROLES.CITIZEN;
    this.load();
  }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.incidents = await this.api.list();
    } catch (err: any) {
      const status = err?.status;
      if (status === 404) this.incidents = [];
      else this.showMessage(extractError(err, 'Failed to load incidents.'), 'error');
    } finally {
      this.loading = false;
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    const user = getCurrentUser();
    const v = this.form.getRawValue();
    try {
      await this.api.create({
        citizenID: user?.userId ?? 0,
        type: Number(v.type),
        location: v.location,
        date: new Date(v.date).toISOString(),
        status: 1,
      });
      this.showMessage('Incident submitted.', 'success');
      this.form.reset({ type: 1, location: '', date: '' });
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to submit incident.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  badgeClass(status: string): string {
    const s = (status ?? '').toLowerCase();
    if (s === 'resolved') return 'badge-green';
    if (s === 'inprogress' || s === 'in_progress') return 'badge-amber';
    return 'badge-slate';
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
