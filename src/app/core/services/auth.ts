// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router: Router) {}

  // ── Login ──────────────────────────────────────────────
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.api}/auth/login`, { email, password }).pipe(
      tap(res => {
        const token        = res.data.accessToken;
        const refreshToken = res.data.refreshToken;

        // Decode JWT to get userId, email, role
        const decoded = this.decodeToken(token);

        // Store everything in localStorage
        localStorage.setItem(environment.tokenKey,        token);
        localStorage.setItem(environment.refreshTokenKey, refreshToken);
        localStorage.setItem('safecity_userId',
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '');
        localStorage.setItem('safecity_email',
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '');
        localStorage.setItem('safecity_role',
          decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Citizen');

        // Fetch user name after login using userId
        const userId = this.getUserId();
        if (userId) {
          this.http.get<any>(`${this.api}/user/${userId}`).subscribe({
            next: (user) => {
              localStorage.setItem('safecity_name', user.userName || '');
            }
          });
        }
      })
    );
  }

  // ── Decode JWT ─────────────────────────────────────────
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  }

  // ── Helpers ────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  getUserId(): string | null {
    return localStorage.getItem('safecity_userId');
  }

  getRole(): string {
    return localStorage.getItem('safecity_role') || 'Citizen';
  }

  getName(): string {
    return localStorage.getItem('safecity_name') || 'User';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ── Logout ─────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem('safecity_userId');
    localStorage.removeItem('safecity_name');
    localStorage.removeItem('safecity_role');
    localStorage.removeItem('safecity_email');
    this.router.navigate(['/login']);
  }

  // ── Route after login based on role ───────────────────
  // Update redirectAfterLogin() in src/app/core/services/auth.service.ts

redirectAfterLogin(): void {
  const role = this.getRole();
  if (role === 'Admin' || role === 'City Administrator' || role === '6') {
    localStorage.setItem('safecity_profile_path', '/admin/profile');
    this.router.navigate(['/admin']);        // ← goes to admin home first
  } else {
    localStorage.setItem('safecity_profile_path', '/citizen/profile');
    this.router.navigate(['/citizen']);
  }
}
}
