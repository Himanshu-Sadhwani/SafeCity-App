import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { DispatchRecord } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class DispatchService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Dispatch`;

  async assign(incidentId: number): Promise<void> {
    await firstValueFrom(this.http.post(`${this.base}/assign`, { incidentId }));
  }

  async updateStatus(id: number, status: number): Promise<void> {
    await firstValueFrom(this.http.patch(`${this.base}/status/${id}`, { status }));
  }

  async list(filter: { incidentId?: number; status?: number; sortOrder?: string } = {}): Promise<DispatchRecord[]> {
    let params = new HttpParams();
    if (filter.incidentId) params = params.set('incidentId', filter.incidentId);
    if (filter.status !== undefined && filter.status !== null) params = params.set('status', filter.status);
    if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
    return await firstValueFrom(this.http.get<DispatchRecord[]>(`${this.base}/list`, { params }));
  }
}
