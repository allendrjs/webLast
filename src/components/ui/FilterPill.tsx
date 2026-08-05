interface FilterPillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function FilterPill({ label, selected, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      className="osda-filter-pill"
      data-selected={selected}
      onClick={onClick}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
