import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <mat-icon *ngIf="icon" class="header-icon">{{ icon }}</mat-icon>
          <div>
            <h1 class="page-title">{{ title }}</h1>
            <p *ngIf="subtitle" class="page-subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <div class="actions-section" *ngIf="showActions">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>

      <div class="breadcrumb" *ngIf="breadcrumbs && breadcrumbs.length > 0">
        <span *ngFor="let crumb of breadcrumbs; let last = last">
          <a *ngIf="!last && crumb.link" [href]="crumb.link" class="breadcrumb-link">
            {{ crumb.label }}
          </a>
          <span *ngIf="!last && !crumb.link" class="breadcrumb-text">
            {{ crumb.label }}
          </span>
          <span *ngIf="last" class="breadcrumb-current">
            {{ crumb.label }}
          </span>
          <mat-icon *ngIf="!last" class="breadcrumb-separator">chevron_right</mat-icon>
        </span>
      </div>
    </div>
  `,
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() showActions: boolean = false;
  @Input() breadcrumbs?: { label: string; link?: string }[];
}
