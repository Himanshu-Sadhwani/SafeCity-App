import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../shared/constants';
import { Crisis, CrisisCreateRequest } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class CrisisService {
  private http = inject(HttpClient);
  private base = `${API_BASE_URL}/Crisis`;

  async create(payload: CrisisCreateRequest): Promise<Crisis> {
    return await firstValueFrom(this.http.post<Crisis>(this.base, payload));
  }
}
