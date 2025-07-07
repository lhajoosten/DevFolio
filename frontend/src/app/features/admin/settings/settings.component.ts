import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  passwordForm: FormGroup;
  preferencesForm: FormGroup;
  isChangingPassword = false;
  isSavingPreferences = false;
  passwordError = '';
  passwordSuccess = '';
  preferencesError = '';
  preferencesSuccess = '';

  constructor() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );

    this.preferencesForm = this.fb.group({
      emailNotifications: [true],
      projectUpdates: [true],
      darkMode: [false],
      language: ['nl'],
    });
  }

  public ngOnInit(): void {
    this.loadPreferences();
  }

  private loadPreferences(): void {
    // Load user preferences from localStorage or API
    const savedPreferences = localStorage.getItem('user-preferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      this.preferencesForm.patchValue(preferences);
    }
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  protected onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isChangingPassword = true;
    this.passwordError = '';
    this.passwordSuccess = '';

    // TODO: Implement password change API call
    // const { currentPassword, newPassword } = this.passwordForm.value;

    setTimeout(() => {
      this.passwordSuccess = 'Wachtwoord succesvol gewijzigd!';
      this.isChangingPassword = false;
      this.passwordForm.reset();
    }, 1000);
  }

  protected onSavePreferences(): void {
    this.isSavingPreferences = true;
    this.preferencesError = '';
    this.preferencesSuccess = '';

    const preferences = this.preferencesForm.value;

    // Save to localStorage
    localStorage.setItem('user-preferences', JSON.stringify(preferences));

    // Apply dark mode immediately
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setTimeout(() => {
      this.preferencesSuccess = 'Voorkeuren succesvol opgeslagen!';
      this.isSavingPreferences = false;
    }, 500);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  protected getPasswordFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is verplicht`;
      if (field.errors['minlength'])
        return `Wachtwoord moet minimaal 8 karakters lang zijn`;
    }

    if (
      fieldName === 'confirmPassword' &&
      this.passwordForm.errors?.['passwordMismatch'] &&
      field?.touched
    ) {
      return 'Wachtwoorden komen niet overeen';
    }

    return '';
  }

  protected clearPasswordMessages(): void {
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  protected clearPreferencesMessages(): void {
    this.preferencesError = '';
    this.preferencesSuccess = '';
  }

  protected onLogout(): void {
    this.authService.logout();
  }
}
