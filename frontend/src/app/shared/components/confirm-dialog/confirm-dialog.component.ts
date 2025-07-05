import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon [class]="'icon-' + data.type">
          @switch (data.type) {
            @case ('warning') { warning }
            @case ('danger') { error }
            @default { info }
          }
        </mat-icon>
        {{ data.title }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button
          mat-raised-button
          [color]="data.type === 'danger' ? 'warn' : 'primary'"
          (click)="onConfirm()">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 400px;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0;
    }

    .icon-warning {
      color: #ff9800;
    }

    .icon-danger {
      color: #f44336;
    }

    .icon-info {
      color: #2196f3;
    }

    .dialog-content {
      margin: 16px 0;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
