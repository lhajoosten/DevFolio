import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectStatus,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);

  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  // Legacy constructors removed; using inject() only

  /**
   * Get all projects
   */
  getProjects(): Observable<Project[]> {
    return this.http
      .get<
        Project[]
      >(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.LIST}`)
      .pipe(
        tap((projects) => this.projectsSubject.next(projects)),
        catchError(this.handleError),
      );
  }

  /**
   * Get single project
   */
  getProject(id: number): Observable<Project> {
    return this.http
      .get<Project>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.GET(id)}`,
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new project (Admin only)
   */
  createProject(projectData: CreateProjectDto): Observable<number> {
    return this.http
      .post<number>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.CREATE}`,
        projectData,
      )
      .pipe(
        tap(() => {
          // Refresh projects list
          this.getProjects().subscribe();
        }),
        catchError(this.handleError),
      );
  }

  /**
   * Update existing project (Admin only)
   */
  updateProject(projectData: UpdateProjectDto): Observable<void> {
    return this.http
      .put<void>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.UPDATE(projectData.id)}`,
        projectData,
      )
      .pipe(
        tap(() => {
          // Refresh projects list
          this.getProjects().subscribe();
        }),
        catchError(this.handleError),
      );
  }

  /**
   * Delete project (Admin only)
   */
  deleteProject(id: number): Observable<void> {
    return this.http
      .delete<void>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS.DELETE(id)}`,
      )
      .pipe(
        tap(() => {
          // Refresh projects list
          this.getProjects().subscribe();
        }),
        catchError(this.handleError),
      );
  }

  /**
   * Get projects by status
   */
  getProjectsByStatus(status: ProjectStatus): Observable<Project[]> {
    return this.projects$.pipe(
      map((projects) => projects.filter((p) => p.status === status)),
    );
  }

  /**
   * Search projects by title or tech stack
   */
  searchProjects(query: string): Observable<Project[]> {
    return this.projects$.pipe(
      map((projects) =>
        projects.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.techStack.some((tech) =>
              tech.toLowerCase().includes(query.toLowerCase()),
            ),
        ),
      ),
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
      map((projects) => ({
        total: projects.length,
        completed: projects.filter((p) => p.status === ProjectStatus.Completed)
          .length,
        inProgress: projects.filter(
          (p) => p.status === ProjectStatus.InProgress,
        ).length,
        planned: projects.filter((p) => p.status === ProjectStatus.Planned)
          .length,
      })),
    );
  }

  /**
   * Get unique technologies from all projects
   */
  getUniqueTechnologies(): Observable<string[]> {
    return this.projects$.pipe(
      map((projects) => {
        const allTech = projects.flatMap((p) => p.techStack);
        return [...new Set(allTech)].sort();
      }),
    );
  }

  private handleError(error: unknown): Observable<never> {
    console.error('Projects Service Error:', error);
    throw error;
  }
}
