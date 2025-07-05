import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig extends MatSnackBarConfig {
  type?: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show success notification
   */
  success(message: string, config?: NotificationConfig): void {
    this.show(message, { ...config, panelClass: ['success-snackbar'] });
  }

  /**
   * Show error notification
   */
  error(message: string, config?: NotificationConfig): void {
    this.show(message, {
      ...config,
      panelClass: ['error-snackbar'],
      duration: config?.duration || 6000 // Longer duration for errors
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, config?: NotificationConfig): void {
    this.show(message, { ...config, panelClass: ['warning-snackbar'] });
  }

  /**
   * Show info notification
   */
  info(message: string, config?: NotificationConfig): void {
    this.show(message, { ...config, panelClass: ['info-snackbar'] });
  }

  /**
   * Show notification with custom config
   */
  show(message: string, config?: NotificationConfig): void {
    const finalConfig = { ...this.defaultConfig, ...config };
    this.snackBar.open(message, 'Close', finalConfig);
  }

  /**
   * Dismiss all notifications
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
