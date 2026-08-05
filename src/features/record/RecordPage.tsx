import { useMemo, useState } from "react";
import { StudentAppShell } from "../../components/layout/StudentAppShell";
import { Card } from "../../components/ui/Card";
import { FilterPill } from "../../components/ui/FilterPill";
import { StatusPill } from "../../components/ui/StatusPill";
import { useStudentData } from "../student-portal/useStudentData";
import { deriveOffenseDisplay, formatDate, initials, levelDotColor } from "../student-portal/helpers";
import { fullName } from "../../types/common";

type FilterKey = "ALL" | "PENDING" | "APPROVED" | "DENIED";
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "DENIED", label: "Denied" },
];

// Matches the Offenses mockup: profile header banner, filter chips, and a
// card per offense showing its (appeal-derived, see helpers.ts) status.
export function RecordPage() {
  const { studentId, records, appeals, enrollment, isLoading, error } = useStudentData();
  const [filter, setFilter] = useState<FilterKey>("ALL");

  const displayName = enrollment ? fullName(enrollment.student.person) : studentId ?? "Student";
  const program = enrollment?.student.studentType ?? enrollment?.department ?? "—";

  const rows = useMemo(
    () =>
      [...records]
        .sort((a, b) => (a.dateOfViolation < b.dateOfViolation ? 1 : -1))
        .map((record) => ({ record, display: deriveOffenseDisplay(record, appeals) })),
    [records, appeals]
  );

  const filteredRows = filter === "ALL" ? rows : rows.filter((row) => row.display.bucket === filter);

  return (
    <StudentAppShell>
      <div className="osda-stack" style={{ gap: 16 }}>
        <div className="osda-banner" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="osda-login-mark" style={{ width: 48, height: 48, fontSize: 15, flexShrink: 0 }}>
            {initials(displayName)}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>{displayName}</p>
            <p className="osda-banner__muted" style={{ margin: "2px 0 0", fontSize: 12 }}>
              Student ID: {studentId ?? "—"} &nbsp;•&nbsp; {program}
            </p>
          </div>
        </div>

        {error && <p className="osda-error-text">{error}</p>}

        <p className="osda-section-title" style={{ marginBottom: 0 }}>
          My Offenses
        </p>

        <div className="osda-filter-row">
          {FILTERS.map((f) => (
            <FilterPill key={f.key} label={f.label} selected={filter === f.key} onClick={() => setFilter(f.key)} />
          ))}
        </div>

        <div className="osda-stack" style={{ gap: 10 }}>
          {isLoading && <p className="osda-muted-text">Loading your offenses…</p>}
          {!isLoading && filteredRows.length === 0 && <p className="osda-muted-text">No offenses to show.</p>}
          {filteredRows.map(({ record, display }) => (
            <Card key={record.recordId}>
              <div className="osda-row-between" style={{ alignItems: "flex-start" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{record.offense.offense}</p>
                <StatusPill text={display.statusText} fg={display.fg} bg={display.bg} />
              </div>
              <div className="osda-row-between" style={{ marginTop: 10 }}>
                <div>
                  <p className="osda-input-label" style={{ margin: 0 }}>
                    Level
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: levelDotColor(record.offense.type),
                        display: "inline-block",
                      }}
                    />
                    {record.offense.type ?? "—"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="osda-input-label" style={{ margin: 0 }}>
                    {display.dateLabel}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 12 }}>{formatDate(display.dateValue)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </StudentAppShell>
  );
}
