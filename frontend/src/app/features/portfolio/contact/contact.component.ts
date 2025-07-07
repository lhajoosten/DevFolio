import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  privacyConsent: boolean;
}

export interface ContactInfo {
  type: string;
  icon: string;
  label: string;
  value: string;
  link?: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  protected contactForm: FormGroup;
  protected isSubmitting = false;

  protected personalInfo = {
    firstName: 'Luc',
    lastName: 'Joosten',
    title: 'Full-Stack Developer',
    location: 'Nederland',
    email: 'lhajoosten@outlook.com',
    github: 'https://github.com/lhajoosten',
    linkedin: 'https://linkedin.com/in/lhajoosten',
    phone: '+31 6 12345678', // Example phone number
  };

  protected contactMethods: ContactInfo[] = [
    {
      type: 'email',
      icon: 'email',
      label: 'Email',
      value: this.personalInfo.email,
      link: `mailto:${this.personalInfo.email}`,
    },
    {
      type: 'linkedin',
      icon: 'work',
      label: 'LinkedIn',
      value: 'linkedin.com/in/lhajoosten',
      link: this.personalInfo.linkedin,
    },
    {
      type: 'github',
      icon: 'code',
      label: 'GitHub',
      value: 'github.com/lhajoosten',
      link: this.personalInfo.github,
    },
    {
      type: 'location',
      icon: 'location_on',
      label: 'Locatie',
      value: this.personalInfo.location,
    },
  ];

  protected projectTypes = [
    { value: 'website', label: 'Website Development' },
    { value: 'webapp', label: 'Web Applicatie' },
    { value: 'api', label: 'API Development' },
    { value: 'maintenance', label: 'Onderhoud & Updates' },
    { value: 'consultation', label: 'Consultancy' },
    { value: 'other', label: 'Anders' },
  ];

  protected budgetRanges = [
    { value: 'under-5k', label: 'Onder €5.000' },
    { value: '5k-15k', label: '€5.000 - €15.000' },
    { value: '15k-50k', label: '€15.000 - €50.000' },
    { value: 'over-50k', label: 'Boven €50.000' },
    { value: 'discuss', label: 'Te bespreken' },
  ];

  protected timelines = [
    { value: 'asap', label: 'Zo snel mogelijk' },
    { value: '1-month', label: 'Binnen 1 maand' },
    { value: '1-3-months', label: '1-3 maanden' },
    { value: '3-6-months', label: '3-6 maanden' },
    { value: 'flexible', label: 'Flexibel' },
  ];

  constructor() {
    this.contactForm = this.createForm();
  }

  public ngOnInit(): void {
    // Initialize form validation states
    this.contactForm.statusChanges.subscribe(() => {
      // Update UI when form validation state changes
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20)]],
      projectType: ['', Validators.required],
      budget: [''],
      timeline: [''],
      privacyConsent: [false, Validators.requiredTrue],
    });
  }

  protected getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is verplicht`;
    }

    if (field?.hasError('email')) {
      return 'Voer een geldig email adres in';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength']?.requiredLength;
      return `Minimaal ${requiredLength} karakters vereist`;
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Naam',
      email: 'Email',
      subject: 'Onderwerp',
      message: 'Bericht',
      projectType: 'Project type',
      privacyConsent: 'Privacy akkoord',
    };
    return labels[fieldName] || fieldName;
  }

  protected async onSubmit(): Promise<void> {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      try {
        // Simulate API call
        await this.submitContactForm();

        this.snackBar.open(
          'Bedankt voor je bericht! Ik neem zo snel mogelijk contact met je op.',
          'Sluiten',
          {
            duration: 5000,
            panelClass: ['success-snackbar'],
          },
        );

        this.contactForm.reset();
      } catch (error) {
        console.error('Error submitting contact form:', error);
        this.snackBar.open(
          'Er is een fout opgetreden. Probeer het opnieuw of stuur een directe email.',
          'Sluiten',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          },
        );
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private async submitContactForm(): Promise<void> {
    // In a real application, this would call your backend API
    // For now, we'll simulate the submission
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach((key) => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  protected openContactMethod(contactInfo: ContactInfo): void {
    if (contactInfo.link) {
      if (contactInfo.type === 'email') {
        // Pre-fill email subject for convenience
        const subject = encodeURIComponent('Contact via DevFolio Portfolio');
        window.open(`${contactInfo.link}?subject=${subject}`, '_blank');
      } else {
        window.open(contactInfo.link, '_blank', 'noopener,noreferrer');
      }
    }
  }

  protected downloadDutchCV(): void {
    const link = document.createElement('a');
    link.href = '/assets/documents/luc-joosten-cv.pdf';
    link.download = 'cv-luc-joosten.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  protected downloadEnglishCV(): void {
    const link = document.createElement('a');
    link.href = '/assets/documents/luc-joosten-cv-english.pdf';
    link.download = 'cv-luc-joosten-en.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Getters for template
  protected get nameControl() {
    return this.contactForm.get('name');
  }
  protected get emailControl() {
    return this.contactForm.get('email');
  }
  protected get subjectControl() {
    return this.contactForm.get('subject');
  }
  protected get messageControl() {
    return this.contactForm.get('message');
  }
  protected get projectTypeControl() {
    return this.contactForm.get('projectType');
  }
  protected get privacyConsentControl() {
    return this.contactForm.get('privacyConsent');
  }
}
