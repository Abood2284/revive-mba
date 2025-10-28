'use client';

import Link from "next/link";
import type { ReactNode } from "react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Stat {
  label: string;
  value: ReactNode;
  helper?: string;
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs?: Array<Breadcrumb>;
  actions?: ReactNode;
  stats?: Array<Stat>;
}

export function AdminPageHeader({
  title,
  description,
  eyebrow = "Revive Admin",
  breadcrumbs,
  actions,
  stats,
}: AdminPageHeaderProps) {
  return (
    <div className="relative">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-[28px] border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_94%,white_6%)] px-6 py-8 shadow-[0_32px_80px_-48px_rgba(16,19,26,0.55)] md:px-10 md:py-12">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute -top-24 right-6 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent)_35%,white_65%)_0%,transparent_70%)] opacity-80" />
            <div className="absolute -bottom-32 left-[-60px] h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-tertiary)_28%,transparent)_0%,transparent_72%)] opacity-70" />
            <div className="absolute inset-x-0 top-[45%] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] opacity-40" />
          </div>

          <div className="relative z-10 space-y-6 md:space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                {eyebrow ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_86%,white_14%)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                    <span className="inline-block h-2 w-2 rounded-sm bg-[color:var(--color-accent)]" />
                    {eyebrow}
                  </span>
                ) : null}

                {breadcrumbs && breadcrumbs.length > 0 ? (
                  <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:color-mix(in_srgb,var(--color-secondary)_58%,white_42%)]">
                      {breadcrumbs.map(({ label, href }, index) => (
                        <li key={`${label}-${index}`} className="flex items-center gap-2">
                          {href ? (
                            <Link
                              href={href}
                              className="transition hover:text-[color:var(--color-secondary)]"
                            >
                              {label}
                            </Link>
                          ) : (
                            <span className="text-[color:var(--color-secondary)]">{label}</span>
                          )}
                          {index < breadcrumbs.length - 1 ? (
                            <span className="text-[color:color-mix(in_srgb,var(--color-secondary)_32%,white_68%)]">
                              —
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}

                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-[color:var(--color-secondary)] md:text-4xl">
                    {title}
                  </h1>
                  {description ? (
                    <p className="max-w-2xl text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                      {description}
                    </p>
                  ) : null}
                </div>
              </div>

              {actions ? (
                <div className="flex flex-wrap items-center gap-3">{actions}</div>
              ) : null}
            </div>

            {stats && stats.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map(({ label, value, helper }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_90%,white_10%)] px-6 py-5 shadow-[0_18px_48px_-32px_rgba(16,19,26,0.45)]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                      {label}
                    </p>
                    <div className="mt-3 text-3xl font-bold text-[color:var(--color-secondary)]">
                      {value}
                    </div>
                    {helper ? (
                      <p className="mt-2 text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                        {helper}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPageHeader;
