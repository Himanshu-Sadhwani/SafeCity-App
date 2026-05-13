import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  API_BASE_URL, TOKEN_KEY, USER_KEY, REFRESH_KEY,
} from '../../shared/constants';
import { buildUserFromToken } from '../../shared/auth-utils';
import {
  LoginRequest, LoginResponseBody, RegisterRequest, ForgotPasswordRequest,
} from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Auth`;
  private userBase = `${API_BASE_URL}/User`;

  async login(payload: LoginRequest): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponseBody>(`${this.base}/login`, payload)
    );
    const token = res?.data?.accessToken;
    if (!token) throw new Error('Invalid login response');
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_KEY, res.data.refreshToken ?? '');
    const user = buildUserFromToken(token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  async register(payload: RegisterRequest): Promise<void> {
    await firstValueFrom(this.http.post(`${this.userBase}/register`, payload));
  }

  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await firstValueFrom(this.http.put(`${this.userBase}/forgotpassword`, payload));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
