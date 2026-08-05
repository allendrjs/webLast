import { StudentAppShell } from "../../components/layout/StudentAppShell";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { useStudentData } from "../student-portal/useStudentData";
import { initials } from "../student-portal/helpers";
import { fullName } from "../../types/common";
import { ProfileIcon, LockIcon, BookIcon, ChevronRightIcon } from "../../components/layout/icons";

// Matches the Profile mockup. Date of Birth and Contact Number are shown as
// "Not on file" rather than the mockup's sample values - the backend's
// Person/Student entities have no such columns (same honesty precedent set
// on Mobile's Profile screen: never fabricate data the backend can't back
// up). Guardian's Contact and Section are real, pulled from the actual
// backend response. Change Password / Student Handbook are shown per the
// design but inert - no backend endpoint backs either yet.
export function ProfilePage() {
  const { studentId, records, appeals, enrollment, guardians, isLoading, error } = useStudentData();

  const displayName = enrollment ? fullName(enrollment.student.person) : studentId ?? "Student";
  const program = enrollment?.student.studentType ?? enrollment?.department ?? "—";
  const primaryGuardian = guardians[0];

  const pendingAppeals = appeals.filter((a) => a.status === "PENDING" || a.status === "UNDER_REVIEW").length;

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

        <div className="osda-stat-grid">
          <StatCard value={isLoading ? "—" : records.length} label="Violations" color="var(--osda-red)" />
          <StatCard value={isLoading ? "—" : pendingAppeals} label="Pending Appeals" color="var(--osda-amber)" />
          <StatCard value={enrollment?.studentLevel ?? "—"} label="Year/Level" color="var(--osda-primary)" />
        </div>

        <div>
          <p className="osda-section-title">Personal Information</p>
          <Card>
            <div className="osda-info-row">
              <span className="osda-info-row__label">
                <ProfileIcon width={15} height={15} />
                Name
              </span>
              <span className="osda-info-row__value">{displayName}</span>
            </div>
            <div className="osda-info-row">
              <span className="osda-info-row__label">Date of Birth</span>
              <span className="osda-info-row__value osda-muted-text">Not on file</span>
            </div>
            <div className="osda-info-row">
              <span className="osda-info-row__label">Contact Number</span>
              <span className="osda-info-row__value osda-muted-text">Not on file</span>
            </div>
            <div className="osda-info-row">
              <span className="osda-info-row__label">Guardian's Contact</span>
              <span className="osda-info-row__value">{primaryGuardian?.contactNumber ?? "Not on file"}</span>
            </div>
            <div className="osda-info-row">
              <span className="osda-info-row__label">Section</span>
              <span className="osda-info-row__value">{enrollment?.section ?? "Not on file"}</span>
            </div>
          </Card>
        </div>

        <div>
          <p className="osda-section-title">Account</p>
          <button type="button" className="osda-action-row">
            <span className="osda-action-row__icon">
              <LockIcon width={16} height={16} />
            </span>
            <span className="osda-action-row__label">Change Password</span>
            <ChevronRightIcon width={16} height={16} color="var(--osda-muted)" />
          </button>
        </div>

        <div>
          <p className="osda-section-title">Support</p>
          <button type="button" className="osda-action-row">
            <span className="osda-action-row__icon">
              <BookIcon width={16} height={16} />
            </span>
            <span className="osda-action-row__label">Student Handbook</span>
            <ChevronRightIcon width={16} height={16} color="var(--osda-muted)" />
          </button>
        </div>
      </div>
    </StudentAppShell>
  );
}
