import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map, startWith } from 'rxjs';

import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  DataTableColumn,
  DataTableComponent,
  SortChange,
  SortDirection,
  TableRow
} from '../../../../shared/components/data-table/data-table.component';
import { Course, CourseStatus } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

type StatusFilter = CourseStatus | 'All';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink, DataTableComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly statusControl = new FormControl<StatusFilter>('All', { nonNullable: true });
  readonly pageSizeControl = new FormControl(5, { nonNullable: true });

  readonly statusOptions: StatusFilter[] = ['All', 'Active', 'Draft', 'Archived'];
  readonly pageSizes = [5, 10, 20];
  readonly columns: DataTableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'courseName', label: 'Course name', sortable: true },
    { key: 'instructorName', label: 'Instructor', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'duration', label: 'Duration', sortable: true, align: 'right' },
    { key: 'price', label: 'Price', sortable: true, align: 'right' },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdDate', label: 'Created date', sortable: true }
  ];

  private readonly pageSubject = new BehaviorSubject(1);
  private readonly sortSubject = new BehaviorSubject<SortChange>({ key: 'courseName', direction: 'asc' });
  isLoading = true;

  readonly vm$ = combineLatest([
    this.courseService.getCourses(),
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    this.statusControl.valueChanges.pipe(startWith(this.statusControl.value)),
    this.pageSizeControl.valueChanges.pipe(startWith(this.pageSizeControl.value)),
    this.pageSubject,
    this.sortSubject
  ]).pipe(
    map(([courses, search, status, pageSize, page, sort]) => {
      const filtered = this.filterCourses(courses, search, status);
      const sorted = this.sortCourses(filtered, sort.key, sort.direction);
      const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
      const currentPage = Math.min(page, totalPages);
      const start = (currentPage - 1) * pageSize;

      return {
        rows: sorted.slice(start, start + pageSize),
        total: filtered.length,
        totalCourses: courses.length,
        activeCount: courses.filter((course) => course.status === 'Active').length,
        draftCount: courses.filter((course) => course.status === 'Draft').length,
        page: currentPage,
        pageSize,
        totalPages,
        sort
      };
    })
  );

  ngOnInit(): void {
    window.setTimeout(() => {
      this.isLoading = false;
    }, 250);
  }

  resetPage(): void {
    this.pageSubject.next(1);
  }

  goToPage(page: number): void {
    this.pageSubject.next(page);
  }

  onPageSizeChange(): void {
    this.resetPage();
  }

  onSort(sort: SortChange): void {
    this.sortSubject.next(sort);
    this.resetPage();
  }

  viewCourse(row: TableRow): void {
    void this.router.navigate(['/courses', String(row['id'])]);
  }

  editCourse(row: TableRow): void {
    void this.router.navigate(['/courses', String(row['id']), 'edit']);
  }

  async deleteCourse(row: TableRow): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete course?',
      message: `Delete "${String(row['courseName'])}" from the catalog? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      danger: true
    });

    if (!confirmed) {
      return;
    }

    this.courseService.deleteCourse(String(row['id']));
    this.toast.show('Course deleted successfully.', 'success');
  }

  private filterCourses(courses: Course[], search: string, status: StatusFilter): Course[] {
    const term = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesName = course.courseName.toLowerCase().includes(term);
      const matchesStatus = status === 'All' || course.status === status;
      return matchesName && matchesStatus;
    });
  }

  private sortCourses(courses: Course[], key: string, direction: SortDirection): Course[] {
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...courses].sort((first, second) => {
      const firstValue = first[key];
      const secondValue = second[key];

      if (typeof firstValue === 'number' && typeof secondValue === 'number') {
        return (firstValue - secondValue) * multiplier;
      }

      return String(firstValue).localeCompare(String(secondValue)) * multiplier;
    });
  }
}
