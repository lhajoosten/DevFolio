import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Profiel</h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Beheer je profiel informatie
          </p>
        </div>
      </div>

      <div class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="text-center">
          <svg class="h-24 w-24 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Profiel Beheer</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Deze functie komt binnenkort beschikbaar. Hier kun je je persoonlijke informatie, bio, sociale media links en meer beheren.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent {}
