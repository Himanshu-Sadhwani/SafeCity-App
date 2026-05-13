import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { ComplianceCreateRequest, ComplianceItem } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class ComplianceService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Compliance`;

  async list(filter: { type?: number; result?: number; sort?: string } = {}): Promise<ComplianceItem[]> {
    let params = new HttpParams();
    if (filter.type !== undefined && filter.type !== null) params = params.set('type', filter.type);
    if (filter.result !== undefined && filter.result !== null) params = params.set('result', filter.result);
    if (filter.sort) params = params.set('sort', filter.sort);
    return await firstValueFrom(this.http.get<ComplianceItem[]>(`${this.base}/list`, { params }));
  }

  async create(payload: ComplianceCreateRequest): Promise<void> {
    await firstValueFrom(this.http.post(this.base, payload));
  }
}
