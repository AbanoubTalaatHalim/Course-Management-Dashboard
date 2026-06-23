export type CourseStatus = 'Active' | 'Draft' | 'Archived';

export interface Course {
  [key: string]: string | number;
  id: string;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  description: string;
  createdDate: string;
}

export interface CourseFormData {
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  description: string;
}
