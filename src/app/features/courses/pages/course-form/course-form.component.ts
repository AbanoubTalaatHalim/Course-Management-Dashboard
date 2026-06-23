import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';

import { CanComponentDeactivate } from '../../../../core/guards/pending-changes.guard';
import { ToastService } from '../../../../core/services/toast.service';
import { CourseFormData, CourseStatus } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

type CourseFormControlName = keyof CourseFormData;

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent implements OnInit, CanComponentDeactivate {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly toast = inject(ToastService);

  readonly statuses: CourseStatus[] = ['Active', 'Draft', 'Archived'];
  readonly form = this.fb.nonNullable.group({
    courseName: ['', [Validators.required, Validators.minLength(3)]],
    instructorName: ['', [Validators.required]],
    category: ['', [Validators.required]],
    duration: [1, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]],
    status: ['Active' as CourseStatus, [Validators.required]],
    description: ['', [Validators.maxLength(500)]]
  });

  courseId: string | null = null;
  notFound = false;
  private saved = false;
  private initialSnapshot = '';

  get isEditMode(): boolean {
    return Boolean(this.courseId);
  }

  get title(): string {
    return this.isEditMode ? 'Edit Course' : 'Add Course';
  }

  get submitLabel(): string {
    return this.isEditMode ? 'Save Changes' : 'Create Course';
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');

    if (!this.courseId) {
      this.initialSnapshot = this.snapshot();
      return;
    }

    this.courseService
      .getCourseById(this.courseId)
      .pipe(take(1))
      .subscribe((course) => {
        if (!course) {
          this.notFound = true;
          return;
        }

        this.form.patchValue({
          courseName: course.courseName,
          instructorName: course.instructorName,
          category: course.category,
          duration: course.duration,
          price: course.price,
          status: course.status,
          description: course.description
        });
        this.initialSnapshot = this.snapshot();
        this.form.markAsPristine();
      });
  }

  canDeactivate(): boolean {
    return this.saved || this.notFound || this.snapshot() === this.initialSnapshot;
  }

  hasError(controlName: CourseFormControlName, error: string): boolean {
    const control = this.form.controls[controlName];
    return control.hasError(error) && (control.dirty || control.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Please fix the highlighted fields.', 'error');
      return;
    }

    const data = this.form.getRawValue();

    if (this.courseId) {
      this.courseService.updateCourse(this.courseId, data);
      this.toast.show('Course updated successfully.', 'success');
      this.saved = true;
      void this.router.navigate(['/courses', this.courseId]);
      return;
    }

    const course = this.courseService.addCourse(data);
    this.toast.show('Course created successfully.', 'success');
    this.saved = true;
    void this.router.navigate(['/courses', course.id]);
  }

  private snapshot(): string {
    return JSON.stringify(this.form.getRawValue());
  }
}
