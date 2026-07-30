export type RequestStatus = "PENDING" | "RESOLVED" | "APPEALED";

export interface RecordRequest {
  requestId: number;
  employeeId: string;
  details?: string;
  message?: string;
  type?: string;
  status: RequestStatus;
  dateProcessed?: string;
  remarks?: string;
}
