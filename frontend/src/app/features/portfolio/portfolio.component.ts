import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
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
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
    MatToolbarModule,
    SharedModule
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class PortfolioComponent extends BaseComponent implements OnInit {
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedCategory = 'all';
  categories: string[] = ['all'];
  isScrolled = false;
  selectedTabIndex = 0;
  override loading = false;
  override error: string | null = null;

  // Portfolio owner information
  portfolioOwner = {
    name: 'devfolio Developer',
    title: 'Full Stack Developer & Portfolio Architect',
    bio: 'Passionate about creating innovative digital solutions and beautiful user experiences.',
    location: 'Remote',
    email: 'contact@devfolio.dev',
    skills: ['Angular', 'TypeScript', 'C#', '.NET', 'Node.js', 'PostgreSQL', 'Docker', 'Azure']
  };

  constructor(
    private projectService: ProjectService,
    private loadingService: LoadingService
  ) {
    super();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 100;
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

  getCompletedProjectsCount(): number {
    return this.allProjects.filter(p => p.status === ProjectStatus.Completed).length;
  }

  getSkillCategories() {
    return [
      {
        name: 'Frontend',
        skills: ['Angular', 'React', 'TypeScript', 'JavaScript', 'CSS', 'HTML']
      },
      {
        name: 'Backend',
        skills: ['C#', '.NET', 'Node.js', 'Python', 'SQL Server']
      },
      {
        name: 'Tools & Others',
        skills: ['Git', 'Azure', 'Docker', 'Visual Studio', 'VS Code']
      }
    ];
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
    if (event.index === 0) {
      this.filterByCategory('all');
    } else {
      const categories = this.getUniqueCategories();
      this.filterByCategory(categories[event.index - 1]);
    }
  }

  getStatusText(status: ProjectStatus): string {
    return this.getStatusLabel(status);
  }

  openProject(project: Project): void {
    // Implementation for opening project details
    console.log('Opening project:', project.title);
  }

  openSource(project: Project): void {
    if (project.repoUrl) {
      window.open(project.repoUrl, '_blank');
    }
  }

  getStatusClass(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Completed:
        return 'completed';
      case ProjectStatus.InProgress:
        return 'in-progress';
      case ProjectStatus.OnHold:
        return 'on-hold';
      default:
        return '';
    }
  }

  getStatusIcon(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Completed:
        return 'check_circle';
      case ProjectStatus.InProgress:
        return 'update';
      case ProjectStatus.OnHold:
        return 'pause_circle';
      default:
        return 'help';
    }
  }

  getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Completed:
        return 'Completed';
      case ProjectStatus.InProgress:
        return 'In Progress';
      case ProjectStatus.OnHold:
        return 'On Hold';
      default:
        return 'Unknown';
    }
  }

  getCategoryCount(category: string): number {
    if (category === 'all') {
      return this.allProjects.length;
    }
    return this.allProjects.filter(project =>
      project.techStack && project.techStack.includes(category)
    ).length;
  }

  scrollToProjects(): void {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  shareProject(project: Project): void {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${project.title}: ${project.description}`);
    }
  }

  openSocialLink(platform: string): void {
    const links = {
      github: 'https://github.com/lhajoosten',
      linkedin: 'https://linkedin.com/in/lhajoosten',
      twitter: 'https://twitter.com/lhajoosten'
    };
    window.open(links[platform as keyof typeof links], '_blank');
  }

  sendEmail(): void {
    window.location.href = `mailto:${this.portfolioOwner.email}`;
  }

  refreshData(): void {
    this.error = null;
    this.loadProjects();
  }

  getUniqueCategories(): string[] {
    const categories = new Set<string>();
    this.allProjects.forEach(project => {
      project.techStack?.forEach(tech => categories.add(tech.toLowerCase()));
    });
    return Array.from(categories);
  }
}
