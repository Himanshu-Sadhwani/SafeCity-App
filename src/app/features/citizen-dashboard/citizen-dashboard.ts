// src/app/features/citizen/dashboard/citizen-dashboard.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatNavList } from '@angular/material/list';
import { MatIconButton } from '@angular/material/button';
import { MaterialModule } from '../../shared/material.module';
import { filter } from 'rxjs';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatDivider,
    MatNavList,
    MatIconButton,
    MaterialModule,
  ],
  templateUrl: './citizen-dashboard.html',
  styles: []
})
export class CitizenDashboard implements OnInit {

  profileOpen  = false;
  userName     = 'Citizen User';
  initials     = 'CU';
  showWelcome  = true;
  profilePath  = '/citizen/profile';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const name      = localStorage.getItem('safecity_name') || 'Citizen User';
    this.userName   = name;
    this.initials   = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    this.profilePath = localStorage.getItem('safecity_profile_path') || '/citizen/profile';

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.showWelcome = e.urlAfterRedirects === '/citizen' ||
                         e.urlAfterRedirects === '/citizen/';
    });

    this.showWelcome = this.router.url === '/citizen' ||
                       this.router.url === '/citizen/';
  }

  toggleProfile(): void { this.profileOpen = !this.profileOpen; }
  closeProfile():  void { this.profileOpen = false; }

  logout(): void {
    this.profileOpen = false;
    localStorage.removeItem('safecity_token');
    localStorage.removeItem('safecity_refresh_token');
    localStorage.removeItem('safecity_userId');
    localStorage.removeItem('safecity_name');
    localStorage.removeItem('safecity_role');
    localStorage.removeItem('safecity_email');
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrap')) {
      this.profileOpen = false;
    }
  }
}
