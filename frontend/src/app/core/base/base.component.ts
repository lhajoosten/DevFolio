import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Base component class that provides common functionality for all components
 */
@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();

  loading = false;
  error: string | null = null;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Set loading state and clear errors
   */
  protected setLoading(loading: boolean): void {
    this.loading = loading;
    if (loading) {
      this.error = null;
    }
  }

  /**
   * Set error state and clear loading
   */
  protected setError(error: string): void {
    this.error = error;
    this.loading = false;
  }

  /**
   * Clear both loading and error states
   */
  protected clearStates(): void {
    this.loading = false;
    this.error = null;
  }

  /**
   * Handle common error scenarios
   */
  protected handleError(error: any, customMessage?: string): void {
    console.error('Component error:', error);

    let errorMessage = customMessage || 'An unexpected error occurred';

    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    this.setError(errorMessage);
  }
}
