import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { extractError } from '../../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  template: `
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-700 to-brand-900 p-4">
    <div class="card w-full max-w-md">
      <h2 class="page-title text-center">SafeCity Login</h2>

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
          <input class="input" type="email" formControlName="email" placeholder="you@example.com" />
          <p class="field-error" *ngIf="form.controls.email.touched && form.controls.email.errors?.['required']">Email is required.</p>
          <p class="field-error" *ngIf="form.controls.email.touched && form.controls.email.errors?.['email']">Enter a valid email.</p>
        </div>
        <div>
          <label class="label">Password</label>
          <input class="input" type="password" formControlName="password" placeholder="••••••••" />
          <p class="field-error" *ngIf="form.controls.password.touched && form.controls.password.errors?.['required']">Password is required.</p>
        </div>
        <button class="btn-primary w-full" type="submit" [disabled]="submitting">
          {{ submitting ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-4 text-sm flex justify-between">
        <a routerLink="/register" class="text-brand-600 hover:underline">Register</a>
        <a routerLink="/forgot-password" class="text-brand-600 hover:underline">Forgot password?</a>
      </div>
    </div>
  </div>
  `,
})
export class Login {
  form;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    try {
      await this.auth.login(this.form.getRawValue());
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.message = extractError(err, 'Login failed.');
      this.messageType = 'error';
    } finally {
      this.submitting = false;
    }
  }
}
