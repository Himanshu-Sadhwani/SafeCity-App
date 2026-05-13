import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CaseService } from '../../core/services/case.service';
import { CaseItem } from '../../core/models/api-models';
import { getCurrentUser, normalizeRole } from '../../shared/auth-utils';
import { ROLES } from '../../shared/constants';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-cases-page',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Cases</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div *ngIf="canCreate" class="card mb-6">
    <h3 class="text-lg font-semibold mb-3">Create case</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="label">Incident ID</label>
        <input class="input" type="number" formControlName="incidentID" />
        <p class="field-error" *ngIf="form.controls.incidentID.touched && form.controls.incidentID.errors">Required, must be &gt; 0.</p>
      </div>
      <div>
        <label class="label">Officer ID</label>
        <input class="input" type="number" formControlName="assignedOfficerID" />
        <p class="field-error" *ngIf="form.controls.assignedOfficerID.touched && form.controls.assignedOfficerID.errors">Required, must be &gt; 0.</p>
      </div>
      <div class="md:col-span-3">
        <label class="label">Description</label>
        <textarea class="input" rows="2" formControlName="description"></textarea>
        <p class="field-error" *ngIf="form.controls.description.touched && form.controls.description.errors?.['required']">Description is required.</p>
      </div>
      <div class="md:col-span-3">
        <button type="submit" class="btn-primary" [disabled]="submitting">
          {{ submitting ? 'Creating…' : 'Create Case' }}
        </button>
      </div>
    </form>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Case List</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !cases.length" class="text-slate-500">No cases found.</p>

    <div *ngIf="!loading && cases.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr>
            <th>ID</th><th>Incident</th><th>Officer</th><th>Description</th><th>Status</th><th>Resolution</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of cases">
            <td>{{ c.caseID }}</td>
            <td>{{ c.incidentID }}</td>
            <td>{{ c.assignedOfficerID }}</td>
            <td>{{ c.description }}</td>
            <td><span [class]="badgeClass(c.status)">{{ c.status }}</span></td>
            <td>{{ c.resolutionDate | date:'mediumDate' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
})
export class CasesPage implements OnInit {
  canCreate = false;
  cases: CaseItem[] = [];
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  form;

  constructor(private fb: FormBuilder, private api: CaseService) {
    this.form = this.fb.nonNullable.group({
      incidentID: [0, [Validators.required, Validators.min(1)]],
      assignedOfficerID: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    const role = normalizeRole(getCurrentUser()?.role ?? '');
    this.canCreate = [ROLES.EMERGENCY_DISPATCHER, ROLES.ADMIN].includes(role as any);
    this.load();
  }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.cases = await this.api.list();
    } catch (err: any) {
      if (err?.status === 404) this.cases = [];
      else this.showMessage(extractError(err, 'Failed to load cases.'), 'error');
    } finally {
      this.loading = false;
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    try {
      await this.api.create(this.form.getRawValue());
      this.showMessage('Case created successfully.', 'success');
      this.form.reset({ incidentID: 0, assignedOfficerID: 0, description: '' });
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to create case.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  badgeClass(status: string): string {
    const s = (status ?? '').toLowerCase();
    if (s.includes('closed')) return 'badge-green';
    if (s.includes('investig')) return 'badge-amber';
    if (s.includes('open')) return 'badge-blue';
    return 'badge-slate';
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
