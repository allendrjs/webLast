import type { Department, Guardian, Person } from "./common";

// Mirrors org.rocs.osdrmsa.domain.person.student.Student (raw JPA entity).
export interface Student {
  studentId: string;
  person?: Person;
  address?: string;
  studentType?: string;
  department?: Department;
  guardians?: Guardian[];
}

// Mirrors org.rocs.osdrmsa.domain.disciplinary.status.DisciplinaryStatus.
export interface DisciplinaryStatus {
  disciplinaryStatusId: number;
  status: string;
  description?: string;
}

// IMPORTANT: EnrollmentController's GET endpoints
// (/api/enrollments, /api/enrollments/{id}, /api/enrollments/student/{id}/latest)
// return the raw `Enrollment` JPA entity directly, not a DTO - unlike
// Record/Appeal which go through dedicated Response records. That means
// this shape nests the *full* Student (and its full Person/Guardian list),
// not a trimmed StudentSummary. Verified against
// org.rocs.osdrmsa.domain.enrollment.Enrollment directly.
export interface Enrollment {
  enrollmentId: number;
  student: Student;
  schoolYear: string;
  studentLevel?: string;
  section?: string;
  department?: Department;
  disciplinaryStatus?: DisciplinaryStatus;
}
