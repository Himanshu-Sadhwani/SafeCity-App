import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PatrolService } from '../../core/services/patrol.service';
import { AvailableOfficer, Patrol } from '../../core/models/api-models';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-patrols-page',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Patrols</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div class="card mb-6">
    <h3 class="text-lg font-semibold mb-3">Schedule a patrol</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="label">Patrol Date</label>
        <input class="input" type="date" formControlName="date" (change)="loadOfficers()" />
        <p class="field-error" *ngIf="form.controls.date.touched && form.controls.date.errors?.['required']">Date required.</p>
      </div>
      <div>
        <label class="label">Officer</label>
        <select class="input" formControlName="officerId">
          <option [ngValue]="0" disabled>Select officer</option>
          <option *ngFor="let o of officers" [ngValue]="o.officerId">{{ o.name }} (#{{ o.officerId }})</option>
        </select>
        <p class="field-error" *ngIf="form.controls.officerId.touched && form.controls.officerId.errors">Required.</p>
      </div>
      <div class="md:col-span-2">
        <label class="label">Area</label>
        <input class="input" formControlName="area" />
        <p class="field-error" *ngIf="form.controls.area.touched && form.controls.area.errors?.['required']">Area required.</p>
      </div>
      <div class="md:col-span-4">
        <button type="submit" class="btn-primary" [disabled]="submitting">
          {{ submitting ? 'Scheduling…' : 'Schedule Patrol' }}
        </button>
      </div>
    </form>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Patrol List</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !patrols.length" class="text-slate-500">No patrols.</p>

    <div *ngIf="!loading && patrols.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr><th>ID</th><th>Officer</th><th>Area</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of patrols">
            <td>{{ p.patrolId }}</td>
            <td>{{ p.officerId }}</td>
            <td>{{ p.area }}</td>
            <td>{{ p.date | date:'medium' }}</td>
            <td><span [class]="badgeClass(p.status)">{{ p.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
})
export class PatrolsPage implements OnInit {
  patrols: Patrol[] = [];
  officers: AvailableOfficer[] = [];
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  form;

  constructor(private fb: FormBuilder, private api: PatrolService) {
    this.form = this.fb.nonNullable.group({
      officerId: [0, [Validators.required, Validators.min(1)]],
      area: ['', [Validators.required, Validators.maxLength(100)]],
      date: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.patrols = await this.api.list();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to load patrols.'), 'error');
    } finally {
      this.loading = false;
    }
  }

  async loadOfficers(): Promise<void> {
    const date = this.form.controls.date.value;
    if (!date) { this.officers = []; return; }
    try {
      this.officers = await this.api.availableOfficers(new Date(date).toISOString());
    } catch {
      this.officers = [];
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    const v = this.form.getRawValue();
    try {
      await this.api.create({
        officerId: Number(v.officerId),
        area: v.area.trim(),
        date: new Date(v.date).toISOString(),
      });
      this.showMessage('Patrol scheduled.', 'success');
      this.form.reset({ officerId: 0, area: '', date: '' });
      this.officers = [];
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to schedule patrol.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  badgeClass(status: string): string {
    const s = (status ?? '').toLowerCase();
    if (s === 'onpatrol') return 'badge-blue';
    if (s === 'active') return 'badge-green';
    return 'badge-slate';
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
