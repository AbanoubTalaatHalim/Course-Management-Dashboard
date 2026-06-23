import { TestBed } from '@angular/core/testing';

import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseService);
  });

  it('creates a new course', () => {
    const created = service.addCourse({
      courseName: 'Testing Angular',
      instructorName: 'Test Lead',
      category: 'Quality',
      duration: 8,
      price: 700,
      status: 'Draft',
      description: 'Build confidence with focused Angular tests.'
    });

    expect(created.id).toBeTruthy();
    expect(created.courseName).toBe('Testing Angular');
  });

  it('deletes a course by id', () => {
    const created = service.addCourse({
      courseName: 'Delete Me',
      instructorName: 'Test Lead',
      category: 'Quality',
      duration: 2,
      price: 0,
      status: 'Draft',
      description: 'Temporary course record for delete coverage.'
    });

    service.deleteCourse(created.id);

    service.getCourseById(created.id).subscribe((course) => {
      expect(course).toBeUndefined();
    });
  });
});
