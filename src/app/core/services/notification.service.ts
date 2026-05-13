import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { NotificationRequest } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Notification`;

  async send(payload: NotificationRequest): Promise<void> {
    await firstValueFrom(this.http.post(`${this.base}/send`, payload));
  }
}
