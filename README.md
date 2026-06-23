# Course Management Dashboard

Angular Developer Technical Task implementation for a course catalog dashboard. It uses Angular routing, reactive forms, reusable UI components, Local Storage-backed mock data, and responsive screens.

## Features

- View courses in a reusable sortable table.
- Search courses by name.
- Filter courses by status.
- Add and edit courses with reactive forms.
- Delete courses through a confirmation modal.
- View course details with course name, instructor, category, duration, price, status, description, and created date.
- Pagination, sorting, toast notifications, lazy-loaded routes, route guard, loading skeleton, empty-friendly UI states, and focused unit tests.

## Course Data Model

```ts
interface Course {
  id: string;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: 'Active' | 'Draft' | 'Archived';
  description: string;
  createdDate: string;
}
```

## Validation Rules

- Course name: required, minimum 3 characters.
- Instructor name: required.
- Category: required.
- Duration: required, number only, greater than 0.
- Price: required, number only, minimum 0.
- Status: required, Active/Draft/Archived.
- Description: optional, maximum 500 characters.

## Project Structure

- `src/app/core`: shared application services and route guards.
- `src/app/shared`: reusable table, toast, and confirmation modal components.
- `src/app/features/courses/pages`: course list, form, and details pages.
- `src/app/features/courses/models`: course TypeScript interfaces.
- `src/app/features/courses/services`: course data and business logic.

## Run Locally

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Data Source

The app uses a mock `CourseService` with Local Storage persistence. If Local Storage is unavailable, the dashboard still works with in-memory seeded data.

## Notes

This workspace blocked dependency downloads during setup, so `node_modules` and `package-lock.json` were not generated here. The source is ready for a normal Angular install on a machine with npm registry access.
