import type { Appeal, AppealStatus } from "../../types/appeal";
import type { ViolationRecord } from "../../types/record";
import { appealStatusColors, recordStatusColors } from "../../components/ui/StatusPill";

// Shared helpers for the four Student portal screens (Dashboard, Offenses,
// Profile, Appeals) - kept in one place so date/status formatting stays
// consistent across all of them.

export function formatDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export interface OffenseDisplay {
  statusText: string;
  fg: string;
  bg: string;
  dateLabel: string;
  dateValue: string | undefined;
  bucket: "PENDING" | "APPROVED" | "DENIED";
}

// The Offenses mockup shows filter chips All/Pending/Approved/Denied and a
// status pill per card - but RecordStatus (the record's own status) is only
// PENDING/RESOLVED/APPEALED, with no APPROVED/DENIED. Those only exist on
// AppealStatus. So: when a record has a linked appeal, show and filter by
// *that appeal's* status (dateFiled becomes the card's date); records with
// no appeal filed against them are shown as "Pending" against the record's
// own violation date. This is a deliberate interpretation, not a literal
// mirror of one backend field - documented here since it isn't obvious.
export function deriveOffenseDisplay(record: ViolationRecord, appeals: Appeal[]): OffenseDisplay {
  const linkedAppeal = appeals.find((appeal) => appeal.record.recordId === record.recordId);

  if (linkedAppeal) {
    const colors = appealStatusColors(linkedAppeal.status);
    const bucket: OffenseDisplay["bucket"] =
      linkedAppeal.status === "APPROVED" ? "APPROVED" : linkedAppeal.status === "DENIED" ? "DENIED" : "PENDING";
    return {
      statusText: linkedAppeal.status === "UNDER_REVIEW" ? "Under Review" : capitalize(linkedAppeal.status),
      fg: colors.fg,
      bg: colors.bg,
      dateLabel: "Date Filed",
      dateValue: linkedAppeal.dateFiled,
      bucket,
    };
  }

  const colors = recordStatusColors(record.status);
  return {
    statusText: capitalize(record.status),
    fg: colors.fg,
    bg: colors.bg,
    dateLabel: "Date of Violation",
    dateValue: record.dateOfViolation,
    bucket: "PENDING",
  };
}

export function levelDotColor(type: string | undefined): string {
  if (!type) return "var(--osda-muted)";
  return type.toUpperCase() === "MAJOR" ? "var(--osda-red)" : "var(--osda-primary-muted)";
}

export function appealStatusLabel(status: AppealStatus): string {
  return status === "UNDER_REVIEW" ? "Under Review" : capitalize(status);
}

export function appealBucket(status: AppealStatus): "PENDING" | "APPROVED" | "DENIED" {
  return status === "APPROVED" ? "APPROVED" : status === "DENIED" ? "DENIED" : "PENDING";
}
