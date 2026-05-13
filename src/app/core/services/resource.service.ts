import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { ResourceItem } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Resource`;

  async list(filter: { type?: number; availability?: number; location?: string; sortOrder?: string } = {}): Promise<ResourceItem[]> {
    let params = new HttpParams();
    if (filter.type !== undefined && filter.type !== null) params = params.set('type', filter.type);
    if (filter.availability !== undefined && filter.availability !== null) params = params.set('availability', filter.availability);
    if (filter.location) params = params.set('location', filter.location);
    if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
    return await firstValueFrom(this.http.get<ResourceItem[]>(`${this.base}/list`, { params }));
  }

  async exists(unitName: string): Promise<boolean> {
    const params = new HttpParams().set('unitName', unitName);
    const res = await firstValueFrom(this.http.get<{ exists: boolean }>(`${this.base}/exists`, { params }));
    return res?.exists ?? false;
  }
}
