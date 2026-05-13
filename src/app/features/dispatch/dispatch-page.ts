import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DispatchService } from '../../core/services/dispatch.service';
import { DispatchRecord, DISPATCH_STATUSES } from '../../core/models/api-models';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-dispatch-page',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Dispatch Center</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div class="card mb-6">
    <h3 class="text-lg font-semibold mb-3">Assign Resource to Incident</h3>
    <form [formGroup]="form" (ngSubmit)="assign()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <label class="label">Incident ID</label>
        <input class="input" type="number" formControlName="incidentId" />
        <p class="field-error" *ngIf="form.controls.incidentId.touched && form.controls.incidentId.errors">Required, must be &gt; 0.</p>
      </div>
      <div class="flex items-end">
        <button type="submit" class="btn-primary w-full" [disabled]="submitting">
          {{ submitting ? 'Assigning…' : 'Assign Resource' }}
        </button>
      </div>
    </form>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Dispatch Records</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !records.length" class="text-slate-500">No dispatch records.</p>

    <div *ngIf="!loading && records.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr><th>ID</th><th>Incident</th><th>Dispatcher</th><th>Resource</th><th>Date</th><th>Status</th><th>Update</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let d of records">
            <td>{{ d.dispatchID }}</td>
            <td>{{ d.incidentId }}</td>
            <td>{{ d.dispatcherName }} (#{{ d.dispatcherId }})</td>
            <td>{{ d.resourceId }}</td>
            <td>{{ d.date | date:'medium' }}</td>
            <td><span [class]="badgeClass(d.status)">{{ d.status }}</span></td>
            <td>
              <select class="input py-1 text-xs"
                      (change)="updateStatus(d.dispatchID, $any($event.target).value)">
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
export class DispatchPage implements OnInit {
  statuses = DISPATCH_STATUSES;
  records: DispatchRecord[] = [];
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  form;

  constructor(private fb: FormBuilder, private api: DispatchService) {
    this.form = this.fb.nonNullable.group({
      incidentId: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.records = await this.api.list();
    } catch (err: any) {
      if (err?.status === 404) this.records = [];
      else this.showMessage(extractError(err, 'Failed to load dispatches.'), 'error');
    } finally {
      this.loading = false;
    }
  }

  async assign(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    try {
      await this.api.assign(Number(this.form.controls.incidentId.value));
      this.showMessage('Dispatch assigned.', 'success');
      this.form.reset({ incidentId: 0 });
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to assign dispatch.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  async updateStatus(id: number, val: string): Promise<void> {
    if (!val) return;
    try {
      await this.api.updateStatus(id, Number(val));
      this.showMessage(`Dispatch ${id} updated.`, 'success');
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Update failed.'), 'error');
    }
  }

  badgeClass(status: string): string {
    const s = (status ?? '').toLowerCase();
    if (s === 'resolved') return 'badge-green';
    if (s === 'cancelled') return 'badge-red';
    if (s === 'onsite' || s === 'enroute') return 'badge-amber';
    return 'badge-blue';
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
