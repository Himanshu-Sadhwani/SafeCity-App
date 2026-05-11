import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api = environment.apiBaseUrl; // http://localhost:5097/api/v1

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(environment.tokenKey);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // ── USERS ────────────────────────────────────────────────
  getAllUsers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/user`,   // ← /user not /users
    { headers: this.getHeaders() });
  }


  getUserById(id: number): Observable<any> {
  return this.http.get<any>(`${this.api}/user/${id}`,
    { headers: this.getHeaders() });
}

  registerUser(user: any): Observable<any> {
  return this.http.post<any>(`${this.api}/user/register`, user,
    { headers: this.getHeaders() });
}

  // In users.service.ts replace updateUser method with this:

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.api}/user/update/${id}`, user,
      { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/user/delete/${id}`,  // ← /user/delete/{id}
      { headers: this.getHeaders() });
  }

  // ── INCIDENTS ────────────────────────────────────────────
  getAllIncidents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/incidents`,
      { headers: this.getHeaders() });
  }

  createIncident(incident: any): Observable<any> {
    return this.http.post<any>(`${this.api}/incidents`, incident,
      { headers: this.getHeaders() });
  }

  updateIncidentStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.api}/incidents/${id}/status`, { status },
      { headers: this.getHeaders() });
  }

  // ── DISPATCH ─────────────────────────────────────────────
  getAllDispatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/dispatch`,
      { headers: this.getHeaders() });
  }

  assignDispatch(dispatch: any): Observable<any> {
    return this.http.post<any>(`${this.api}/dispatch`, dispatch,
      { headers: this.getHeaders() });
  }

  updateDispatchStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.api}/dispatch/${id}/status`, { status },
      { headers: this.getHeaders() });
  }

  // ── RESOURCES ────────────────────────────────────────────
  getAllResources(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/resources`,
      { headers: this.getHeaders() });
  }

  assignUnit(resourceId: number, incidentId: number): Observable<any> {
    return this.http.put<any>(
      `${this.api}/resources/${resourceId}/assign`,
      { incidentId },
      { headers: this.getHeaders() }
    );
  }

  // ── CRISIS ───────────────────────────────────────────────
  getAllCrises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/crisis`,
      { headers: this.getHeaders() });
  }

  createCrisis(crisis: any): Observable<any> {
    return this.http.post<any>(`${this.api}/crisis`, crisis,
      { headers: this.getHeaders() });
  }

  // ── PATROL ───────────────────────────────────────────────
  getAllPatrols(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/patrol`,
      { headers: this.getHeaders() });
  }

  createPatrol(patrol: any): Observable<any> {
    return this.http.post<any>(`${this.api}/patrol`, patrol,
      { headers: this.getHeaders() });
  }
}
