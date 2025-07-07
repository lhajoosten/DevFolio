import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../../../../core/services/projects.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects-list.component.html',
})
export class ProjectsListComponent implements OnInit {
  projects: any[] = [];
  isLoading = true;

  constructor(
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Completed': return 'Afgerond';
      case 'InProgress': return 'Bezig';
      case 'Planned': return 'Gepland';
      case 'OnHold': return 'Gepauzeerd';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  deleteProject(projectId: number): void {
    if (confirm('Weet je zeker dat je dit project wilt verwijderen?')) {
      // TODO: Implement delete functionality
      console.log('Delete project:', projectId);
    }
  }
}
