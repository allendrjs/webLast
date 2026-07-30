export interface Enrollment {
  enrollmentId: number;
  studentId: string;
  schoolYear: string;
  studentLevel?: string;
  section?: string;
  department?: string;
  disciplinaryStatus?: string;
}
