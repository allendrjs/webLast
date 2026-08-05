import { useMemo, useState, type FormEvent } from "react";
import { StudentAppShell } from "../../components/layout/StudentAppShell";
import { Card } from "../../components/ui/Card";
import { FilterPill } from "../../components/ui/FilterPill";
import { StatusPill } from "../../components/ui/StatusPill";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import { useStudentData } from "../student-portal/useStudentData";
import { appealBucket, formatDate } from "../student-portal/helpers";
import { appealStatusColors } from "../../components/ui/StatusPill";
import { fileAppeal } from "../../api/appealApi";
import { PlusIcon, ChevronRightIcon } from "../../components/layout/icons";

type FilterKey = "ALL" | "PENDING" | "APPROVED" | "DENIED";
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "DENIED", label: "Denied" },
];

function appealCode(appealId: number): string {
  return `AP${String(appealId).padStart(4, "0")}`;
}

// Matches the Appeals mockup: stat row, a "File a New Appeal" call to
// action, filter chips, and a card per appeal. Filing opens a small form
// (not in the mockup's static screenshots, but required to make "File a
// New Appeal" actually do something) letting the student pick one of their
// own PENDING, not-yet-appealed offenses and submit a reason.
export function AppealPage() {
  const { records, appeals, isLoading, error, reload } = useStudentData();
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [showForm, setShowForm] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eligibleRecords = useMemo(
    () =>
      records.filter(
        (record) => record.status === "PENDING" && !appeals.some((appeal) => appeal.record.recordId === record.recordId)
      ),
    [records, appeals]
  );

  const rows = useMemo(
    () => [...appeals].sort((a, b) => (a.dateFiled < b.dateFiled ? 1 : -1)),
    [appeals]
  );
  const filteredRows = filter === "ALL" ? rows : rows.filter((appeal) => appealBucket(appeal.status) === filter);

  const totalFiled = appeals.length;
  const pendingCount = appeals.filter((a) => a.status === "PENDING" || a.status === "UNDER_REVIEW").length;
  const approvedCount = appeals.filter((a) => a.status === "APPROVED").length;
  const deniedCount = appeals.filter((a) => a.status === "DENIED").length;

  function openForm() {
    setSubmitError(null);
    setSelectedRecordId(eligibleRecords[0]?.recordId ?? "");
    setMessage("");
    setShowForm(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (selectedRecordId === "" || message.trim().length === 0) return;
    const record = eligibleRecords.find((r) => r.recordId === selectedRecordId);
    if (!record) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await fileAppeal({
        recordId: record.recordId,
        enrollmentId: record.enrollment.enrollmentId,
        message: message.trim(),
      });
      setShowForm(false);
      reload();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? "Could not submit your appeal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <StudentAppShell>
      <div className="osda-stack" style={{ gap: 16 }}>
        <div>
          <p className="osda-section-title" style={{ marginBottom: 2 }}>
            My Appeals
          </p>
          <p className="osda-muted-text" style={{ margin: 0 }}>
            Track and file offense appeals
          </p>
        </div>

        {error && <p className="osda-error-text">{error}</p>}

        <div className="osda-stat-grid">
          <div className="osda-stat-card">
            <p className="osda-stat-card__value">{isLoading ? "—" : totalFiled}</p>
            <p className="osda-stat-card__label">Total Filed</p>
          </div>
          <div className="osda-stat-card">
            <p className="osda-stat-card__value" style={{ color: "var(--osda-amber)" }}>
              {isLoading ? "—" : pendingCount}
            </p>
            <p className="osda-stat-card__label">Pending</p>
          </div>
          <div className="osda-stat-card">
            <p className="osda-stat-card__value" style={{ color: "var(--osda-green)" }}>
              {isLoading ? "—" : approvedCount}
            </p>
            <p className="osda-stat-card__label">Approved</p>
          </div>
          <div className="osda-stat-card">
            <p className="osda-stat-card__value" style={{ color: "var(--osda-red)" }}>
              {isLoading ? "—" : deniedCount}
            </p>
            <p className="osda-stat-card__label">Denied</p>
          </div>
        </div>

        <div className="osda-banner">
          <button type="button" className="osda-banner-action" onClick={openForm}>
            <span className="osda-banner-action__icon">
              <PlusIcon width={16} height={16} />
            </span>
            <span style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>File a New Appeal</p>
              <p className="osda-banner__muted" style={{ margin: "2px 0 0", fontSize: 12 }}>
                Request a review of your case
              </p>
            </span>
            <ChevronRightIcon width={16} height={16} />
          </button>
        </div>

        <div className="osda-filter-row">
          {FILTERS.map((f) => (
            <FilterPill key={f.key} label={f.label} selected={filter === f.key} onClick={() => setFilter(f.key)} />
          ))}
        </div>

        <div className="osda-stack" style={{ gap: 10 }}>
          {isLoading && <p className="osda-muted-text">Loading your appeals…</p>}
          {!isLoading && filteredRows.length === 0 && <p className="osda-muted-text">No appeals to show.</p>}
          {filteredRows.map((appeal) => {
            const colors = appealStatusColors(appeal.status);
            return (
              <Card key={appeal.appealId}>
                <div className="osda-row-between" style={{ alignItems: "flex-start" }}>
                  <p className="osda-muted-text" style={{ margin: 0, fontSize: 11 }}>
                    APPEAL ID: {appealCode(appeal.appealId)}
                  </p>
                  <StatusPill
                    text={appeal.status === "UNDER_REVIEW" ? "Under Review" : appeal.status.charAt(0) + appeal.status.slice(1).toLowerCase()}
                    fg={colors.fg}
                    bg={colors.bg}
                  />
                </div>
                <p style={{ margin: "6px 0 8px", fontWeight: 700, fontSize: 14 }}>{appeal.record.offense.offense}</p>
                <p className="osda-input-label" style={{ margin: "0 0 2px" }}>
                  Reason
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--osda-heading)" }}>{appeal.message}</p>
                <p className="osda-muted-text" style={{ margin: "10px 0 0", fontSize: 11 }}>
                  Submitted {formatDate(appeal.dateFiled)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className="osda-modal-overlay" role="dialog" aria-modal="true">
          <div className="osda-modal" style={{ maxWidth: 360, textAlign: "left" }}>
            <p className="osda-section-title">File a New Appeal</p>
            <form onSubmit={handleSubmit}>
              <div className="osda-login-field">
                <label className="osda-input-label" htmlFor="appeal-record">
                  Offense
                </label>
                {eligibleRecords.length === 0 ? (
                  <p className="osda-muted-text">No eligible offenses to appeal right now.</p>
                ) : (
                  <select
                    id="appeal-record"
                    className="osda-input"
                    value={selectedRecordId}
                    onChange={(event) => setSelectedRecordId(Number(event.target.value))}
                  >
                    {eligibleRecords.map((record) => (
                      <option key={record.recordId} value={record.recordId}>
                        {record.offense.offense} — {formatDate(record.dateOfViolation)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="osda-login-field">
                <label className="osda-input-label" htmlFor="appeal-message">
                  Reason
                </label>
                <textarea
                  id="appeal-message"
                  className="osda-input osda-textarea"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Explain why you're appealing this offense..."
                />
              </div>

              {submitError && <p className="osda-error-text">{submitError}</p>}

              <div className="osda-modal__actions">
                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting || eligibleRecords.length === 0 || message.trim().length === 0}
                >
                  {isSubmitting ? "Submitting..." : "Submit Appeal"}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </SecondaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudentAppShell>
  );
}
