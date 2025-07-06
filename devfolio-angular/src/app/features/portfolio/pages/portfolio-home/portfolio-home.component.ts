import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { ProjectsService } from '../../../../core/services/projects.service';
import { Project } from '../../../../core/models';
import { FilterByNamePipe } from '../../../../core/pipes/filter-by-name.pipe';

@Component({
  selector: 'devfolio-portfolio-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    FilterByNamePipe
  ],
  templateUrl: './portfolio-home.component.html',
  styleUrl: './portfolio-home.component.scss'
})
export class PortfolioHomeComponent implements OnInit {

  // Luc Joosten persoonlijke informatie
  personalInfo = {
    firstName: 'Luc',
    lastName: 'Joosten',
    title: 'Full-Stack Developer',
    tagline: 'Recent afgestudeerd en klaar voor nieuwe uitdagingen',
    shortBio: 'Gepassioneerd over het bouwen van moderne web applicaties met Angular en .NET. Altijd op zoek naar nieuwe technologieën en best practices.',
    profileImage: '/assets/images/profile-pic.jpg',
    location: 'Nederland',
    email: 'lhajoosten@outlook.com',
    github: 'https://github.com/lhajoosten',
    linkedin: 'https://linkedin.com/in/lhajoosten',
    isAvailableForWork: true
  };

  // Featured projects van de API
  featuredProjects$: Observable<Project[]>;

  // Skills die je wilt highlighten
  highlightedSkills = [
    { name: 'Angular', level: 5, category: 'Frontend' },
    { name: 'TypeScript', level: 5, category: 'Frontend' },
    { name: '.NET', level: 4, category: 'Backend' },
    { name: 'C#', level: 4, category: 'Backend' },
    { name: 'PostgreSQL', level: 4, category: 'Database' },
    { name: 'Git', level: 5, category: 'Tools' }
  ];

  constructor(private projectsService: ProjectsService) {
    this.featuredProjects$ = this.projectsService.getFeaturedProjects();
  }

  ngOnInit(): void {
    // Load featured projects for portfolio display
    this.projectsService.getProjects().subscribe();
  }

  /**
   * Download CV functionality
   */
  downloadCV(): void {
    const link = document.createElement('a');
    link.href = '/assets/cv/luc-joosten-cv.pdf';
    link.download = 'CV-Luc-Joosten.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Navigate to contact section
   */
  scrollToContact(): void {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Navigate to projects section
   */
  scrollToProjects(): void {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
