import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);

  protected profileForm: FormGroup;
  protected currentUser: User | null = null;
  protected isLoading = false;
  protected isSaving = false;
  protected errorMessage = '';
  protected successMessage = '';

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      bio: ['', [Validators.maxLength(500)]],
      location: ['', [Validators.maxLength(100)]],
      website: ['', [Validators.pattern('https?://.+')]],
      githubUrl: ['', [Validators.pattern('https?://github.com/.+')]],
      linkedInUrl: ['', [Validators.pattern('https?://linkedin.com/.+')]],
      phone: ['', [Validators.pattern('^[+]?[0-9\\s\\-\\(\\)]+$')]],
      isAvailableForWork: [false],
    });
  }

  public ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.isLoading = true;

    // Get current user from auth service
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user?.profile) {
        this.populateForm(user.profile);
      }
    });

    this.isLoading = false;
  }

  private populateForm(profile: unknown): void {
    if (profile && typeof profile === 'object') {
      const profileData = profile as Record<string, unknown>;
      this.profileForm.patchValue({
        firstName: (profileData['firstName'] as string) || '',
        lastName: (profileData['lastName'] as string) || '',
        bio: (profileData['bio'] as string) || '',
        location: (profileData['location'] as string) || '',
        website: (profileData['website'] as string) || '',
        githubUrl: (profileData['githubUrl'] as string) || '',
        linkedInUrl: (profileData['linkedInUrl'] as string) || '',
        phone: (profileData['phone'] as string) || '',
        isAvailableForWork:
          (profileData['isAvailableForWork'] as boolean) || false,
      });
    }
  }

  protected onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const profileData = this.profileForm.value;

    this.profileService.updateProfile(profileData).subscribe({
      next: () => {
        this.successMessage = 'Profiel succesvol bijgewerkt!';
        this.isSaving = false;

        // Refresh current user data
        this.authService.getCurrentUser().subscribe();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage =
          'Er is een fout opgetreden bij het bijwerken van je profiel.';
        this.isSaving = false;
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  protected getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is verplicht`;
      if (field.errors['minlength']) return `${fieldName} is te kort`;
      if (field.errors['maxlength']) return `${fieldName} is te lang`;
      if (field.errors['pattern'])
        return `${fieldName} heeft een ongeldig formaat`;
    }
    return '';
  }

  protected clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
