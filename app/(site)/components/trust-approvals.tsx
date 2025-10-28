// components/sections/trust-approvals.tsx
"use client";
import * as React from "react";

/**
 * Brand tokens — adjust hexes to match your logo exactly.
 * Blues build structure; red is a precise accent only.
 */
export function TrustApprovalsSection({
  title = "Approvals & quality signals",
  subtitle = "We list only accredited programs and surface the right badges clearly.",
  items = DEFAULT_POINTS,
  showExplainer = true,
  badges = DEFAULT_BADGES, // use this to show sample university badges
}: {
  title?: string;
  subtitle?: string;
  items?: Point[];
  showExplainer?: boolean;
  badges?: UniBadge[];
}) {
  return (
    <section
      className="w-full bg-white"
      style={
        {
          ["--rev-blue-800" as any]: "#2E3699",
          ["--rev-blue-700" as any]: "#3F49B7",
          ["--rev-blue-600" as any]: "#4E5AD6",
          ["--rev-blue-200" as any]: "#CBD4FF",
          ["--rev-blue-100" as any]: "#E8EBFB",
          ["--rev-blue-50" as any]: "#F4F6FE",
          ["--rev-red-600" as any]: "#D6463A",
          ["--rev-red-100" as any]: "#FCE8E6",
          ["--rev-red-50" as any]: "#FEF4F3",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-neutral-800"
            style={{
              borderColor: "var(--rev-blue-100)",
              background: "var(--rev-blue-50)",
            }}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--rev-blue-700)" }}
            />
            Trust signals
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-snug text-neutral-900 md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-neutral-600">{subtitle}</p>
        </header>

        {/* Three key points */}
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((p) => (
            <li
              key={p.k}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
              style={{ borderColor: "var(--rev-blue-100)" }}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "var(--rev-blue-50)",
                    color: "var(--rev-blue-700)",
                  }}
                >
                  {p.icon}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                    {p.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Example badge row (optional) */}
        <div
          className="mt-10 rounded-2xl border p-5"
          style={{
            borderColor: "var(--rev-blue-100)",
            background:
              "linear-gradient(180deg, var(--rev-blue-50), rgba(255,255,255,0.85))",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--rev-blue-800)" }}
              >
                How badges appear on program cards
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                NAAC grade, UGC-DEB approval, and optional NIRF rank are shown
                consistently.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <Badge key={b.label} tone={b.tone}>
                  {b.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Explainer (accordion) */}
        {showExplainer && <ApprovalsExplainer />}
      </div>
    </section>
  );
}

/* ---------- content types ---------- */
type Point = { k: number; title: string; body: string; icon: React.ReactNode };
type UniBadge = { label: string; tone?: "blue" | "slate" | "red" };

/* ---------- defaults ---------- */
const DEFAULT_POINTS: Point[] = [
  {
    k: 1,
    title: "UGC-DEB approval",
    body: "Programs listed are approved for online/distance delivery under UGC-DEB. We verify against official notices and prospectuses.",
    icon: <IconShield />,
  },
  {
    k: 2,
    title: "NAAC grade clarity",
    body: "University-level NAAC grades (A/A+/A++) are displayed as published. They’re quality signals—not direct guarantees of outcomes.",
    icon: <IconLaurel />,
  },
  {
    k: 3,
    title: "NIRF rank (where applicable)",
    body: "We show current NIRF positions when relevant. Not all online-first institutions participate every year.",
    icon: <IconRank />,
  },
];

const DEFAULT_BADGES: UniBadge[] = [
  { label: "UGC-DEB", tone: "blue" },
  { label: "NAAC A+", tone: "blue" },
  { label: "NIRF #42", tone: "slate" },
];

/* ---------- UI atoms ---------- */
function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "slate" | "red";
}) {
  const styleMap = {
    blue: {
      bg: "var(--rev-blue-50)",
      fg: "var(--rev-blue-700)",
      br: "var(--rev-blue-100)",
    },
    slate: { bg: "#F3F4F6", fg: "#334155", br: "#E5E7EB" },
    red: {
      bg: "var(--rev-red-50)",
      fg: "var(--rev-red-600)",
      br: "var(--rev-red-100)",
    },
  }[tone];
  return (
    <span
      className="rounded-md px-2.5 py-1 text-xs font-medium"
      style={{
        backgroundColor: styleMap.bg,
        color: styleMap.fg,
        border: `1px solid ${styleMap.br}`,
      }}
    >
      {children}
    </span>
  );
}

function ApprovalsExplainer() {
  const [open, setOpen] = React.useState(false);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="mt-8 group rounded-2xl border bg-white transition"
      style={{ borderColor: "var(--rev-blue-100)" }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--rev-blue-700)" }}
          />
          <span className="text-sm font-semibold text-neutral-900">
            What do these approvals mean?
          </span>
        </div>
        <span
          aria-hidden
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-sm font-bold transition"
          style={{
            color: open ? "white" : "var(--rev-blue-700)",
            backgroundColor: open
              ? "var(--rev-blue-700)"
              : "var(--rev-blue-50)",
            border: "1px solid var(--rev-blue-100)",
          }}
        >
          {open ? "–" : "+"}
        </span>
      </summary>
      <div className="px-5 pb-5">
        <ul className="space-y-3 text-sm leading-relaxed text-neutral-800">
          <li>
            <strong style={{ color: "var(--rev-blue-800)" }}>UGC-DEB</strong>{" "}
            authorizes universities to offer programs in online/distance mode.
            Without it, online delivery isn’t valid.
          </li>
          <li>
            <strong style={{ color: "var(--rev-blue-800)" }}>NAAC grade</strong>{" "}
            reflects institutional quality. It’s university-wide, not
            program-specific.
          </li>
          <li>
            <strong style={{ color: "var(--rev-blue-800)" }}>NIRF</strong> is an
            annual ranking framework; good as directional context, not a sole
            decision criterion.
          </li>
        </ul>
        <p
          className="mt-3 rounded-lg border px-3 py-2 text-xs"
          style={{
            color: "var(--rev-red-600)",
            backgroundColor: "var(--rev-red-50)",
            borderColor: "var(--rev-red-100)",
          }}
        >
          Disclaimer: We display badges as published by official sources. Always
          check the latest notifications before applying.
        </p>
      </div>
    </details>
  );
}

/* ---------- inline icons (inherit brand color from containers) ---------- */
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconLaurel() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5c-2.5 5-2.5 9 0 14M12 5c2.5 5 2.5 9 0 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 7c1.5 1 3 .8 4-.4M5 11c1.5 1 3 .8 4-.4M5 15c1.5 1 3 .8 4-.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19 7c-1.5 1-3 .8-4-.4M19 11c-1.5 1-3 .8-4-.4M19 15c-1.5 1-3 .8-4-.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconRank() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20V8m6 12V4m6 16v-6m4 6H2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.5 4.5l1.8-1.8 1.8 1.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
