import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { HttpHelperService } from './http-helper.service';
import { 
  Project, 
  CreateProjectDto, 
  UpdateProjectDto, 
  ApiResponse, 
  PaginatedResponse,
  ProjectStatus 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  private featuredProjectsSubject = new BehaviorSubject<Project[]>([]);
  public featuredProjects$ = this.featuredProjectsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private httpHelper: HttpHelperService
  ) {}

  /**
   * Get all projects (voor publieke portfolio)
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<ApiResponse<Project[]>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.LIST}`
    ).pipe(
      map(response => response.data),
      tap(projects => {
        this.projectsSubject.next(projects);
        // Filter featured projects
        const featured = projects.filter(p => p.isHighlighted);
        this.featuredProjectsSubject.next(featured);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get paginated projects (voor admin dashboard)
   */
  getProjectsPaginated(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Project>> {
    return this.http.get<PaginatedResponse<Project>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.LIST}?page=${page}&pageSize=${pageSize}`,
      { headers: this.httpHelper.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get single project
   */
  getProject(id: number): Observable<Project> {
    return this.http.get<ApiResponse<Project>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.GET(id)}`
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Create new project (Admin only)
   */
  createProject(projectData: CreateProjectDto): Observable<Project> {
    return this.http.post<ApiResponse<Project>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.CREATE}`,
      projectData,
      { headers: this.httpHelper.getAuthHeaders() }
    ).pipe(
      map(response => response.data),
      tap(() => {
        // Refresh projects list
        this.getProjects().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update existing project (Admin only)
   */
  updateProject(projectData: UpdateProjectDto): Observable<Project> {
    return this.http.put<ApiResponse<Project>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.UPDATE(projectData.id)}`,
      projectData,
      { headers: this.httpHelper.getAuthHeaders() }
    ).pipe(
      map(response => response.data),
      tap(() => {
        // Refresh projects list
        this.getProjects().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Delete project (Admin only)
   */
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.DELETE(id)}`,
      { headers: this.httpHelper.getAuthHeaders() }
    ).pipe(
      tap(() => {
        // Refresh projects list
        this.getProjects().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get projects by status
   */
  getProjectsByStatus(status: ProjectStatus): Observable<Project[]> {
    return this.projects$.pipe(
      map(projects => projects.filter(p => p.status === status))
    );
  }

  /**
   * Get featured projects (highlighted for portfolio)
   */
  getFeaturedProjects(): Observable<Project[]> {
    return this.featuredProjects$;
  }

  /**
   * Search projects by title or tech stack
   */
  searchProjects(query: string): Observable<Project[]> {
    return this.projects$.pipe(
      map(projects => projects.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.techStack.some(tech => tech.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }

  /**
   * Get project statistics for dashboard
   */
  getProjectStats(): Observable<{
    total: number;
    completed: number;
    inProgress: number;
    planned: number;
  }> {
    return this.projects$.pipe(
      map(projects => ({
        total: projects.length,
        completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
        inProgress: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
        planned: projects.filter(p => p.status === ProjectStatus.PLANNED).length
      }))
    );
  }

  /**
   * Get unique technologies from all projects
   */
  getUniqueTechnologies(): Observable<string[]> {
    return this.projects$.pipe(
      map(projects => {
        const allTech = projects.flatMap(p => p.techStack);
        return [...new Set(allTech)].sort();
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Projects Service Error:', error);
    throw error;
  }
}
