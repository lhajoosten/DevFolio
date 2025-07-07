import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile, User } from '../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      bio: ['', [Validators.maxLength(500)]],
      location: ['', [Validators.maxLength(100)]],
      website: ['', [Validators.pattern('https?://.+')]],
      githubUrl: ['', [Validators.pattern('https?://github.com/.+')]],
      linkedInUrl: ['', [Validators.pattern('https?://linkedin.com/.+')]],
      phone: ['', [Validators.pattern('^[+]?[0-9\\s\\-\\(\\)]+$')]],
      isAvailableForWork: [false]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.isLoading = true;

    // Get current user from auth service
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.profile) {
        this.populateForm(user.profile);
      }
    });

    this.isLoading = false;
  }

  private populateForm(profile: any): void {
    this.profileForm.patchValue({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      githubUrl: profile.githubUrl || '',
      linkedInUrl: profile.linkedInUrl || '',
      phone: profile.phone || '',
      isAvailableForWork: profile.isAvailableForWork || false
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const profileData = this.profileForm.value;

    this.profileService.updateProfile(profileData).subscribe({
      next: (updatedProfile) => {
        this.successMessage = 'Profiel succesvol bijgewerkt!';
        this.isSaving = false;

        // Refresh current user data
        this.authService.getCurrentUser().subscribe();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Er is een fout opgetreden bij het bijwerken van je profiel.';
        this.isSaving = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is verplicht`;
      if (field.errors['minlength']) return `${fieldName} is te kort`;
      if (field.errors['maxlength']) return `${fieldName} is te lang`;
      if (field.errors['pattern']) return `${fieldName} heeft een ongeldig formaat`;
    }
    return '';
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
