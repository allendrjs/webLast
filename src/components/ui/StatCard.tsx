interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
}

export function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div className="osda-stat-card">
      <p className="osda-stat-card__value" style={color ? { color } : undefined}>
        {value}
      </p>
      <p className="osda-stat-card__label">{label}</p>
    </div>
  );
}
