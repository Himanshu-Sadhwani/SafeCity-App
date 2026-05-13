import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { extractError } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  template: `
  <h2 class="page-title">Send Notification</h2>

  <div *ngIf="message"
       class="mb-3 rounded-md px-3 py-2 text-sm"
       [class.bg-emerald-50]="messageType==='success'"
       [class.text-emerald-700]="messageType==='success'"
       [class.bg-red-50]="messageType==='error'"
       [class.text-red-700]="messageType==='error'">
    {{ message }}
  </div>

  <div class="card max-w-2xl">
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-3">
      <div>
        <label class="label">Event Name</label>
        <input class="input" formControlName="event" placeholder="e.g. CrisisAlert" />
        <p class="field-error" *ngIf="form.controls.event.touched && form.controls.event.errors?.['required']">Event name required.</p>
      </div>
      <div>
        <label class="label">Target Group</label>
        <input class="input" formControlName="targetGroup" placeholder="e.g. crisis_zone_1, unit_PoliceUnit01" />
        <p class="field-error" *ngIf="form.controls.targetGroup.touched && form.controls.targetGroup.errors?.['required']">Target group required.</p>
      </div>
      <div>
        <label class="label">Payload (JSON)</label>
        <textarea class="input font-mono text-xs" rows="6" formControlName="payload" placeholder='{ "message": "Take cover" }'></textarea>
        <p class="field-error" *ngIf="payloadError">Payload must be valid JSON.</p>
      </div>
      <button type="submit" class="btn-primary" [disabled]="submitting">
        {{ submitting ? 'Sending…' : 'Send' }}
      </button>
    </form>
  </div>
  `,
})
export class NotificationsPage {
  form;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  payloadError = false;

  constructor(private fb: FormBuilder, private api: NotificationService) {
    this.form = this.fb.nonNullable.group({
      event: ['', [Validators.required]],
      targetGroup: ['', [Validators.required]],
      payload: ['{}', []],
    });
  }

  async submit(): Promise<void> {
    this.payloadError = false;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    let payload: any;
    try {
      payload = v.payload ? JSON.parse(v.payload) : {};
    } catch {
      this.payloadError = true;
      return;
    }
    this.submitting = true;
    try {
      await this.api.send({ event: v.event, targetGroup: v.targetGroup, payload });
      this.showMessage(`Notification sent to '${v.targetGroup}'.`, 'success');
      this.form.reset({ event: '', targetGroup: '', payload: '{}' });
    } catch (err: any) {
      this.showMessage(extractError(err, 'Failed to send.'), 'error');
    } finally {
      this.submitting = false;
    }
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}
