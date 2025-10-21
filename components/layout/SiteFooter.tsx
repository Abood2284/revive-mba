import Link from "next/link";

const primaryLinks = [
  { label: "Programs", href: "/programs" },
  { label: "Guidance tools", href: "/#guidance" },
  { label: "Lead form", href: "/#lead-form" },
] as const;

const supportLinks = [
  { label: "Knowledge base", href: "#" },
  { label: "Counsellor handbook", href: "#" },
] as const;

const policyLinks = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
  { label: "Refund policy", href: "/refunds" },
] as const;

const contactChannels = [
  { label: "Email", value: "hello@revivemba.in" },
  { label: "Helpline", value: "+91 99876 54321" },
  { label: "WhatsApp", value: "+91 90000 11223" },
] as const;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="bg-[var(--color-secondary)] text-[var(--color-primary-foreground)]"
    >
      <div className="section-container py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[color:color-mix(in_srgb,var(--color-primary-foreground)_70%,white_30%)]">
              Revive MBA Platform
            </p>
            <h3 className="mt-3 text-2xl font-semibold">
              Conversion-focused discovery without the noise
            </h3>
            <p className="mt-4 max-w-md text-sm text-[color:color-mix(in_srgb,var(--color-primary-foreground)_65%,white_35%)]">
              Built for Indian professionals balancing work, family, and ambition. We help you choose confidently and act
              quickly.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                href="/lead-form"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary-foreground)] px-5 py-2 font-semibold text-[var(--color-secondary)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
              >
                Launch AI counsellor
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-primary-foreground)_30%,transparent)] px-5 py-2 font-semibold text-[var(--color-primary-foreground)] transition hover:border-[color:color-mix(in_srgb,var(--color-primary-foreground)_50%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
              >
                Book demo
              </Link>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-primary-foreground)_70%,white_30%)]">
                Explore
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-[color:color-mix(in_srgb,var(--color-primary-foreground)_80%,white_20%)]">
                {primaryLinks.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="transition hover:opacity-80">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-primary-foreground)_70%,white_30%)]">
                Resources
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-[color:color-mix(in_srgb,var(--color-primary-foreground)_80%,white_20%)]">
                {supportLinks.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="transition hover:opacity-80">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-2">
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-primary-foreground)_70%,white_30%)]">
                Contact
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-[color:color-mix(in_srgb,var(--color-primary-foreground)_80%,white_20%)]">
                {contactChannels.map((channel) => (
                  <li key={channel.label}>
                    <span className="font-semibold">{channel.label}:</span> {channel.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-[color:color-mix(in_srgb,var(--color-primary-foreground)_20%,transparent)] pt-6">
          <div className="flex flex-wrap items-center justify-between gap-6 text-xs text-[color:color-mix(in_srgb,var(--color-primary-foreground)_65%,white_35%)]">
            <p>(c) {currentYear} Revive MBA. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              {policyLinks.map((item) => (
                <Link key={item.label} href={item.href} className="transition hover:opacity-80">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
