import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project, CreateProjectRequest, UpdateProjectRequest, ProjectStatus } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatChipsModule,
    RouterModule,
    LoadingSpinnerComponent,
    PageHeaderComponent
  ],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.scss'
})
export class AdminProjectsComponent implements OnInit {
  projects: Project[] = [];
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = true;
  error: string | null = null;

  displayedColumns: string[] = ['title', 'description', 'status', 'createdAt', 'actions'];

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;

    const params = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize
    };

    this.projectService.getProjects(params).subscribe({
      next: (response) => {
        console.log('Projects response:', response);

        // Handle different response formats
        if (response && Array.isArray(response)) {
          this.projects = response;
          this.totalCount = response.length;
        } else if (response && response.items && Array.isArray(response.items)) {
          this.projects = response.items;
          this.totalCount = response.totalCount || response.items.length;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.projects = response.data;
          this.totalCount = response.totalCount || response.data.length;
        } else {
          this.projects = [];
          this.totalCount = 0;
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.error = 'Failed to load projects';
        this.projects = [];
        this.totalCount = 0;
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProjects();
  }

  openCreateProjectDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Create Project',
        message: 'Are you sure you want to create a new project?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User confirmed, proceed with project creation
      }
    });
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.error = 'Failed to delete project';
        }
      });
    }
  }

  refreshProjects(): void {
    this.loadProjects();
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'status-active';
      case 'draft':
        return 'status-pending';
      case 'archived':
        return 'status-inactive';
      default:
        return '';
    }
  }
}
