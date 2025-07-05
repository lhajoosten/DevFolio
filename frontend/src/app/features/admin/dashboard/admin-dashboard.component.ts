import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectService } from '../../../core/services/project.service';
import { LoadingService } from '../../../core/services/loading.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SharedModule } from '../../../shared/shared.module';
import { Project, ProjectStatus } from '../../../core/models/project.model';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent extends BaseComponent implements OnInit {
  projects: Project[] = [];
  totalProjects = 0;
  dashboardStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    onHold: 0
  };

  displayedColumns: string[] = ['title', 'status', 'createdAt', 'actions'];

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.observeLoading();
  }

  private observeLoading(): void {
    this.loadingService.isLoading('projects-list')
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);
  }

  private loadDashboardData(): void {
    this.setLoading(true);

    // Get recent projects
    this.projectService.getProjects({ pageNumber: 1, pageSize: 5 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Dashboard projects response:', response);

          // Extract projects using service helper
          this.projects = this.projectService.extractProjects(response);

          // Extract pagination info
          const paginationInfo = this.projectService.extractPaginationInfo(response);
          this.totalProjects = paginationInfo.totalCount;

          // Calculate stats
          this.calculateStats();

          this.clearStates();
        },
        error: (error) => {
          this.handleError(error, 'Failed to load dashboard data');
          this.projects = [];
          this.totalProjects = 0;
        }
      });
  }

  private calculateStats(): void {
    this.dashboardStats = {
      total: this.totalProjects,
      completed: this.projects.filter(p => p.status === ProjectStatus.Completed).length,
      inProgress: this.projects.filter(p => p.status === ProjectStatus.InProgress).length,
      onHold: this.projects.filter(p => p.status === ProjectStatus.OnHold).length
    };
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getStatusColor(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Completed:
        return 'status-active';
      case ProjectStatus.InProgress:
        return 'status-pending';
      case ProjectStatus.OnHold:
        return 'status-warning';
      case ProjectStatus.Cancelled:
        return 'status-inactive';
      default:
        return 'status-pending';
    }
  }

  getStatusText(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Planning:
        return 'Planning';
      case ProjectStatus.InProgress:
        return 'In Progress';
      case ProjectStatus.Completed:
        return 'Completed';
      case ProjectStatus.OnHold:
        return 'On Hold';
      case ProjectStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
}
