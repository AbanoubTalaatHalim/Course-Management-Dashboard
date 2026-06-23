import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { skip, take } from 'rxjs';

import { CourseListComponent } from './course-list.component';

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the course list page', () => {
    expect(component).toBeTruthy();
  });

  it('filters courses by search term', (done) => {
    component.vm$.pipe(skip(1), take(1)).subscribe((vm) => {
      expect(vm.rows.every((row) => String(row['courseName']).includes('Angular'))).toBeTrue();
      done();
    });

    component.searchControl.setValue('Angular');
  });
});
