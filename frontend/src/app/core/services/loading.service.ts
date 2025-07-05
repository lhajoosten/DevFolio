import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({});
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Set loading state for a specific key
   */
  setLoading(key: string, loading: boolean): void {
    const currentState = this.loadingSubject.value;
    this.loadingSubject.next({
      ...currentState,
      [key]: loading
    });
  }

  /**
   * Get loading state for a specific key
   */
  isLoading(key: string): Observable<boolean> {
    return new Observable(observer => {
      this.loading$.subscribe(state => {
        observer.next(!!state[key]);
      });
    });
  }

  /**
   * Check if any loading is active
   */
  isAnyLoading(): Observable<boolean> {
    return new Observable(observer => {
      this.loading$.subscribe(state => {
        observer.next(Object.values(state).some(loading => loading));
      });
    });
  }

  /**
   * Clear all loading states
   */
  clearAll(): void {
    this.loadingSubject.next({});
  }

  /**
   * Start loading for a key
   */
  start(key: string): void {
    this.setLoading(key, true);
  }

  /**
   * Stop loading for a key
   */
  stop(key: string): void {
    this.setLoading(key, false);
  }
}
