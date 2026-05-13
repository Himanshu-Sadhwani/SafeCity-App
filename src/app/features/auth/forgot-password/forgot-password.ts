import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { extractError } from '../../../core/interceptors/error.interceptor';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const a = group.get('password')?.value;
  const b = group.get('confirmPassword')?.value;
  return a && b && a !== b ? { mismatch: true } : null;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  template: `
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-700 to-brand-900 p-4">
    <div class="card w-full max-w-md">
      <h2 class="page-title text-center">Reset Password</h2>

      <div *ngIf="message"
           class="mb-3 rounded-md px-3 py-2 text-sm"
           [class.bg-emerald-50]="messageType==='success'"
           [class.text-emerald-700]="messageType==='success'"
           [class.bg-red-50]="messageType==='error'"
           [class.text-red-700]="messageType==='error'">
        {{ message }}
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-3">
        <div>
          <label class="label">Email</label>
          <input class="input" type="email" formControlName="email" />
          <p class="field-error" *ngIf="form.controls.email.touched && form.controls.email.errors?.['email']">Enter a valid email.</p>
        </div>
        <div>
          <label class="label">New Password</label>
          <input class="input" type="password" formControlName="password" />
        </div>
        <div>
          <label class="label">Confirm Password</label>
          <input class="input" type="password" formControlName="confirmPassword" />
          <p class="field-error" *ngIf="form.errors?.['mismatch'] && form.controls.confirmPassword.touched">Passwords do not match.</p>
        </div>
        <button class="btn-primary w-full" type="submit" [disabled]="submitting">
          {{ submitting ? 'Updating…' : 'Reset Password' }}
        </button>
      </form>

      <p class="mt-4 text-sm text-center">
        <a routerLink="/login" class="text-brand-600 hover:underline">Back to login</a>
      </p>
    </div>
  </div>
  `,
})
export class ForgotPassword {
  form;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: [passwordsMatch] });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    try {
      await this.auth.forgotPassword(this.form.getRawValue());
      this.message = 'Password reset successfully.';
      this.messageType = 'success';
      setTimeout(() => this.router.navigate(['/login']), 800);
    } catch (err: any) {
      this.message = extractError(err, 'Reset failed.');
      this.messageType = 'error';
    } finally {
      this.submitting = false;
    }
  }
}
