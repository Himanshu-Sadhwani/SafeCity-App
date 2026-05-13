import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { Audit, AuditCreateRequest } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Audit`;

  async list(filter: { scope?: number; status?: number; officerId?: number; sort?: string } = {}): Promise<Audit[]> {
    let params = new HttpParams();
    if (filter.scope !== undefined && filter.scope !== null) params = params.set('scope', filter.scope);
    if (filter.status !== undefined && filter.status !== null) params = params.set('status', filter.status);
    if (filter.officerId) params = params.set('officerId', filter.officerId);
    if (filter.sort) params = params.set('sort', filter.sort);
    const res = await firstValueFrom(this.http.get<any>(`${this.base}/list`, { params }));
    return Array.isArray(res) ? res : (res?.data ?? []);
  }

  async create(payload: AuditCreateRequest): Promise<void> {
    await firstValueFrom(this.http.post(this.base, payload));
  }
}
