import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuditService } from '../../core/services/audit.service';
import { Audit, AUDIT_SCOPES, AUDIT_STATUSES } from '../../core/models/api-models';
import { getCurrentUser } from '../../shared/auth-utils';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-audits-page',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Audits</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div class="card mb-6">
    <h3 class="text-lg font-semibold mb-3">Create Audit</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="label">Scope</label>
        <select class="input" formControlName="scope">
          <option *ngFor="let s of scopes" [ngValue]="s.value">{{ s.label }}</option>
        </select>
      </div>
      <div>
        <label class="label">Status</label>
        <select class="input" formControlName="status">
          <option *ngFor="let s of statuses" [ngValue]="s.value">{{ s.label }}</option>
        </select>
      </div>
      <div>
        <label class="label">Officer ID (subject)</label>
        <input class="input" type="number" formControlName="officerID" />
        <p class="field-error" *ngIf="form.controls.officerID.touched && form.controls.officerID.errors">Required, must be &gt; 0.</p>
      </div>
      <div class="md:col-span-3">
        <label class="label">Findings</label>
        <textarea class="input" rows="3" formControlName="findings"></textarea>
        <p class="field-error" *ngIf="form.controls.findings.touched && form.controls.findings.errors?.['required']">Findings required.</p>
      </div>
      <div class="md:col-span-3">
        <button type="submit" class="btn-primary" [disabled]="submitting">
          {{ submitting ? 'Saving…' : 'Save Audit' }}
        </button>
      </div>
    </form>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Audit Log</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !audits.length" class="text-slate-500">No audits yet.</p>

    <div *ngIf="!loading && audits.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr><th>ID</th><th>Officer</th><th>Scope</th><th>Findings</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of audits">
            <td>{{ a.auditID }}</td>
            <td>{{ a.officerID }}</td>
            <td>{{ a.scope }}</td>
            <td class="max-w-xs truncate" [title]="a.findings">{{ a.findings }}</td>
            <td>{{ a.date | date:'medium' }}</td>
            <td><span class="badge-blue">{{ a.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
})
export class AuditsPage implements OnInit {
  scopes = AUDIT_SCOPES;
  statuses = AUDIT_STATUSES;
  audits: Audit[] = [];
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  form;

  constructor(private fb: FormBuilder, private api: AuditService) {
    this.form = this.fb.nonNullable.group({
      scope: [0, [Validators.required]],
      status: [0, [Validators.required]],
      officerID: [0, [Validators.required, Validators.min(1)]],
      findings: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.audits = await this.api.list();
    } catch (err: any) {
      if (err?.status === 404) this.audits = [];
      else this.showMessage(extractError(err, 'Failed to load audits.'), 'error');
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
        officerID: Number(v.officerID),
        scope: Number(v.scope),
        findings: v.findings,
        status: Number(v.status),
      });
      this.showMessage('Audit created.', 'success');
      this.form.reset({ scope: 0, status: 0, officerID: 0, findings: '' });
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to save audit.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
