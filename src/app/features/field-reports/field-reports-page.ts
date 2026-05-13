import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FieldReportService } from '../../core/services/field-report.service';
import { FieldReport, FIELD_REPORT_STATUSES } from '../../core/models/api-models';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-field-reports-page',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Field Reports</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div class="card mb-6">
    <h3 class="text-lg font-semibold mb-3">Submit a report</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="label">Patrol ID</label>
        <input class="input" type="number" formControlName="patrolId" />
        <p class="field-error" *ngIf="form.controls.patrolId.touched && form.controls.patrolId.errors">Required, must be &gt; 0.</p>
      </div>
      <div>
        <label class="label">Date</label>
        <input class="input" type="date" formControlName="date" />
        <p class="field-error" *ngIf="form.controls.date.touched && form.controls.date.errors?.['required']">Date required.</p>
      </div>
      <div class="md:col-span-3">
        <label class="label">Notes (50-100 chars)</label>
        <textarea class="input" rows="3" formControlName="notes"></textarea>
        <p class="field-error" *ngIf="form.controls.notes.touched && (form.controls.notes.errors?.['minlength'] || form.controls.notes.errors?.['maxlength'] || form.controls.notes.errors?.['required'])">
          Notes must be between 50 and 100 characters.
        </p>
      </div>
      <div class="md:col-span-3">
        <button type="submit" class="btn-primary" [disabled]="submitting">
          {{ submitting ? 'Submitting…' : 'Submit Report' }}
        </button>
      </div>
    </form>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">My Reports</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !reports.length" class="text-slate-500">No reports yet.</p>

    <div *ngIf="!loading && reports.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr><th>ID</th><th>Patrol</th><th>Notes</th><th>Date</th><th>Status</th><th>Update</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of reports">
            <td>{{ r.reportId }}</td>
            <td>{{ r.patrolId }}</td>
            <td class="max-w-xs truncate" [title]="r.notes">{{ r.notes }}</td>
            <td>{{ r.date | date:'medium' }}</td>
            <td><span [class]="badgeClass(r.status)">{{ r.status }}</span></td>
            <td>
              <select class="input py-1 text-xs"
                      (change)="updateStatus(r.reportId, $any($event.target).value)">
                <option value="">Change…</option>
                <option *ngFor="let s of statuses" [value]="s.value">{{ s.label }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
})
export class FieldReportsPage implements OnInit {
  statuses = FIELD_REPORT_STATUSES;
  reports: FieldReport[] = [];
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  form;

  constructor(private fb: FormBuilder, private api: FieldReportService) {
    this.form = this.fb.nonNullable.group({
      patrolId: [0, [Validators.required, Validators.min(1)]],
      notes: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(100)]],
      date: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.reports = await this.api.list();
    } catch (err: any) {
      if (err?.status === 404 || err?.status === 403) this.reports = [];
      else this.showMessage(extractError(err, 'Failed to load reports.'), 'error');
    } finally {
      this.loading = false;
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    const v = this.form.getRawValue();
    try {
      await this.api.create({
        patrolId: Number(v.patrolId),
        notes: v.notes,
        date: new Date(v.date).toISOString(),
      });
      this.showMessage('Field report submitted.', 'success');
      this.form.reset({ patrolId: 0, notes: '', date: '' });
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to submit report.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  async updateStatus(id: number, statusStr: string): Promise<void> {
    if (!statusStr) return;
    try {
      await this.api.update(id, { status: Number(statusStr) });
      this.showMessage(`Report ${id} updated.`, 'success');
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Update failed.'), 'error');
    }
  }

  badgeClass(status: string): string {
    const s = (status ?? '').toLowerCase();
    if (s === 'approved' || s === 'closed') return 'badge-green';
    if (s === 'rejected') return 'badge-red';
    if (s === 'inreview' || s === 'submitted') return 'badge-amber';
    return 'badge-slate';
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
