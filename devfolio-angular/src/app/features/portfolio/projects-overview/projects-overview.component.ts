import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectsService } from '../../../core/services/projects.service';
import { Project, ProjectStatus } from '../../../core/models';

export interface ProjectFilter {
  searchTerm: string;
  status: ProjectStatus | 'all';
  technology: string;
}

@Component({
  selector: 'devfolio-projects-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './projects-overview.component.html',
  styleUrl: './projects-overview.component.scss'
})
export class ProjectsOverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Projects data
  allProjects$: Observable<Project[]>;
  filteredProjects$: Observable<Project[]>;
  isLoading$ = new BehaviorSubject<boolean>(true);

  // Filter state
  filter$ = new BehaviorSubject<ProjectFilter>({
    searchTerm: '',
    status: 'all',
    technology: ''
  });

  // Available filter options
  availableTechnologies: string[] = [];
  projectStatuses = [
    { value: 'all', label: 'Alle statussen' },
    { value: ProjectStatus.IN_PROGRESS, label: 'In ontwikkeling' },
    { value: ProjectStatus.COMPLETED, label: 'Voltooid' },
    { value: ProjectStatus.ON_HOLD, label: 'On hold' },
    { value: ProjectStatus.CANCELLED, label: 'Geannuleerd' }
  ];

  constructor(private projectsService: ProjectsService) {
    // Load all projects
    this.allProjects$ = this.projectsService.getProjects().pipe(
      takeUntil(this.destroy$)
    );

    // Setup filtered projects based on filter criteria
    this.filteredProjects$ = combineLatest([
      this.allProjects$,
      this.filter$.pipe(debounceTime(300), distinctUntilChanged())
    ]).pipe(
      map(([projects, filter]) => this.filterProjects(projects, filter)),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    this.loadProjects();
    this.extractAvailableTechnologies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProjects(): void {
    this.isLoading$.next(true);

    this.allProjects$.subscribe({
      next: () => {
        this.isLoading$.next(false);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading$.next(false);
      }
    });
  }

  private extractAvailableTechnologies(): void {
    this.allProjects$.subscribe(projects => {
      const techSet = new Set<string>();
      projects.forEach(project => {
        project.techStack?.forEach((tech: string) => techSet.add(tech));
      });
      this.availableTechnologies = Array.from(techSet).sort();
    });
  }

  private filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
    let filtered = [...projects];

    // Filter by search term
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.techStack?.some((tech: string) => tech.toLowerCase().includes(searchLower))
      );
    }

    // Filter by status
    if (filter.status !== 'all') {
      filtered = filtered.filter(project => project.status === filter.status);
    }

    // Filter by technology
    if (filter.technology) {
      filtered = filtered.filter(project =>
        project.techStack?.includes(filter.technology)
      );
    }

    return filtered;
  }

  onSearchChange(searchTerm: string): void {
    const currentFilter = this.filter$.value;
    this.filter$.next({ ...currentFilter, searchTerm });
  }

  onStatusChange(status: ProjectStatus | 'all'): void {
    const currentFilter = this.filter$.value;
    this.filter$.next({ ...currentFilter, status });
  }

  onTechnologyChange(technology: string): void {
    const currentFilter = this.filter$.value;
    this.filter$.next({ ...currentFilter, technology });
  }

  clearFilters(): void {
    this.filter$.next({
      searchTerm: '',
      status: 'all',
      technology: ''
    });
  }

  getStatusLabel(status: ProjectStatus): string {
    const statusMap: Record<ProjectStatus, string> = {
      [ProjectStatus.PLANNED]: 'Gepland',
      [ProjectStatus.IN_PROGRESS]: 'In ontwikkeling',
      [ProjectStatus.COMPLETED]: 'Voltooid',
      [ProjectStatus.ON_HOLD]: 'On hold',
      [ProjectStatus.CANCELLED]: 'Geannuleerd'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: ProjectStatus): string {
    const statusClasses: Record<ProjectStatus, string> = {
      [ProjectStatus.PLANNED]: 'status-planned',
      [ProjectStatus.IN_PROGRESS]: 'status-in-progress',
      [ProjectStatus.COMPLETED]: 'status-completed',
      [ProjectStatus.ON_HOLD]: 'status-on-hold',
      [ProjectStatus.CANCELLED]: 'status-cancelled'
    };
    return statusClasses[status] || '';
  }

  openProject(project: Project): void {
    if (project.demoUrl) {
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    }
  }

  openGithub(project: Project): void {
    if (project.repoUrl) {
      window.open(project.repoUrl, '_blank', 'noopener,noreferrer');
    }
  }

  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }
}
