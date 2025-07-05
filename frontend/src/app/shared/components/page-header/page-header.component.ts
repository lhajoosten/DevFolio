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
  styles: [`
    .page-header {
      padding: 24px 0;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #666;
    }

    .page-title {
      margin: 0;
      font-size: 28px;
      font-weight: 500;
      color: #333;
    }

    .page-subtitle {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .actions-section {
      display: flex;
      gap: 8px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }

    .breadcrumb-link {
      color: #1976d2;
      text-decoration: none;
    }

    .breadcrumb-link:hover {
      text-decoration: underline;
    }

    .breadcrumb-text,
    .breadcrumb-current {
      color: #666;
    }

    .breadcrumb-current {
      font-weight: 500;
    }

    .breadcrumb-separator {
      font-size: 16px;
      color: #999;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() showActions: boolean = false;
  @Input() breadcrumbs?: { label: string; link?: string }[];
}
