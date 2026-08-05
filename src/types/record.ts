import type { ActionSummary, EmployeeSummary, EnrollmentSummary, OffenseSummary } from "./common";

// Mirrors org.rocs.osdrmsa.domain.record.RecordStatus exactly - the
// scaffold's original version was missing APPEALED.
export type RecordStatus = "PENDING" | "RESOLVED" | "APPEALED";

// Mirrors org.rocs.osdrmsa.controller.record.dto.RecordResponse - nested
// Summary objects, not flat IDs. "Record" alone collides with the
// built-in TypeScript utility type, so this is named ViolationRecord (same
// naming reasoning as Mobile's ViolationRecord.kt).
export interface ViolationRecord {
  recordId: number;
  enrollment: EnrollmentSummary;
  employee: EmployeeSummary;
  offense: OffenseSummary;
  dateOfViolation: string;
  action?: ActionSummary;
  dateOfResolution?: string;
  remarks?: string;
  status: RecordStatus;
}
