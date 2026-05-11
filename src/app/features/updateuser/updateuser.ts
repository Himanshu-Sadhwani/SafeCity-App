import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/users.service';

@Component({
  selector: 'app-updateuser',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './updateuser.html',
  styleUrl: './updateuser.css'
})
export class Updateuser {

  // Step 1 — lookup
  userId: number | null = null;
  lookingUp = false;
  notFound  = false;

  // Step 2 — edit
  user = {
    name:   '',
    phone:  '',
    roleID: 0,
    status: 'Active'
  };

  roles = [
    { id: 1, label: 'Citizen' },
    { id: 2, label: 'Police Officer' },
    { id: 3, label: 'Fire Fighter' },
    { id: 4, label: 'Emergency Dispatcher' },
    { id: 5, label: 'Compliance Officer' },
    { id: 6, label: 'City Administrator' },
  ];

  showForm = false;
  loading  = false;
  success  = '';
  error    = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    if (params['id']) {
      this.userId = Number(params['id']);
      this.cdr.detectChanges();
      this.lookupUser();   // ← auto-lookup when ID comes from URL
    }
  });
}

  // ── Step 1: Look up user by ID ──
  lookupUser(): void {
    if (!this.userId) {
      this.error = 'Please enter a User ID.';
      this.cdr.detectChanges();
      return;
    }

    this.lookingUp = true;
    this.notFound  = false;
    this.showForm  = false;
    this.error     = '';
    this.success   = '';
    this.cdr.detectChanges();

    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        // Pre-fill form with existing user data
        this.user = {
        name:   data.userName || '',
        phone:  data.phone    || '',
        roleID: this.roles.find(r => r.label.toLowerCase() === data.roleName?.toLowerCase())?.id || 0,
        status: data.status   || 'Active'
        };
        this.showForm  = true;
        this.lookingUp = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.lookingUp = false;
        this.notFound  = err.status === 404;
        this.error     = err.status === 404
          ? `User with ID ${this.userId} not found.`
          : 'Lookup failed. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  // ── Step 2: Submit update ──
  onSubmit(): void {
    this.error   = '';
    this.success = '';

    if (!this.user.name || !this.user.phone || !this.user.roleID) {
      this.error = 'Please fill in all required fields.';
      this.cdr.detectChanges();
      return;
    }
    setTimeout(() => this.router.navigate(['/admin/users']), 1800);
    this.loading = true;
    this.cdr.detectChanges();

    const payload = {
      name:   this.user.name,
      phone:  this.user.phone,
      roleID: Number(this.user.roleID),
      status: this.user.status
    };

    this.userService.updateUser(this.userId!, payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = `User #${this.userId} updated successfully!`;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/getall']), 1800);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 500) {
          this.error = err.error || 'Server error. Please try again.';
        } else if (err.status === 404) {
          this.error = 'User not found.';
        } else if (err.status === 400) {
          const raw = err.error;
          this.error = typeof raw === 'string' ? raw
            : raw?.errors ? Object.values(raw.errors).flat().join(' | ')
            : raw?.title || 'Invalid request.';
        } else if (err.status === 0) {
          this.error = 'Cannot connect to server.';
        } else {
          this.error = 'Update failed. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  onReset(): void {
    this.userId   = null;
    this.showForm = false;
    this.error    = '';
    this.success  = '';
    this.user     = { name: '', phone: '', roleID: 0, status: 'Active' };
    this.router.navigate(['/admin/users']);
    this.cdr.detectChanges();
  }
}
