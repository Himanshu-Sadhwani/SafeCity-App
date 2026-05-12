// src/app/features/admin/home/admin-home.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/users.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-home.html',
  styles: []
})
export class AdminHome implements OnInit {

  userName    = 'Admin';
  totalUsers  = 0;
  activeUsers = 0;
  loading     = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const name    = localStorage.getItem('safecity_name') || 'Admin';
    this.userName = name.split(' ')[0]; // first name only

    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.totalUsers  = data.length;
        this.activeUsers = data.filter((u: any) => u.status === 'Active').length;
        this.loading     = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
