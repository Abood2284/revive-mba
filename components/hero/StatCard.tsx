import type { ReactNode } from "react";

export interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  sublabel?: string;
}

export function StatCard({ icon, value, label, sublabel }: StatCardProps) {
  return (
    <div className="surface-card p-4 aspect-square flex flex-col justify-center items-center text-center">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[color:var(--color-accent)] text-2xl" aria-hidden>
          {icon}
        </span>
      </div>
      <span className="stat-value text-3xl mb-2">{value}</span>
      <p className="font-semibold text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_78%,white_22%)] leading-tight">
        {label}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)] leading-tight">
          {sublabel}
        </p>
      )}
    </div>
  );
}

export default StatCard;
