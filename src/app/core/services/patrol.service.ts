import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { AvailableOfficer, Patrol, PatrolCreateRequest } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class PatrolService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Patrol`;

  async list(filter: { patrolId?: number; officerId?: number; date?: string } = {}): Promise<Patrol[]> {
    let params = new HttpParams();
    if (filter.patrolId) params = params.set('PatrolId', filter.patrolId);
    if (filter.officerId) params = params.set('OfficerId', filter.officerId);
    if (filter.date) params = params.set('Date', filter.date);
    return await firstValueFrom(this.http.get<Patrol[]>(this.base, { params }));
  }

  async create(payload: PatrolCreateRequest): Promise<Patrol> {
    return await firstValueFrom(this.http.post<Patrol>(this.base, payload));
  }

  async availableOfficers(date: string): Promise<AvailableOfficer[]> {
    const params = new HttpParams().set('date', date);
    return await firstValueFrom(this.http.get<AvailableOfficer[]>(`${this.base}/available-officers`, { params }));
  }
}
