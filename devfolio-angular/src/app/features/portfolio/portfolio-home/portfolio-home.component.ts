import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { ProjectsService } from '../../../core/services/projects.service';
import { Project } from '../../../core/models';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  shortBio: string;
  profileImage: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  isAvailableForWork: boolean;
  yearsExperience?: number;
  currentRole?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Other';
}

@Component({
  selector: 'devfolio-portfolio-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './portfolio-home.component.html',
  styleUrl: './portfolio-home.component.scss'
})
export class PortfolioHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('heroSection', { static: false }) heroSection?: ElementRef;

  // Luc Joosten persoonlijke informatie
  readonly personalInfo: PersonalInfo = {
    firstName: 'Luc',
    lastName: 'Joosten',
    title: 'Full-Stack Developer',
    tagline: 'Recent afgestudeerd en klaar voor nieuwe uitdagingen',
    shortBio: 'Gepassioneerd over het bouwen van moderne web applicaties met Angular en .NET. Altijd op zoek naar nieuwe technologieën en best practices.',
    profileImage: './assets/images/profile-picture.jpg',
    location: 'Nederland',
    email: 'lhajoosten@outlook.com',
    github: 'https://github.com/lhajoosten',
    linkedin: 'https://linkedin.com/in/lhajoosten',
    isAvailableForWork: true,
    yearsExperience: 1,
    currentRole: 'Junior Developer'
  };

  // Featured projects van de API
  featuredProjects$: Observable<Project[]>;
  isLoading$ = new BehaviorSubject<boolean>(true);

  // Skills die je wilt highlighten
  readonly highlightedSkills: Skill[] = [
    { name: 'Angular', level: 5, category: 'Frontend' },
    { name: 'TypeScript', level: 5, category: 'Frontend' },
    { name: 'RxJS', level: 4, category: 'Frontend' },
    { name: 'Angular Material', level: 5, category: 'Frontend' },
    { name: 'SCSS/CSS', level: 5, category: 'Frontend' },
    { name: '.NET Core', level: 4, category: 'Backend' },
    { name: 'C#', level: 4, category: 'Backend' },
    { name: 'ASP.NET Web API', level: 4, category: 'Backend' },
    { name: 'Entity Framework', level: 4, category: 'Backend' },
    { name: 'PostgreSQL', level: 4, category: 'Database' },
    { name: 'SQL Server', level: 3, category: 'Database' },
    { name: 'Git & GitHub', level: 5, category: 'Tools' },
    { name: 'Azure DevOps', level: 3, category: 'Tools' },
    { name: 'Docker', level: 3, category: 'Tools' },
    { name: 'Jest/Jasmine', level: 4, category: 'Tools' }
  ];

  private currentTextIndex = 0;

  constructor(private projectsService: ProjectsService) {
    this.featuredProjects$ = this.projectsService.getFeaturedProjects().pipe(
      map(projects => projects.slice(0, 6)),
      startWith([]),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupScrollAnimations();
    this.startRotatingText();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.isLoading$.next(true);

    // Load featured projects for portfolio display
    this.projectsService.getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading$.next(false);
        },
        error: (error) => {
          console.error('Error loading projects:', error);
          this.isLoading$.next(false);
        }
      });
  }

  private setupScrollAnimations(): void {
    // Add intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Observe sections that should animate in
      const sections = document.querySelectorAll('.about-section, .projects-section, .contact-section');
      sections.forEach(section => observer.observe(section));
    }
  }

  private startRotatingText(): void {
    setInterval(() => {
      const elements = document.querySelectorAll('.role-item');
      if (elements.length > 0) {
        elements.forEach(el => el.classList.remove('active'));
        this.currentTextIndex = (this.currentTextIndex + 1) % elements.length;
        elements[this.currentTextIndex]?.classList.add('active');
      }
    }, 3000);
  }

  /**
   * Download CV functionality with analytics tracking
   */
  downloadCV(): void {
    try {
      // Track analytics event
      this.trackEvent('cv_download', 'engagement', 'CV Download');

      const link = document.createElement('a');
      link.href = '/assets/cv/luc-joosten-cv.pdf';
      link.download = 'CV-Luc-Joosten-Full-Stack-Developer.pdf';
      link.target = '_blank';

      // Ensure link is added to DOM for Firefox compatibility
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success feedback
      this.showNotification('CV download gestart!');
    } catch (error) {
      console.error('Error downloading CV:', error);
      this.showNotification('Er is een fout opgetreden bij het downloaden van de CV.');
    }
  }

  /**
   * Smooth scroll to contact section with offset for fixed header
   */
  scrollToContact(): void {
    this.smoothScrollTo('contact');
    this.trackEvent('navigation', 'scroll', 'Scroll to Contact');
  }

  /**
   * Smooth scroll to projects section
   */
  scrollToProjects(): void {
    this.smoothScrollTo('projects');
    this.trackEvent('navigation', 'scroll', 'Scroll to Projects');
  }

  /**
   * Scroll to the next section (about section)
   */
  scrollToNextSection(): void {
    this.smoothScrollTo('about');
  }

  /**
   * Navigate to external links with tracking
   */
  openExternalLink(url: string, linkType: string): void {
    this.trackEvent('external_link', 'click', linkType);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Get skills by category for template
   */
  getSkillsByCategory(category: string): Skill[] {
    return this.highlightedSkills.filter(skill => skill.category === category);
  }

  /**
   * Format skill level for accessibility
   */
  getSkillLevelText(level: number): string {
    const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];
    return levels[level - 1] || 'Unknown';
  }

  private smoothScrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  private trackEvent(action: string, category: string, label: string): void {
    // Analytics tracking - implement your preferred analytics service
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: 1
      });
    }

    // Alternative: send to your own analytics endpoint
    console.log(`Analytics: ${category} - ${action} - ${label}`);
  }

  private showNotification(message: string): void {
    // Implement your preferred notification system
    // For now, just console log
    console.log('Notification:', message);

    // Example with simple browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('DevFolio', {
        body: message,
        icon: '/assets/icons/icon-192x192.png'
      });
    }
  }
}
