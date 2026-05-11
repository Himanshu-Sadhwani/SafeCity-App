// src/app/features/profile/profile.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/users.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  user: any = null;
  loading   = true;
  error     = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const raw = localStorage.getItem('safecity_userId');

    if (!raw) {
      this.loading = false;
      this.error   = 'No session found. Please log in.';
      this.cdr.detectChanges();
      return;
    }

    this.userService.getUserById(Number(raw)).subscribe({
      next: (data) => {
        this.user    = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error   = err.status === 404
          ? 'Profile not found.'
          : 'Failed to load profile.';
        this.cdr.detectChanges();
      }
    });
  }

  initials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
