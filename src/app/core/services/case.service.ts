import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { CaseCreateRequest, CaseItem } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class CaseService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Case`;

  async list(filter: { status?: number; incidentId?: number; sort?: string } = {}): Promise<CaseItem[]> {
    let params = new HttpParams();
    if (filter.status !== undefined && filter.status !== null) params = params.set('status', filter.status);
    if (filter.incidentId) params = params.set('incidentId', filter.incidentId);
    if (filter.sort) params = params.set('sort', filter.sort);
    return await firstValueFrom(this.http.get<CaseItem[]>(`${this.base}/list-case`, { params }));
  }

  async create(payload: CaseCreateRequest): Promise<void> {
    await firstValueFrom(this.http.post(`${this.base}/create`, payload));
  }
}
