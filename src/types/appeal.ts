import type { EnrollmentSummary, RecordSummary } from "./common";

// Mirrors org.rocs.osdrmsa.domain.appeal.AppealStatus exactly.
export type AppealStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "DENIED";

// Mirrors org.rocs.osdrmsa.controller.appeal.dto.AppealResponse - nested
// record/enrollment Summary objects and dateFiled (not dateSubmitted, and
// no flat studentName/offenseName - those don't exist on this DTO).
export interface Appeal {
  appealId: number;
  record: RecordSummary;
  enrollment: EnrollmentSummary;
  message: string;
  dateFiled: string;
  status: AppealStatus;
  dateProcessed?: string;
  remarks?: string;
}
