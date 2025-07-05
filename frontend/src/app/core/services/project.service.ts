import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest
} from '../models/project.model';
import {
  PaginatedResponse,
  QueryParameters,
  ApiError
} from '../models/api.model';
import { environment } from '../../../environments/environment';
import { ResponseHandlerService } from './response-handler.service';
import { LoadingService } from './loading.service';

export interface GetProjectsParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
}

export interface ApiResponse<T> {
  data?: T;
  items?: T;
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  success?: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(
    private http: HttpClient,
    private responseHandler: ResponseHandlerService,
    private loadingService: LoadingService
  ) {}

  getProjects(params?: GetProjectsParams): Observable<Project[] | ApiResponse<Project[]>> {
    const loadingKey = 'projects-list';
    this.loadingService.start(loadingKey);

    let httpParams = new HttpParams();

    if (params) {
      if (params.pageNumber) {
        httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      }
      if (params.pageSize) {
        httpParams = httpParams.set('pageSize', params.pageSize.toString());
      }
      if (params.search) {
        httpParams = httpParams.set('search', params.search);
      }
      if (params.category) {
        httpParams = httpParams.set('category', params.category);
      }
      if (params.status) {
        httpParams = httpParams.set('status', params.status);
      }
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(response => {
        console.log('Raw API response:', response);
        return response;
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingService.stop(loadingKey))
    );
  }

  getProject(id: string): Observable<Project> {
    const loadingKey = `project-${id}`;
    this.loadingService.start(loadingKey);

    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingService.stop(loadingKey))
    );
  }

  createProject(project: Partial<Project>): Observable<Project> {
    const loadingKey = 'project-create';
    this.loadingService.start(loadingKey);

    return this.http.post<Project>(this.apiUrl, project).pipe(
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingService.stop(loadingKey))
    );
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    const loadingKey = `project-update-${id}`;
    this.loadingService.start(loadingKey);

    return this.http.put<Project>(`${this.apiUrl}/${id}`, project).pipe(
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingService.stop(loadingKey))
    );
  }

  deleteProject(id: number): Observable<void> {
    const loadingKey = `project-delete-${id}`;
    this.loadingService.start(loadingKey);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingService.stop(loadingKey))
    );
  }

  private handleError(error: any): Observable<never> {
    const errorMessage = this.responseHandler.extractErrorMessage(error, 'An error occurred while processing your request');

    const apiError: ApiError = {
      error: errorMessage,
      statusCode: error.status || 500
    };

    console.error('ProjectService error:', error);
    return throwError(() => apiError);
  }

  /**
   * Extract projects array from API response
   */
  extractProjects(response: any): Project[] {
    return this.responseHandler.extractArrayData<Project>(response);
  }

  /**
   * Extract pagination info from API response
   */
  extractPaginationInfo(response: any) {
    return this.responseHandler.extractPaginationInfo(response);
  }
}
