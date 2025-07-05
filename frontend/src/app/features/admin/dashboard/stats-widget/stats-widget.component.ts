import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface StatItem {
  label: string;
  value: number | string;
  icon: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  color?: 'primary' | 'accent' | 'warn' | 'success';
  action?: {
    label: string;
    callback: () => void;
  };
}

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './stats-widget.component.html',
  styleUrls: ['./stats-widget.component.scss'],
})
export class StatsWidgetComponent {
  @Input() label: string = '';
  @Input() value: number | string = 0;
  @Input() icon: string = 'analytics';
  @Input() trend?: StatItem['trend'];
  @Input() color?: StatItem['color'] = 'primary';
  @Input() action?: StatItem['action'];

  getTrendIcon(): string {
    if (!this.trend) return '';

    switch (this.trend.direction) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }
}
