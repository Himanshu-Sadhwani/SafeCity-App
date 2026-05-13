import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ResponseService } from '../../core/services/response.service';
import { CrisisResponseItem } from '../../core/models/api-models';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-response-page',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Crisis Response</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div class="card mb-6">
    <h3 class="text-lg font-semibold mb-3">Assign Response Team</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="label">Crisis ID</label>
        <input class="input" type="number" formControlName="crisisId" />
        <p class="field-error" *ngIf="form.controls.crisisId.touched && form.controls.crisisId.errors">Required.</p>
      </div>
      <div>
        <label class="label">Team ID</label>
        <input class="input" type="number" formControlName="teamId" />
        <p class="field-error" *ngIf="form.controls.teamId.touched && form.controls.teamId.errors">Required.</p>
      </div>
      <div>
        <label class="label">Actions</label>
        <input class="input" formControlName="actions" />
        <p class="field-error" *ngIf="form.controls.actions.touched && form.controls.actions.errors?.['required']">Actions required.</p>
      </div>
      <div class="md:col-span-3">
        <button type="submit" class="btn-primary" [disabled]="submitting">
          {{ submitting ? 'Assigning…' : 'Assign Team' }}
        </button>
      </div>
    </form>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Crisis List</h3>
      <button class="btn-secondary text-xs" (click)="load()">Refresh</button>
    </div>

    <p *ngIf="loading" class="text-slate-500">Loading…</p>
    <p *ngIf="!loading && !items.length" class="text-slate-500">No active crises.</p>

    <div *ngIf="!loading && items.length" class="table-wrap">
      <table class="tbl">
        <thead>
          <tr><th>Crisis ID</th><th>Location</th><th>Severity</th><th>Status</th><th>Assigned?</th><th>Team</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of items">
            <td>{{ c.crisisId }}</td>
            <td>{{ c.location }}</td>
            <td>{{ c.severity }}</td>
            <td><span class="badge-blue">{{ c.status }}</span></td>
            <td>
              <span [class]="c.isResponseAssigned ? 'badge-green' : 'badge-amber'">
                {{ c.isResponseAssigned ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>{{ c.teamId ?? '-' }}</td>
            <td>{{ c.actions }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
})
export class ResponsePage implements OnInit {
  items: CrisisResponseItem[] = [];
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  form;

  constructor(private fb: FormBuilder, private api: ResponseService) {
    this.form = this.fb.nonNullable.group({
      crisisId: [0, [Validators.required, Validators.min(1)]],
      teamId: [0, [Validators.required, Validators.min(1)]],
      actions: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.items = await this.api.list();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to load crisis list.'), 'error');
    } finally {
      this.loading = false;
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    try {
      await this.api.assign(this.form.getRawValue());
      this.showMessage('Response team assigned.', 'success');
      this.form.reset({ crisisId: 0, teamId: 0, actions: '' });
      await this.load();
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to assign team.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
