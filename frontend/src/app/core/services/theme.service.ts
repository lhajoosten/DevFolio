import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'devfolio_theme';
  private themeSubject = new BehaviorSubject<Theme>('light');

  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.loadTheme();
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    const theme = savedTheme || this.getSystemTheme();
    this.setTheme(theme);
  }

  private getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    const html = document.documentElement;

    // Remove old theme classes
    body.classList.remove('light-theme', 'dark-theme');
    html.classList.remove('dark');

    // Add new theme classes
    body.classList.add(`${theme}-theme`);

    // Add Tailwind CSS dark mode class
    if (theme === 'dark') {
      html.classList.add('dark');
    }
  }
}
