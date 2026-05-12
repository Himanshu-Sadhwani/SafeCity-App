// src/app/features/login/login.ts
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styles: []
})
export class Login {

  email       = '';
  password    = '';
  showPassword = false;
  loading     = false;
  error       = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Please enter your email and password.';
       this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
       // Redirect based on role
        this.authService.redirectAfterLogin();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.error = err.error?.message || 'Invalid email or password.';
        } else if (err.status === 400) {
          this.error = err.error?.message || 'Please check your details.';
        } else if (err.status === 0) {
          this.error = 'Cannot connect to server. Make sure the API is running.';
        } else {
          this.error = err.error?.message || 'Login failed. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
