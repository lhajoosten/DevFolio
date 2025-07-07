import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface FooterLink {
  label: string;
  url: string;
  external?: boolean;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected currentYear = new Date().getFullYear();

  protected quickLinks: FooterLink[] = [
    { label: 'Home', url: '' },
    { label: 'Projecten', url: 'projecten' },
    { label: 'Over Mij', url: 'over-mij' },
    { label: 'Contact', url: 'contact' },
  ];

  protected legalLinks: FooterLink[] = [
    { label: 'Privacy Beleid', url: '/privacy', external: false },
    { label: 'Algemene Voorwaarden', url: '/terms', external: false },
  ];

  protected socialLinks: SocialLink[] = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/lhajoosten',
      icon: 'link',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/lhajoosten',
      icon: 'code',
    },
    {
      name: 'Email',
      url: 'mailto:lhajoosten@outlook.com',
      icon: 'email',
    },
  ];

  protected navigateToLink(url: string, external: boolean = false): void {
    if (external) {
      window.open(url, '_blank', 'noopener noreferrer');
    } else {
      window.location.href = url;
    }
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
