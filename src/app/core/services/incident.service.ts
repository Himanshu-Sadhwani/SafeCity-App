import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { Incident, IncidentCreateRequest } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Incident`;

  async create(payload: IncidentCreateRequest): Promise<void> {
    await firstValueFrom(this.http.post(this.base, payload));
  }

  async list(filter: { type?: number; status?: number; location?: string; sort?: string } = {}): Promise<Incident[]> {
    let params = new HttpParams();
    if (filter.type !== undefined && filter.type !== null) params = params.set('type', filter.type);
    if (filter.status !== undefined && filter.status !== null) params = params.set('status', filter.status);
    if (filter.location) params = params.set('location', filter.location);
    if (filter.sort) params = params.set('sort', filter.sort);
    return await firstValueFrom(this.http.get<Incident[]>(`${this.base}/list`, { params }));
  }
}
