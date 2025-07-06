import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          {{ isEditMode ? 'Project Bewerken' : 'Nieuw Project' }}
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {{ isEditMode ? 'Pas de projectgegevens aan' : 'Voeg een nieuw project toe aan je portfolio' }}
        </p>
      </div>

      <!-- Form -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="space-y-6 p-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Titel *
              </label>
              <input
                type="text"
                id="title"
                formControlName="title"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Projecttitel"
              />
              <div *ngIf="projectForm.get('title')?.invalid && projectForm.get('title')?.touched" class="text-red-500 text-sm mt-1">
                Titel is verplicht
              </div>
            </div>

            <div class="sm:col-span-2">
              <label for="shortDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Korte Beschrijving *
              </label>
              <input
                type="text"
                id="shortDescription"
                formControlName="shortDescription"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Een korte beschrijving van het project"
              />
              <div *ngIf="projectForm.get('shortDescription')?.invalid && projectForm.get('shortDescription')?.touched" class="text-red-500 text-sm mt-1">
                Korte beschrijving is verplicht
              </div>
            </div>

            <div class="sm:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Uitgebreide Beschrijving *
              </label>
              <textarea
                id="description"
                rows="4"
                formControlName="description"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Uitgebreide beschrijving van het project"
              ></textarea>
              <div *ngIf="projectForm.get('description')?.invalid && projectForm.get('description')?.touched" class="text-red-500 text-sm mt-1">
                Beschrijving is verplicht
              </div>
            </div>
          </div>

          <!-- URLs -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="repoUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Repository URL *
              </label>
              <input
                type="url"
                id="repoUrl"
                formControlName="repoUrl"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://github.com/username/repository"
              />
              <div *ngIf="projectForm.get('repoUrl')?.invalid && projectForm.get('repoUrl')?.touched" class="text-red-500 text-sm mt-1">
                <span *ngIf="projectForm.get('repoUrl')?.errors?.['required']">Repository URL is verplicht</span>
                <span *ngIf="projectForm.get('repoUrl')?.errors?.['url']">Voer een geldige URL in</span>
              </div>
            </div>

            <div>
              <label for="demoUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Demo URL
              </label>
              <input
                type="url"
                id="demoUrl"
                formControlName="demoUrl"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://demo.example.com"
              />
              <div *ngIf="projectForm.get('demoUrl')?.invalid && projectForm.get('demoUrl')?.touched" class="text-red-500 text-sm mt-1">
                Voer een geldige URL in
              </div>
            </div>
          </div>

          <!-- Tech Stack -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tech Stack *
            </label>
            <div formArrayName="techStack" class="space-y-2">
              <div *ngFor="let tech of techStackArray.controls; let i = index" class="flex items-center space-x-2">
                <input
                  type="text"
                  [formControlName]="i"
                  class="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Technologie (bv. Angular, TypeScript)"
                />
                <button
                  type="button"
                  (click)="removeTech(i)"
                  class="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="button"
              (click)="addTech()"
              class="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Technologie Toevoegen
            </button>
          </div>

          <!-- Status and Settings -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status *
              </label>
              <select
                id="status"
                formControlName="status"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Planned">Gepland</option>
                <option value="InProgress">In Uitvoering</option>
                <option value="Completed">Afgerond</option>
                <option value="OnHold">Gepauzeerd</option>
              </select>
            </div>

            <div class="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                formControlName="isPublic"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label for="isPublic" class="ml-2 block text-sm text-gray-900 dark:text-white">
                Publiek zichtbaar
              </label>
            </div>

            <div>
              <label for="sortOrder" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Volgorde
              </label>
              <input
                type="number"
                id="sortOrder"
                formControlName="sortOrder"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900 p-4">
            <div class="text-sm text-red-700 dark:text-red-200">
              {{ errorMessage }}
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              (click)="cancel()"
              class="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuleren
            </button>
            <button
              type="submit"
              [disabled]="projectForm.invalid || isLoading"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="mr-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Opslaan...' : (isEditMode ? 'Bijwerken' : 'Aanmaken') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  projectId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      description: ['', [Validators.required]],
      repoUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      demoUrl: ['', [Validators.pattern('https?://.+')]],
      techStack: this.fb.array([this.fb.control('', Validators.required)]),
      status: ['Planned', [Validators.required]],
      isPublic: [true],
      sortOrder: [0]
    });
  }

  get techStackArray(): FormArray {
    return this.projectForm.get('techStack') as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.projectId = +params['id'];
        this.loadProject();
      }
    });
  }

  addTech(): void {
    this.techStackArray.push(this.fb.control('', Validators.required));
  }

  removeTech(index: number): void {
    if (this.techStackArray.length > 1) {
      this.techStackArray.removeAt(index);
    }
  }

  private loadProject(): void {
    // TODO: Load project data for editing
    console.log('Loading project with ID:', this.projectId);
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.projectForm.value;

      // Filter out empty tech stack items
      formData.techStack = formData.techStack.filter((tech: string) => tech.trim() !== '');

      // TODO: Implement save functionality
      console.log('Project data:', formData);

      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/admin/projecten']);
      }, 1000);
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/projecten']);
  }
}
