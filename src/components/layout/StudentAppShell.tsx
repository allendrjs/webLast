import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/useAuth";
import { LogoutModal } from "./LogoutModal";
import { DashboardIcon, OffenseIcon, AppealIcon, ProfileIcon, LogoutIcon } from "./icons";

interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: (props: { className?: string }) => ReactNode;
}

// "Offenses" in the mockups is the student's own violation history, which
// already lives at /records (RecordPage) - the /offenses route is reserved
// for the admin/staff Offense catalog, so we deliberately don't reuse it here.
const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
  { key: "offenses", label: "Offenses", path: "/records", icon: OffenseIcon },
  { key: "appeals", label: "Appeals", path: "/appeals", icon: AppealIcon },
  { key: "profile", label: "Profile", path: "/profile", icon: ProfileIcon },
];

interface StudentAppShellProps {
  children: ReactNode;
}

// Responsive nav shell shared by every Student screen: a fixed bottom tab
// bar below 768px, a persistent left sidebar at/above it (see .osda-shell /
// .osda-bottom-nav / .osda-sidebar in global.css). Logout goes through a
// confirmation modal per the 5th mockup rather than acting immediately.
export function StudentAppShell({ children }: StudentAppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="osda-shell">
      <nav className="osda-sidebar">
        <p className="osda-sidebar__brand">OSD Access</p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className="osda-nav-item"
            data-active={isActive(item.path)}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="osda-nav-item__icon" />
            <span>{item.label}</span>
          </button>
        ))}
        <button
          type="button"
          className="osda-nav-item"
          onClick={() => setShowLogoutModal(true)}
          style={{ marginTop: "auto" }}
        >
          <LogoutIcon className="osda-nav-item__icon" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="osda-shell__content">
        <div className="osda-shell__inner">{children}</div>
      </div>

      <nav className="osda-bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className="osda-nav-item"
            data-active={isActive(item.path)}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="osda-nav-item__icon" />
            <span>{item.label}</span>
          </button>
        ))}
        <button type="button" className="osda-nav-item" onClick={() => setShowLogoutModal(true)}>
          <LogoutIcon className="osda-nav-item__icon" />
          <span>Logout</span>
        </button>
      </nav>

      {showLogoutModal && (
        <LogoutModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutModal(false)} />
      )}
    </div>
  );
}
