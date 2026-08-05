import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../state/useAuth";
import { LoginPage } from "../features/login/LoginPage";
import { StudentPage } from "../features/student/StudentPage";
import { OffensePage } from "../features/offense/OffensePage";
import { DisciplinaryActionPage } from "../features/disciplinaryAction/DisciplinaryActionPage";
import { EmployeePage } from "../features/employee/EmployeePage";
import { GuardianPage } from "../features/guardian/GuardianPage";
import { EnrollmentPage } from "../features/enrollment/EnrollmentPage";
import { RecordPage } from "../features/record/RecordPage";
import { AppealPage } from "../features/appeal/AppealPage";
import { RequestPage } from "../features/request/RequestPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { ProfilePage } from "../features/profile/ProfilePage";

// ROLE_USER (Student) lands on the new Dashboard; every other authenticated
// role keeps landing on /records (its original destination, still used by
// admin/staff as the records-management view).
function RoleHome() {
  const { role } = useAuth();
  return <Navigate to={role === "ROLE_USER" ? "/dashboard" : "/records"} replace />;
}

// Route -> feature map, matching the "Feature for X" tickets. Role
// restrictions are enforced twice by design: once here (which page is even
// reachable) and again inside each page/API call (which data comes back) -
// the backend is still the real source of truth for authorization.
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />}>
        <Route path="/students" element={<StudentPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />}>
        <Route path="/offenses" element={<OffensePage />} />
        <Route path="/disciplinary-actions" element={<DisciplinaryActionPage />} />
        <Route path="/guardians" element={<GuardianPage />} />
        <Route path="/enrollments" element={<EnrollmentPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/employees" element={<EmployeePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_USER"]} />}>
        <Route path="/records" element={<RecordPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_USER"]} />}>
        <Route path="/appeals" element={<AppealPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_USER"]} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />}>
        <Route path="/requests" element={<RequestPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<RoleHome />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
