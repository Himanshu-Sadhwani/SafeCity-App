import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import {
  FieldReport, FieldReportCreateRequest, FieldReportUpdateRequest,
} from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class FieldReportService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/FieldReport`;

  async list(filter: { reportId?: number; patrolId?: number; status?: number } = {}): Promise<FieldReport[]> {
    let params = new HttpParams();
    if (filter.reportId) params = params.set('ReportId', filter.reportId);
    if (filter.patrolId) params = params.set('PatrolId', filter.patrolId);
    if (filter.status !== undefined && filter.status !== null) params = params.set('Status', filter.status);
    return await firstValueFrom(this.http.get<FieldReport[]>(this.base, { params }));
  }

  async create(payload: FieldReportCreateRequest): Promise<void> {
    await firstValueFrom(this.http.post(this.base, payload));
  }

  async update(id: number, payload: FieldReportUpdateRequest): Promise<FieldReport> {
    return await firstValueFrom(this.http.patch<FieldReport>(`${this.base}/${id}`, payload));
  }
}
