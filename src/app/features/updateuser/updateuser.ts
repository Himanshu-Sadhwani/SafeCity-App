import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/users.service';

@Component({
  selector: 'app-updateuser',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './updateuser.html',
  styles: []
})
export class Updateuser implements OnInit {

  userId: number | null = null;

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

  loading  = false;
  fetching = false;
  success  = '';
  error    = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  // Read ID from navigation state — not visible in URL
  const nav = this.router.getCurrentNavigation();
  const stateId = nav?.extras?.state?.['id']
    ?? history.state?.['id']; // fallback if page refreshed

  if (stateId) {
    this.userId = Number(stateId);
    this.fetchUser();
  } else {
    // No ID passed — redirect back
    this.router.navigate(['/admin/users']);
  }
}

  fetchUser(): void {
    this.fetching = true;
    this.error    = '';
    this.cdr.detectChanges();

    this.userService.getUserById(this.userId!).subscribe({
      next: (data) => {
        this.user = {
          name:   data.userName || '',
          phone:  data.phone    || '',
          roleID: this.roles.find(r => r.label.toLowerCase() === data.roleName?.toLowerCase())?.id || 0,
          status: data.status   || 'Active'
        };
        this.fetching = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.fetching = false;
        this.error = err.status === 404
          ? `User #${this.userId} not found.`
          : 'Failed to load user. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.error   = '';
    this.success = '';

    if (!this.user.name || !this.user.phone || !this.user.roleID) {
      this.error = 'Please fill in all required fields.';
      this.cdr.detectChanges();
      return;
    }

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
        setTimeout(() => this.router.navigate(['/admin/users']), 1800);
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
    this.router.navigate(['/admin/users']);
  }
}
