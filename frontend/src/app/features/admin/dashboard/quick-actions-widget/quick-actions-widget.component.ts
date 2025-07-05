import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-quick-actions-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="quick-actions-widget">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>bolt</mat-icon>
          Quick Actions
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="actions-grid">
          <button
            *ngFor="let action of actions"
            mat-raised-button
            [color]="action.color || 'primary'"
            class="action-button"
            (click)="action.callback()">
            <mat-icon>{{ action.icon }}</mat-icon>
            <span>{{ action.label }}</span>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .quick-actions-widget {
      height: 100%;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1976d2;
        font-weight: 600;
      }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }

    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      height: 80px;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      mat-icon {
        font-size: 24px;
      }

      span {
        font-size: 12px;
        font-weight: 500;
        text-align: center;
      }
    }
  `]
})
export class QuickActionsWidgetComponent {
  @Input() actions: Array<{
    label: string;
    icon: string;
    callback: () => void;
    color?: 'primary' | 'accent' | 'warn';
  }> = [];
}
