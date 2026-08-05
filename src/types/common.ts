// Mirrors org.rocs.osdrmsa.controller.common.dto.* - the trimmed-down
// "Summary" DTOs the backend nests inside RecordResponse/AppealResponse,
// distinct from the full entity types (Offense, Employee, etc.) used by
// the admin CRUD pages. Verified directly against the backend source
// (rc-osd-backend/src/main/java/.../controller/common/dto/), not guessed -
// field names here must match exactly since Jackson serializes by name.

export type Department = "JHS" | "SHS" | "COLLEGE";

export interface StudentSummary {
  studentId: string;
  fullName: string;
}

export interface EmployeeSummary {
  employeeId: string;
  fullName: string;
  employeeRole?: string;
}

export interface OffenseSummary {
  offenseId: number;
  offense: string;
  type?: string;
}

export interface ActionSummary {
  actionId: number;
  actionName: string;
}

export interface EnrollmentSummary {
  enrollmentId: number;
  student: StudentSummary;
  schoolYear: string;
  studentLevel?: string;
  section?: string;
  department?: Department;
}

// A trimmed-down Record view, only used embedded inside AppealResponse.
export interface RecordSummary {
  recordId: number;
  offense: OffenseSummary;
  status: "PENDING" | "RESOLVED" | "APPEALED";
}

// Below this line: raw JPA entity shapes (not DTOs). EnrollmentController
// and GuardianController's GET endpoints serialize the actual domain
// entity directly rather than mapping to a Response DTO, so these mirror
// org.rocs.osdrmsa.domain.person.Person /
// org.rocs.osdrmsa.domain.person.guardian.Guardian exactly - verified
// against the backend source, not guessed.

export interface Person {
  personID: number;
  lastName: string;
  firstName: string;
  middleName?: string;
}

export interface Guardian {
  guardianID: number;
  person?: Person;
  contactNumber?: string;
  relationship?: string;
}

export function fullName(person: Person | undefined | null): string {
  if (!person) return "";
  return [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" ");
}
