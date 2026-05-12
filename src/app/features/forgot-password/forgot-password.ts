import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styles: []
})
export class ForgotPassword {

  email           = '';
  password        = '';
  confirmPassword = '';
  showPassword    = false;
  showConfirm     = false;
  loading         = false;
  error           = '';
  success         = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm(): void {
    this.showConfirm = !this.showConfirm;
  }

  onSubmit(): void {
    this.error   = '';
    this.success = '';

    if (!this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all required fields.';
      this.cdr.detectChanges();
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Password and Confirm Password do not match.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.authService.forgotPassword(this.email, this.password, this.confirmPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res?.message || 'Password updated successfully.';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Cannot connect to server. Make sure the API is running.';
        } else {
          this.error = err.error || err.error?.message || 'Something went wrong. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
