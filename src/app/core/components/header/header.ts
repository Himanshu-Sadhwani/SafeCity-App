// src/app/core/components/header/header.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatDivider } from '@angular/material/divider';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDivider, MaterialModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {

  profileOpen = false;
  userName    = 'User';
  userRole    = 'Citizen';
  initials    = 'CU';
  profilePath = '/citizen/profile'; // ← ADD HERE

  constructor(private router: Router) {}

  ngOnInit(): void {
    const name = localStorage.getItem('safecity_name') || 'Citizen User';
    const role = localStorage.getItem('safecity_role') || 'Citizen';

    this.userName  = name;
    this.userRole  = role;
    this.initials  = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    this.profilePath = localStorage.getItem('safecity_profile_path') || '/citizen/profile';
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
  }

  closeProfile(): void {
    this.profileOpen = false;
  }

  logout(): void {
    this.profileOpen = false;
    localStorage.removeItem('safecity_token');
    localStorage.removeItem('safecity_refresh_token');
    localStorage.removeItem('safecity_userId');
    localStorage.removeItem('safecity_name');
    localStorage.removeItem('safecity_role');
    this.router.navigate(['/login']);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrap')) {
      this.profileOpen = false;
    }
  }
}
