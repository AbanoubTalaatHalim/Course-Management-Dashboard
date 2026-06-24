import { Routes } from '@angular/router';

import { pendingChangesGuard } from '../../core/guards/pending-changes.guard';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/course-list/course-list.component').then((m) => m.CourseListComponent)
  },
  {
    path: 'new',
    canDeactivate: [pendingChangesGuard],
    loadComponent: () =>
      import('./pages/course-form/course-form.component').then((m) => m.CourseFormComponent)
  },
  {
    path: ':id/edit',
    canDeactivate: [pendingChangesGuard],
    loadComponent: () =>
      import('./pages/course-form/course-form.component').then((m) => m.CourseFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/course-detail/course-detail.component').then((m) => m.CourseDetailComponent)
  }
];
