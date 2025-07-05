import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

export interface ActivityItem {
  id: string;
  type: 'created' | 'updated' | 'deleted' | 'completed';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

@Component({
  selector: 'app-recent-activity-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './recent-activity-widget.component.html',
  styleUrls: ['./recent-activity-widget.component.css']
})
export class RecentActivityWidgetComponent {
  @Input() activities: ActivityItem[] = [];
  @Output() refresh = new EventEmitter<void>();
  @Output() viewAll = new EventEmitter<void>();

  getActivityIcon(type: string): string {
    switch (type) {
      case 'created': return 'add_circle';
      case 'updated': return 'edit';
      case 'deleted': return 'delete';
      case 'completed': return 'check_circle';
      default: return 'info';
    }
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
}
