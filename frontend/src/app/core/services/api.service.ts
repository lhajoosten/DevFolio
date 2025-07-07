import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Project } from '../models/core.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private readonly BASE_URL = 'https://localhost:7058/api/v1';

  // Legacy constructors removed; using inject() only

  // Generic GET method
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.BASE_URL}${endpoint}`, { params });
  }

  // Generic POST method
  post<T, D = unknown>(endpoint: string, data: D): Observable<T> {
    return this.http.post<T>(`${this.BASE_URL}${endpoint}`, data);
  }

  // Generic PUT method
  put<T, D = unknown>(endpoint: string, data: D): Observable<T> {
    return this.http.put<T>(`${this.BASE_URL}${endpoint}`, data);
  }

  // Generic DELETE method
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.BASE_URL}${endpoint}`);
  }

  // Project specific methods
  getProjects(): Observable<ApiResponse<Project[]>> {
    return this.get<ApiResponse<Project[]>>('/projects');
  }

  getProject(id: number): Observable<ApiResponse<Project>> {
    return this.get<ApiResponse<Project>>(`/projects/${id}`);
  }

  createProject(project: Partial<Project>): Observable<ApiResponse<number>> {
    return this.post<ApiResponse<number>>('/projects', project);
  }

  updateProject(
    id: number,
    project: Partial<Project>,
  ): Observable<ApiResponse<void>> {
    return this.put<ApiResponse<void>>(`/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`/projects/${id}`);
  }

  // Public endpoints (voor portfolio weergave)
  getPublicProjects(): Observable<ApiResponse<Project[]>> {
    return this.get<ApiResponse<Project[]>>('/projects/public');
  }
}
