import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { AssignResponseTeamRequest, CrisisResponseItem } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class ResponseService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Response`;

  async assign(payload: AssignResponseTeamRequest): Promise<void> {
    await firstValueFrom(this.http.post(`${this.base}/assign-team`, payload));
  }

  async list(filter: { status?: number; severity?: number; teamId?: number; crisisId?: number; location?: string } = {}): Promise<CrisisResponseItem[]> {
    let params = new HttpParams();
    if (filter.status !== undefined && filter.status !== null) params = params.set('Status', filter.status);
    if (filter.severity !== undefined && filter.severity !== null) params = params.set('Severity', filter.severity);
    if (filter.teamId) params = params.set('TeamId', filter.teamId);
    if (filter.crisisId) params = params.set('CrisisId', filter.crisisId);
    if (filter.location) params = params.set('Location', filter.location);
    const res = await firstValueFrom(
      this.http.get<{ message: string; data: CrisisResponseItem[] }>(`${this.base}/crisis-response`, { params })
    );
    return res?.data ?? [];
  }
}
