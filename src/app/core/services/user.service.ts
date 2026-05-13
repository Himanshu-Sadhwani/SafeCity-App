import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { UserUpdateRequest, UserView } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/User`;

  async getAll(): Promise<UserView[]> {
    return await firstValueFrom(this.http.get<UserView[]>(`${this.base}`));
  }

  async getById(id: number): Promise<UserView> {
    return await firstValueFrom(this.http.get<UserView>(`${this.base}/${id}`));
  }

  async update(id: number, payload: UserUpdateRequest): Promise<void> {
    await firstValueFrom(this.http.put(`${this.base}/update/${id}`, payload));
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.base}/delete/${id}`));
  }
}
