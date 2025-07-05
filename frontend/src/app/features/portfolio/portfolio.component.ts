import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntil } from 'rxjs/operators';
import { Project, ProjectStatus } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { LoadingService } from '../../core/services/loading.service';
import { BaseComponent } from '../../core/base/base.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    SharedModule
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent extends BaseComponent implements OnInit {
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedCategory = 'all';
  categories: string[] = ['all'];

  constructor(
    private projectService: ProjectService,
    private loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadProjects();
    this.observeLoading();
  }

  private observeLoading(): void {
    this.loadingService.isLoading('projects-list')
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);
  }

  loadProjects(): void {
    this.setLoading(true);

    // Get all published projects
    this.projectService.getProjects({
      pageNumber: 1,
      pageSize: 100  // Get all projects for portfolio
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('Portfolio projects response:', response);

        // Extract projects using service helper
        const projects = this.projectService.extractProjects(response);

        // Filter only completed projects for portfolio
        this.allProjects = projects.filter(p =>
          p.status === ProjectStatus.Completed || p.isCompleted
        ) || [];
        this.filteredProjects = [...this.allProjects];

        // Extract categories from tech stack
        this.extractCategories();

        this.clearStates();
      },
      error: (error) => {
        this.handleError(error, 'Failed to load projects');
        this.allProjects = [];
        this.filteredProjects = [];
      }
    });
  }

  private extractCategories(): void {
    const categorySet = new Set<string>(['all']);

    if (this.allProjects && Array.isArray(this.allProjects)) {
      this.allProjects.forEach(project => {
        // Use tech stack as categories
        if (project.techStack && Array.isArray(project.techStack)) {
          project.techStack.forEach(tech => {
            categorySet.add(tech);
          });
        }
      });
    }

    this.categories = Array.from(categorySet);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (!this.allProjects) {
      this.filteredProjects = [];
      return;
    }

    if (category === 'all') {
      this.filteredProjects = [...this.allProjects];
    } else {
      this.filteredProjects = this.allProjects.filter(project =>
        project.techStack && project.techStack.includes(category)
      );
    }
  }

  openProject(project: Project): void {
    // For now, just open the repository URL
    if (project.repoUrl) {
      window.open(project.repoUrl, '_blank');
    }
  }

  openSource(project: Project): void {
    if (project.repoUrl) {
      window.open(project.repoUrl, '_blank');
    }
  }
}
