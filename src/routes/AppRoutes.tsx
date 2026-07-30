import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
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

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]} />}>
        <Route path="/requests" element={<RequestPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/records" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
