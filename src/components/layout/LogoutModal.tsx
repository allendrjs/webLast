import { LogoutIcon } from "./icons";
import { PrimaryButton, SecondaryButton } from "../ui/Button";

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

// Matches the 5th mockup: a centered confirmation dialog rather than an
// immediate logout on tap, so a stray nav click can't sign a student out.
export function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  return (
    <div className="osda-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
      <div className="osda-modal">
        <div className="osda-modal__icon">
          <LogoutIcon />
        </div>
        <p id="logout-modal-title" className="osda-section-title">
          Log out?
        </p>
        <p className="osda-muted-text">You'll need to sign in again to view your records.</p>
        <div className="osda-modal__actions">
          <PrimaryButton onClick={onConfirm}>Log Out</PrimaryButton>
          <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
        </div>
      </div>
    </div>
  );
}
