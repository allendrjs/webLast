import { useEffect, useMemo, useState } from "react";
import { StudentAppShell } from "../../components/layout/StudentAppShell";
import { Card } from "../../components/ui/Card";
import { useStudentData } from "../student-portal/useStudentData";
import { formatDate, levelDotColor } from "../student-portal/helpers";
import { WarningIcon, ClockIcon, CalendarCheckIcon } from "../../components/layout/icons";

const MANILA_TZ = "Asia/Manila";

function useManilaClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// Matches the Dashboard mockup: live date/time banner (Asia/Manila, since
// the school is in Manila regardless of where the browser's clock is set),
// three stat cards, a "Most Frequent Offenses" bar chart derived from the
// student's own records, and a small recent-offenses table.
export function DashboardPage() {
  const now = useManilaClock();
  const { records, appeals, isLoading, error } = useStudentData();

  const dayName = now.toLocaleDateString("en-US", { weekday: "long", timeZone: MANILA_TZ }).toUpperCase();
  const dayNumber = now.toLocaleDateString("en-US", { day: "numeric", timeZone: MANILA_TZ });
  const monthYear = now.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: MANILA_TZ });
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: MANILA_TZ });

  const totalViolations = records.length;
  const pendingAppeals = appeals.filter((appeal) => appeal.status === "PENDING" || appeal.status === "UNDER_REVIEW").length;
  const todayManila = now.toLocaleDateString("en-CA", { timeZone: MANILA_TZ }); // YYYY-MM-DD
  const offensesToday = records.filter((record) => record.dateOfViolation === todayManila).length;

  const frequentOffenses = useMemo(() => {
    const counts = new Map<string, number>();
    for (const record of records) {
      const name = record.offense.offense;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const max = entries.length > 0 ? entries[0][1] : 1;
    return entries.map(([name, count]) => ({ name, count, pct: Math.max(8, (count / max) * 100) }));
  }, [records]);

  const recentOffenses = useMemo(
    () =>
      [...records]
        .sort((a, b) => (a.dateOfViolation < b.dateOfViolation ? 1 : -1))
        .slice(0, 5),
    [records]
  );

  return (
    <StudentAppShell>
      <div className="osda-stack" style={{ gap: 16 }}>
        <div className="osda-banner osda-clock-banner">
          <div style={{ flex: 1 }}>
            <p className="osda-clock-banner__day">{dayName}</p>
            <p className="osda-clock-banner__date">{dayNumber}</p>
            <p className="osda-clock-banner__month">{monthYear}</p>
          </div>
          <div className="osda-clock-banner__divider" />
          <div style={{ flex: 1, textAlign: "right" }}>
            <p className="osda-clock-banner__time">{time}</p>
            <p className="osda-clock-banner__tz">Manila Time</p>
          </div>
        </div>

        {error && <p className="osda-error-text">{error}</p>}

        <div className="osda-stat-grid">
          <div className="osda-stat-card">
            <div className="osda-stat-card__icon" style={{ background: "var(--osda-primary-muted)" }}>
              <WarningIcon color="var(--osda-primary)" />
            </div>
            <p className="osda-stat-card__value">{isLoading ? "—" : totalViolations}</p>
            <p className="osda-stat-card__label">Total Violations</p>
          </div>
          <div className="osda-stat-card">
            <div className="osda-stat-card__icon" style={{ background: "var(--osda-amber-bg)" }}>
              <ClockIcon color="var(--osda-amber)" />
            </div>
            <p className="osda-stat-card__value">{isLoading ? "—" : pendingAppeals}</p>
            <p className="osda-stat-card__label">Pending Appeals</p>
          </div>
          <div className="osda-stat-card">
            <div className="osda-stat-card__icon" style={{ background: "var(--osda-green-bg)" }}>
              <CalendarCheckIcon color="var(--osda-green)" />
            </div>
            <p className="osda-stat-card__value">{isLoading ? "—" : offensesToday}</p>
            <p className="osda-stat-card__label">Offenses Today</p>
          </div>
        </div>

        <div>
          <p className="osda-section-title">Most Frequent Offenses</p>
          <Card>
            {frequentOffenses.length === 0 ? (
              <p className="osda-muted-text">No offenses on file yet.</p>
            ) : (
              frequentOffenses.map((entry) => (
                <div className="osda-bar-row" key={entry.name}>
                  <span className="osda-bar-row__label">{entry.name}</span>
                  <div className="osda-bar-track">
                    <div className="osda-bar-fill" style={{ width: `${entry.pct}%` }} />
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>

        <div>
          <p className="osda-section-title">Recent Offenses</p>
          <div className="osda-mini-table__header">
            <span className="osda-mini-table__header-cell">Date</span>
            <span className="osda-mini-table__header-cell">Offense Type</span>
            <span className="osda-mini-table__header-cell">Level of Offense</span>
          </div>
          <Card>
            {recentOffenses.length === 0 ? (
              <p className="osda-muted-text">Nothing to show yet.</p>
            ) : (
              recentOffenses.map((record) => (
                <div className="osda-mini-table__row" key={record.recordId}>
                  <span>{formatDate(record.dateOfViolation)}</span>
                  <span>{record.offense.offense}</span>
                  <span style={{ color: levelDotColor(record.offense.type) }}>{record.offense.type ?? "—"}</span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </StudentAppShell>
  );
}
