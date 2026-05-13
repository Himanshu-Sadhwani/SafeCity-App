import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ComplianceService } from '../../core/services/compliance.service';
import {
  ComplianceItem, COMPLIANCE_TYPES, COMPLIANCE_RESULTS,
} from '../../core/models/api-models';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-compliance-page',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Compliance</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div class="card mb-6">
    <h3 class="text-lg font-semibold mb-3">Record Compliance</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="label">Entity ID</label>
        <input class="input" type="number" formControlName="entityId" />
        <p class="field-error" *ngIf="form.controls.entityId.touched && form.controls.entityId.errors">Required.</p>
      </div>
      <div>
        <label class="label">Type</label>
        <select class="input" formControlName="type">
          <option *ngFor="let t of types" [ngValue]="t.value">{{ t.label }}</option>
        </select>
      </div>
      <div>
        <label class="label">Result</label>
        <select class="input" formControlName="result">
          <option *ngFor="let r of results" [ngValue]="r.value">{{ r.label }}</option>
        </select>
      </div>
      <div class="md:col-span-3">
        <label class="label">Notes</label>
        <textarea class="input" rows="2" formControlName="notes"></textarea>
      </div>
      <div class="md:col-span-3">
        <button type="submit" class="btn-primary" [disabled]="submitting">
          {{ submitting ? 'Saving…' : 'Record' }}
        </button>
      </div>
    </form>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Compliance Log</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !items.length" class="text-slate-500">No records.</p>

    <div *ngIf="!loading && items.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr><th>ID</th><th>Entity</th><th>Type</th><th>Result</th><th>Notes</th><th>Date</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of items">
            <td>{{ c.complianceID }}</td>
            <td>{{ c.entityID }}</td>
            <td>{{ c.type }}</td>
            <td><span [class]="c.result === 'Pass' ? 'badge-green' : 'badge-red'">{{ c.result }}</span></td>
            <td>{{ c.notes }}</td>
            <td>{{ c.date | date:'medium' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
})
export class CompliancePage implements OnInit {
  types = COMPLIANCE_TYPES;
  results = COMPLIANCE_RESULTS;
  items: ComplianceItem[] = [];
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  form;

  constructor(private fb: FormBuilder, private api: ComplianceService) {
    this.form = this.fb.nonNullable.group({
      entityId: [0, [Validators.required, Validators.min(1)]],
      type: [0, [Validators.required]],
      result: [0, [Validators.required]],
      notes: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.items = await this.api.list();
    } catch (err: any) {
      if (err?.status === 404) this.items = [];
      else this.showMessage(extractError(err, 'Failed to load compliance.'), 'error');
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
        entityId: Number(v.entityId),
        type: Number(v.type),
        result: Number(v.result),
        notes: v.notes,
      });
      this.showMessage('Compliance recorded.', 'success');
      this.form.reset({ entityId: 0, type: 0, result: 0, notes: '' });
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to save.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
