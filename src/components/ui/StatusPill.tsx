interface StatusPillProps {
  text: string;
  fg: string;
  bg: string;
}

export function StatusPill({ text, fg, bg }: StatusPillProps) {
  return (
    <span className="osda-pill" style={{ color: fg, background: bg }}>
      {text}
    </span>
  );
}

// Mirrors mobLast's StatusColors object (ui/common/OsdaComponents.kt) so
// Record/Appeal status colors stay consistent across Web and Mobile.
const AMBER = { fg: "#916515", bg: "#fdf1d6" };
const GREEN = { fg: "#1a7945", bg: "#dcf5e3" };
const RED = { fg: "#c22b2b", bg: "#fbdfdf" };

export function recordStatusColors(status: string): { fg: string; bg: string } {
  switch (status.toUpperCase()) {
    case "RESOLVED":
      return GREEN;
    case "APPEALED":
      return AMBER;
    default:
      return AMBER; // PENDING and anything else reads as "active"
  }
}

export function appealStatusColors(status: string): { fg: string; bg: string } {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return GREEN;
    case "DENIED":
      return RED;
    default:
      return AMBER; // PENDING, UNDER_REVIEW
  }
}
