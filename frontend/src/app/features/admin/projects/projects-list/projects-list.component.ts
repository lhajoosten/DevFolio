import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../../../core/services/projects.service';
import { Project, ProjectStatus } from '../../../../core/models';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './projects-list.component.html',
})
export class ProjectsListComponent implements OnInit {
  private projectsService = inject(ProjectsService);

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading = true;
  searchQuery = '';
  selectedStatus: ProjectStatus | '' = '';

  // Expose ProjectStatus enum for template
  readonly ProjectStatus = ProjectStatus;

  constructor() {}

  public ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectsService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.filteredProjects = projects;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
      },
    });
  }

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.applyFilters();
  }

  protected onStatusFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus = select.value as ProjectStatus | '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.projects;

    // Apply search filter
    if (this.searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          project.techStack.some((tech) =>
            tech.toLowerCase().includes(this.searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(
        (project) => project.status === this.selectedStatus,
      );
    }

    this.filteredProjects = filtered;
  }

  protected deleteProject(project: Project): void {
    if (confirm(`Weet je zeker dat je "${project.title}" wilt verwijderen?`)) {
      this.projectsService.deleteProject(project.id).subscribe({
        next: () => {
          this.loadProjects(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          alert(
            'Er is een fout opgetreden bij het verwijderen van het project.',
          );
        },
      });
    }
  }

  protected getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Completed:
        return 'Afgerond';
      case ProjectStatus.InProgress:
        return 'Bezig';
      case ProjectStatus.Planned:
        return 'Gepland';
      case ProjectStatus.OnHold:
        return 'Gepauzeerd';
      default:
        return status;
    }
  }

  protected getStatusClass(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Completed:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ProjectStatus.InProgress:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case ProjectStatus.Planned:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ProjectStatus.OnHold:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
