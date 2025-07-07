import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
