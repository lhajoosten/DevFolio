import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../../../core/services/projects.service';
import { AuthService } from '../../../core/services/auth.service';
import { Project, ProjectStatus } from '../../../core';

interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  plannedProjects: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private authService = inject(AuthService);

  protected stats: DashboardStats = {
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    plannedProjects: 0,
  };

  protected recentProjects: Project[] = [];
  protected isLoading = true;

  public ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load projects to calculate stats
    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        // Calculate stats
        this.stats.totalProjects = projects.length;
        this.stats.completedProjects = projects.filter(
          (p: Project) => p.status === ProjectStatus.Completed,
        ).length;
        this.stats.inProgressProjects = projects.filter(
          (p: Project) => p.status === ProjectStatus.InProgress,
        ).length;
        this.stats.plannedProjects = projects.filter(
          (p: Project) => p.status === ProjectStatus.Planned,
        ).length;

        // Get recent projects (latest 5) - use startDate since we don't have updatedAt
        this.recentProjects = projects
          .sort(
            (a: Project, b: Project) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
          )
          .slice(0, 5);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      },
    });
  }

  protected getStatusLabel(status: string): string {
    switch (status) {
      case 'Completed':
        return 'Afgerond';
      case 'InProgress':
        return 'Bezig';
      case 'Planned':
        return 'Gepland';
      case 'OnHold':
        return 'Gepauzeerd';
      default:
        return status;
    }
  }

  protected formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
