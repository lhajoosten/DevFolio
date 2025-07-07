import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../../core/services/projects.service';
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectStatus,
} from '../../../../core/models';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  projectId?: number;

  // Expose ProjectStatus enum for template
  readonly ProjectStatus = ProjectStatus;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      repoUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      imageUrl: ['', [Validators.pattern('https?://.+')]],
      techStack: this.fb.array([this.fb.control('', Validators.required)]),
      startDate: ['', [Validators.required]],
      endDate: [''],
    });
  }

  get techStackArray(): FormArray {
    return this.projectForm.get('techStack') as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.projectId = +params['id'];
        this.loadProject();
      }
    });
  }

  private loadProject(): void {
    if (!this.projectId) return;

    this.isLoading = true;
    this.projectsService.getProject(this.projectId).subscribe({
      next: (project) => {
        this.populateForm(project);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.errorMessage = 'Fout bij het laden van het project.';
        this.isLoading = false;
      },
    });
  }

  private populateForm(project: Project): void {
    // Clear existing tech stack
    while (this.techStackArray.length !== 0) {
      this.techStackArray.removeAt(0);
    }

    // Add tech stack controls
    project.techStack.forEach((tech) => {
      this.techStackArray.push(this.fb.control(tech, Validators.required));
    });

    // Set form values
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      repoUrl: project.repoUrl,
      imageUrl: project.imageUrl || '',
      startDate: this.formatDateForInput(project.startDate),
      endDate: project.endDate ? this.formatDateForInput(project.endDate) : '',
    });
  }

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  addTechStack(): void {
    this.techStackArray.push(this.fb.control('', Validators.required));
  }

  removeTechStack(index: number): void {
    this.techStackArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.projectForm.value;

    if (this.isEditMode && this.projectId) {
      const updateData: UpdateProjectDto = {
        id: this.projectId,
        title: formValue.title,
        description: formValue.description,
        repoUrl: formValue.repoUrl,
        imageUrl: formValue.imageUrl || undefined,
        techStack: formValue.techStack.filter(
          (tech: string) => tech.trim() !== ''
        ),
        startDate: new Date(formValue.startDate),
        endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
      };

      this.projectsService.updateProject(updateData).subscribe({
        next: () => {
          console.log('Project updated successfully');
          this.router.navigate(['/admin/projecten']);
        },
        error: (error) => {
          console.error('Error updating project:', error);
          this.errorMessage = 'Fout bij het bijwerken van het project.';
          this.isSaving = false;
        },
      });
    } else {
      const createData: CreateProjectDto = {
        title: formValue.title,
        description: formValue.description,
        repoUrl: formValue.repoUrl,
        imageUrl: formValue.imageUrl || undefined,
        techStack: formValue.techStack.filter(
          (tech: string) => tech.trim() !== ''
        ),
        startDate: formValue.startDate
          ? new Date(formValue.startDate)
          : undefined,
        endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
      };

      this.projectsService.createProject(createData).subscribe({
        next: () => {
          console.log('Project created successfully');
          this.router.navigate(['/admin/projecten']);
        },
        error: (error) => {
          console.error('Error creating project:', error);
          this.errorMessage = 'Fout bij het aanmaken van het project.';
          this.isSaving = false;
        },
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach((key) => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach((c) => c.markAsTouched());
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is verplicht`;
      if (field.errors['minlength']) return `${fieldName} is te kort`;
      if (field.errors['pattern'])
        return `${fieldName} heeft een ongeldig formaat`;
    }
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/admin/projecten']);
  }

  addTech(): void {
    this.techStackArray.push(this.fb.control('', Validators.required));
  }

  removeTech(index: number): void {
    if (this.techStackArray.length > 1) {
      this.techStackArray.removeAt(index);
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/projecten']);
  }
}
