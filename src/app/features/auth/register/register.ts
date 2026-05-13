import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { extractError } from '../../../core/interceptors/error.interceptor';
import { ROLE_LIST } from '../../../shared/constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink],
  template: `
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-700 to-brand-900 p-4">
    <div class="card w-full max-w-md">
      <h2 class="page-title text-center">Create Account</h2>

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
          <label class="label">Full Name</label>
          <input class="input" formControlName="name" />
          <p class="field-error" *ngIf="form.controls.name.touched && form.controls.name.errors?.['required']">Name is required.</p>
        </div>
        <div>
          <label class="label">Email</label>
          <input class="input" type="email" formControlName="email" />
          <p class="field-error" *ngIf="form.controls.email.touched && form.controls.email.errors?.['email']">Enter a valid email.</p>
        </div>
        <div>
          <label class="label">Phone</label>
          <input class="input" formControlName="phone" />
          <p class="field-error" *ngIf="form.controls.phone.touched && form.controls.phone.errors?.['pattern']">10-digit phone required.</p>
        </div>
        <div>
          <label class="label">Role</label>
          <select class="input" formControlName="roleID">
            <option *ngFor="let r of roles" [ngValue]="r.id">{{ r.label }}</option>
          </select>
        </div>
        <div>
          <label class="label">Password</label>
          <input class="input" type="password" formControlName="password" />
          <p class="field-error" *ngIf="form.controls.password.touched && form.controls.password.errors?.['minlength']">Min 6 characters.</p>
        </div>
        <button class="btn-primary w-full" type="submit" [disabled]="submitting">
          {{ submitting ? 'Creating…' : 'Register' }}
        </button>
      </form>

      <p class="mt-4 text-sm text-center">
        Already have an account? <a routerLink="/login" class="text-brand-600 hover:underline">Sign in</a>
      </p>
    </div>
  </div>
  `,
})
export class Register {
  roles = ROLE_LIST;
  form;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      roleID: [1, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    try {
      await this.auth.register(this.form.getRawValue());
      this.message = 'Registered successfully. Please sign in.';
      this.messageType = 'success';
      setTimeout(() => this.router.navigate(['/login']), 800);
    } catch (err: any) {
      this.message = extractError(err, 'Registration failed.');
      this.messageType = 'error';
    } finally {
      this.submitting = false;
    }
  }
}
