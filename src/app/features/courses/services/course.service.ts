import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { Course, CourseFormData } from '../models/course.model';

const STORAGE_KEY = 'course-management-dashboard:courses';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly coursesSubject = new BehaviorSubject<Course[]>(this.loadCourses());
  readonly courses$ = this.coursesSubject.asObservable();

  getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return this.courses$.pipe(map((courses) => courses.find((course) => course.id === id)));
  }

  addCourse(data: CourseFormData): Course {
    const course: Course = {
      ...data,
      id: this.createId(),
      createdDate: this.today()
    };

    this.commit([course, ...this.coursesSubject.value]);
    return course;
  }

  updateCourse(id: string, data: CourseFormData): Course | undefined {
    let updatedCourse: Course | undefined;

    const courses = this.coursesSubject.value.map((course) => {
      if (course.id !== id) {
        return course;
      }

      updatedCourse = {
        ...course,
        ...data
      };
      return updatedCourse;
    });

    this.commit(courses);
    return updatedCourse;
  }

  deleteCourse(id: string): void {
    this.commit(this.coursesSubject.value.filter((course) => course.id !== id));
  }

  private commit(courses: Course[]): void {
    this.coursesSubject.next(courses);
    this.persistCourses(courses);
  }

  private loadCourses(): Course[] {
    const stored = this.readStorage();

    if (!stored) {
      return this.seedCourses();
    }

    try {
      const courses = JSON.parse(stored) as Course[];
      return this.isCourseArray(courses) ? courses : this.seedCourses();
    } catch {
      return this.seedCourses();
    }
  }

  private readStorage(): string | null {
    try {
      return globalThis.localStorage?.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  private persistCourses(courses: Course[]): void {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch {
      // The dashboard still works with in-memory data when storage is unavailable.
    }
  }

  private createId(): string {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private isCourseArray(value: unknown): value is Course[] {
    return (
      Array.isArray(value) &&
      value.every((course) => {
        const candidate = course as Partial<Course>;
        return (
          typeof candidate.id === 'string' &&
          typeof candidate.courseName === 'string' &&
          typeof candidate.instructorName === 'string' &&
          typeof candidate.category === 'string' &&
          typeof candidate.duration === 'number' &&
          typeof candidate.price === 'number' &&
          typeof candidate.status === 'string' &&
          typeof candidate.description === 'string' &&
          typeof candidate.createdDate === 'string'
        );
      })
    );
  }

  private seedCourses(): Course[] {
    return [
      {
        id: '1',
        courseName: 'Angular Fundamentals',
        instructorName: 'Ahmed Ali',
        category: 'Frontend',
        duration: 20,
        price: 1500,
        status: 'Active',
        description: 'A practical foundation for components, routing, data binding, and reactive forms.',
        createdDate: '2026-06-01'
      },
      {
        id: '2',
        courseName: 'TypeScript for Web Teams',
        instructorName: 'Maya Hassan',
        category: 'Frontend',
        duration: 16,
        price: 1200,
        status: 'Active',
        description: 'Strong typing patterns, interfaces, generics, and practical application architecture.',
        createdDate: '2026-06-05'
      },
      {
        id: '3',
        courseName: 'UX Research Sprint',
        instructorName: 'Sara Adel',
        category: 'Design',
        duration: 10,
        price: 900,
        status: 'Draft',
        description: 'Plan, run, synthesize, and communicate focused user research in product teams.',
        createdDate: '2026-06-10'
      },
      {
        id: '4',
        courseName: 'Cloud Deployment Essentials',
        instructorName: 'Karim Samy',
        category: 'Backend',
        duration: 22,
        price: 1800,
        status: 'Archived',
        description: 'Deployment pipelines, environment configuration, and observability basics.',
        createdDate: '2026-05-10'
      },
      {
        id: '5',
        courseName: 'Data Visualization with Charts',
        instructorName: 'Nour Farid',
        category: 'Analytics',
        duration: 12,
        price: 1100,
        status: 'Active',
        description: 'Create useful visual stories with dashboards, chart types, and accessibility in mind.',
        createdDate: '2026-06-19'
      }
    ];
  }
}
