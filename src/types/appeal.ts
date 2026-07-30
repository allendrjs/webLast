export type AppealStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "DENIED";

export interface Appeal {
  appealId: number;
  recordId: number;
  enrollmentId: number;
  message: string;
  dateFiled: string;
  status: AppealStatus;
  dateProcessed?: string;
  remarks?: string;
  studentName?: string;
  offenseName?: string;
}
