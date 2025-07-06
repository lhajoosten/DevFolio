import { Component, OnInit, ViewChild }from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';
import { ElementRef, HostListener } from '@angular/core';
import { from } from 'rxjs';

interface NavigationItem {
  label: string;
  route: string;
  icon?: string;
  external?: boolean;
}

@Component({
  selector: 'devfolio-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;

  protected currentRoute = '';
  protected isScrolled = false;
  protected isMobileMenuOpen = false;

  protected navigationItems: NavigationItem[] = [
    { label: 'Home', route: '', icon: 'home_outlined' },
    { label: 'Projecten', route: 'projecten', icon: 'work_outline' },
    { label: 'Over Mij', route: 'over-mij', icon: 'person_outline' },
    { label: 'Contact', route: 'contact', icon: 'mail_outline' }
  ];

  protected socialLinks: NavigationItem[] = [
    {
      label: 'LinkedIn',
      route: 'https://linkedin.com/in/lhajoosten',
      icon: 'link',
      external: true
    },
    {
      label: 'GitHub',
      route: 'https://github.com/lhajoosten',
      icon: 'code',
      external: true
    },
    {
      label: 'Email',
      route: 'mailto:lhajoosten@outlook.com',
      icon: 'mail_outline',
      external: true
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Track route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url.substring(1); // Remove leading slash
      });

    // Set initial route
    this.currentRoute = this.router.url.substring(1);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 50;
  }

  protected isActiveRoute(route: string): boolean {
    if (route === '' && this.currentRoute === '') {
      return true;
    }
    return this.currentRoute === route;
  }

  protected navigateToRoute(route: string, external: boolean = false): void {
    if (external) {
      window.open(route, '_blank');
    } else {
      this.router.navigate([route]);
      this.isMobileMenuOpen = false;
    }
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
