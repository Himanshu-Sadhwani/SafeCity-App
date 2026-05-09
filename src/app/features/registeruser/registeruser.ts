import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/users.service';

@Component({
  selector: 'app-registeruser',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registeruser.html',
  styleUrl: './registeruser.css'
})
export class Registeruser {

  user = {
    name:     '',
    email:    '',
    phone:    '',
    password: '',
    roleID:   0
  };

  showPassword = false;
  loading      = false;
  success      = '';
  error        = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef   // ← ADD THIS
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.error   = '';
    this.success = '';

    if (!this.user.name || !this.user.email || !this.user.phone ||
        !this.user.password || !this.user.roleID) {
      this.error = 'Please fill in all required fields.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();  // ← ADD THIS

    const payload = {
      name:     this.user.name,
      email:    this.user.email,
      phone:    this.user.phone,
      password: this.user.password,
      roleID:   Number(this.user.roleID)
    };

    this.userService.registerUser(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = `User "${res.name ?? this.user.name}" registered successfully!`;
        this.cdr.detectChanges();  // ← ADD THIS
        this.onReset();
        setTimeout(() => this.router.navigate(['/getall']), 1800);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          this.error = err.error || 'Server error. Please try again.';
        } else if (err.status === 400) {
          const raw = err.error;
          if (typeof raw === 'string') {
            this.error = raw;
          } else if (raw?.errors) {
            this.error = Object.values(raw.errors).flat().join(' | ');
          } else {
            this.error = raw?.title || 'Invalid request.';
          }
        } else if (err.status === 0) {
          this.error = 'Cannot connect to server. Make sure the API is running.';
        } else {
          this.error = 'Registration failed. Please try again.';
        }
        this.cdr.detectChanges();  // ← ADD THIS
      }
    });
  }

  onReset(): void {
    this.user    = { name: '', email: '', phone: '', password: '', roleID: 0 };
    this.error   = '';
    this.success = '';
    this.cdr.detectChanges();  // ← ADD THIS
  }
}
