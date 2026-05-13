import { Component } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CrisisService } from '../../core/services/crisis.service';
import {
  Crisis, CRISIS_TYPES, CRISIS_SEVERITIES, CRISIS_STATUSES,
} from '../../core/models/api-models';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-crisis-page',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Crisis Management</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div class="card mb-6">
    <h3 class="text-lg font-semibold mb-3">Declare a crisis</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="label">Type</label>
        <select class="input" formControlName="type">
          <option *ngFor="let t of types" [ngValue]="t.value">{{ t.label }}</option>
        </select>
      </div>
      <div>
        <label class="label">Severity</label>
        <select class="input" formControlName="severity">
          <option *ngFor="let s of severities" [ngValue]="s.value">{{ s.label }}</option>
        </select>
      </div>
      <div>
        <label class="label">Status</label>
        <select class="input" formControlName="status">
          <option *ngFor="let s of statuses" [ngValue]="s.value">{{ s.label }}</option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label class="label">Location</label>
        <input class="input" formControlName="location" />
        <p class="field-error" *ngIf="form.controls.location.touched && form.controls.location.errors?.['required']">Location required.</p>
      </div>
      <div>
        <label class="label">Date</label>
        <input class="input" type="date" formControlName="date" />
        <p class="field-error" *ngIf="form.controls.date.touched && form.controls.date.errors?.['required']">Date required.</p>
      </div>
      <div class="md:col-span-3">
        <button type="submit" class="btn-danger" [disabled]="submitting">
          {{ submitting ? 'Saving…' : 'Declare Crisis' }}
        </button>
      </div>
    </form>
  </div>

  <div *ngIf="recent" class="card">
    <h3 class="text-lg font-semibold mb-3">Last declared</h3>
    <div class="text-sm">
      <p><strong>ID:</strong> {{ recent.crisisID }}</p>
      <p><strong>Type:</strong> {{ recent.type }}</p>
      <p><strong>Severity:</strong> {{ recent.severity }}</p>
      <p><strong>Location:</strong> {{ recent.location }}</p>
      <p><strong>Date:</strong> {{ recent.date | date:'medium' }}</p>
      <p><strong>Status:</strong> <span class="badge-red">{{ recent.status }}</span></p>
    </div>
  </div>
  `,
})
export class CrisisPage {
  types = CRISIS_TYPES;
  severities = CRISIS_SEVERITIES;
  statuses = CRISIS_STATUSES;

  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  recent: Crisis | null = null;

  form;

  constructor(private fb: FormBuilder, private api: CrisisService) {
    this.form = this.fb.nonNullable.group({
      type: [0, [Validators.required]],
      severity: [0, [Validators.required]],
      status: [0, [Validators.required]],
      location: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    const v = this.form.getRawValue();
    try {
      this.recent = await this.api.create({
        type: Number(v.type),
        severity: Number(v.severity),
        status: Number(v.status),
        location: v.location,
        date: new Date(v.date).toISOString(),
      });
      this.showMessage('Crisis declared.', 'success');
      this.form.reset({ type: 0, severity: 0, status: 0, location: '', date: '' });
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to declare crisis.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
