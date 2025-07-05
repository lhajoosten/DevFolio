import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Project } from '../../../../core/models/project.model';
import { MatSpinner } from '@angular/material/progress-spinner';

export interface ProjectDialogData {
  project?: Project;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSpinner
  ],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  projectForm: FormGroup;
  techStack: string[] = [];
  saving = false;
  isEdit = false;

  readonly separatorKeyCodes = [ENTER, COMMA] as const;

  techSuggestions = [
    'Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript', 'Node.js',
    'C#', '.NET', 'Python', 'Java', 'SQL Server', 'MongoDB',
    'Azure', 'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'SCSS'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDialogData
  ) {
    this.isEdit = data.mode === 'edit';
    this.projectForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.project) {
      this.populateForm(this.data.project);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      repoUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      imageUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      startDate: ['', Validators.required],
      endDate: [''],
      isCompleted: [false]
    }, { validators: this.dateRangeValidator });
  }

  private dateRangeValidator(group: FormGroup) {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { dateRange: true };
    }
    return null;
  }

  private populateForm(project: Project): void {
    this.techStack = [...project.techStack];

    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      repoUrl: project.repoUrl,
      imageUrl: project.imageUrl,
      startDate: project.startDate,
      endDate: project.endDate,
      isCompleted: project.isCompleted
    });
  }

  addTech(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.techStack.includes(value) && this.techStack.length < 10) {
      this.techStack.push(value);
    }
    event.chipInput!.clear();
  }

  removeTech(index: number): void {
    if (index >= 0) {
      this.techStack.splice(index, 1);
    }
  }

  addSuggestedTech(tech: string): void {
    if (!this.techStack.includes(tech) && this.techStack.length < 10) {
      this.techStack.push(tech);
    }
  }

  getPreviewStatus(): string {
    const isCompleted = this.projectForm.get('isCompleted')?.value;
    const endDate = this.projectForm.get('endDate')?.value;

    if (isCompleted || endDate) {
      return 'Completed';
    }
    return 'In Progress';
  }

  formatPreviewDate(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  }

  onSave(): void {
    if (this.projectForm.valid) {
      this.saving = true;

      const formValue = this.projectForm.value;
      const projectData = {
        ...formValue,
        techStack: this.techStack,
        id: this.isEdit ? this.data.project!.id : undefined
      };

      // Simulate API call delay
      setTimeout(() => {
        this.dialogRef.close(projectData);
        this.saving = false;
      }, 1000);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
