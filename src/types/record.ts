export type RecordStatus = "PENDING" | "RESOLVED";

// Mirrors org.rocs.osdrmsa.domain.record.Record - "Record" alone collides
// with the built-in TypeScript utility type, so this is named ViolationRecord.
export interface ViolationRecord {
  recordId: number;
  enrollmentId: number;
  employeeId: string;
  offenseId: number;
  dateOfViolation: string;
  actionId?: number;
  dateOfResolution?: string;
  remarks?: string;
  status: RecordStatus;
}
