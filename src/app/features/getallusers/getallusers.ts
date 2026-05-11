// src/app/features/getallusers/getallusers.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink ,NavigationEnd} from '@angular/router';
import { UserService } from '../../core/services/users.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-getallusers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './getallusers.html',
  styleUrl: './getallusers.css'
})
export class Getallusers implements OnInit {

  users: any[]    = [];
  filtered: any[] = [];
  loading         = false;
  error           = '';

  // Filters
  searchText  = '';
  searchId: number | null = null;
  roleFilter  = '';
  statusFilter = '';

  // Pagination
  currentPage = 1;
  pageSize    = 8;

  // Delete confirm modal
  deleteUserId: number | null = null;
  deleteLoading = false;
  deleteError   = '';

  // View modal
  viewUser: any = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  this.loadUsers(); // initial load

  // ← ADD THIS — reload every time you navigate back to this page
  this.router.events.pipe(
    filter(e => e instanceof NavigationEnd)
  ).subscribe(() => {
    if (this.router.url.includes('/admin/users')) {
      this.loadUsers();
    }
  });
}

  loadUsers(): void {
    this.loading = true;
    this.error   = '';
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users    = data;
        this.filtered = data;
        this.loading  = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.error = 'Access denied. Admin login required.';
        } else if (err.status === 404) {
          this.error = 'No users found.';
        } else {
          this.error = 'Failed to load users. Make sure the API is running.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    let result = [...this.users];

    if (this.searchId) {
      result = result.filter(u => u.userId === Number(this.searchId));
    } else {
      if (this.searchText.trim()) {
        const q = this.searchText.toLowerCase();
        result = result.filter(u =>
          u.userName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
        );
      }
      if (this.roleFilter) {
        result = result.filter(u =>
          u.roleName?.toLowerCase() === this.roleFilter.toLowerCase()
        );
      }
      if (this.statusFilter) {
        result = result.filter(u =>
          u.status?.toLowerCase() === this.statusFilter.toLowerCase()
        );
      }
    }

    this.filtered    = result;
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  clearFilters(): void {
    this.searchText   = '';
    this.searchId     = null;
    this.roleFilter   = '';
    this.statusFilter = '';
    this.filtered     = [...this.users];
    this.currentPage  = 1;
    this.cdr.detectChanges();
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize);
  }
  get paginatedUsers(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  changePage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.cdr.detectChanges();
  }

  // Initials avatar
  initials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // Navigate to update
  goToUpdate(id: number): void {
    this.router.navigate(['/update'], { queryParams: { id } });
  }

  // View user detail
  openView(user: any): void {
    this.viewUser = user;
    this.cdr.detectChanges();
  }
  closeView(): void {
    this.viewUser = null;
    this.cdr.detectChanges();
  }
  getActiveCount(): number {
  return this.users.filter(u => u.status === 'Active').length;
}

  // Delete
  confirmDelete(id: number): void {
    this.deleteUserId = id;
    this.deleteError  = '';
    this.cdr.detectChanges();
  }
  cancelDelete(): void {
    this.deleteUserId = null;
    this.deleteError  = '';
    this.cdr.detectChanges();
  }
  doDelete(): void {
    if (!this.deleteUserId) return;
    this.deleteLoading = true;
    this.deleteError   = '';
    this.userService.deleteUser(this.deleteUserId).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.deleteUserId  = null;
        this.loadUsers();
      },
      error: (err) => {
        this.deleteLoading = false;
        this.deleteError   = err?.error?.error || err?.error || 'Delete failed.';
        this.cdr.detectChanges();
      }
    });
  }
}
