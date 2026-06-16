import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const primaryLinks = [
  { label: "Programs", href: "/programs" },
  { label: "Guidance tools", href: "/#guidance" },
  { label: "Lead form", href: "/lead-form" },
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

const WHATSAPP_URL = "https://wa.me/919619412234";

type ContactItem =
  | {
      label: string;
      value: string;
      icon: typeof MapPin;
      href?: never;
    }
  | {
      label: string;
      value: string;
      icon: typeof Mail | typeof Phone | typeof MessageCircle;
      href: string;
    };

const contactItems: ContactItem[] = [
  {
    label: "Our Address",
    value: "Apeejay House, 3 Dinshaw Vacha Road, Churchgate, Mumbai - 400020",
    icon: MapPin,
  },
  {
    label: "Email Us",
    value: "support@reviveeducation.in",
    href: "mailto:support@reviveeducation.in",
    icon: Mail,
  },
  {
    label: "Call Us",
    value: "+91 96194 12234",
    href: "tel:+919619412234",
    icon: Phone,
  },
  {
    label: "Chat on WhatsApp",
    value: "+91 96194 12234",
    href: WHATSAPP_URL,
    icon: MessageCircle,
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0F0D3C] text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#3D38B8] via-[#534DEB] to-[#3D38B8]"
      />
      <div className="section-container relative py-16">
        <div className="mb-6 flex items-center gap-2 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/revive_education.png"
              alt="Revive MBA logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-sm"
              priority
            />
            <span className="text-base font-semibold text-white">
              Revive Education
            </span>
          </Link>
        </div>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#8E8AF0]">
              Revive Education Platform
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
              Honest guidance to help you choose the right program path
            </h3>
            <p className="mt-4 max-w-md text-sm text-[#CBCBF8]">
              We combine counsellors, curated data, and tools to make admissions
              decisions faster and clearer for working professionals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                href="/lead-form"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 font-semibold text-[#3D38B8] transition hover:bg-[#EFEEFF]"
              >
                Launch AI counsellor
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full border border-[#5C58C4] px-5 py-2 font-semibold text-white transition hover:border-white"
              >
                Talk to us
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8E8AF0]">
                Explore
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-[#E0E0FB]">
                {primaryLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8E8AF0]">
                Resources
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-[#E0E0FB]">
                {supportLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-2">
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8E8AF0]">
                Contact
              </h4>
              <ul className="mt-4 grid gap-4 text-sm text-[#E0E0FB] sm:grid-cols-2">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.label}
                      className="flex items-start gap-3 rounded-2xl border border-transparent bg-[#141148]/60 p-4 transition hover:border-[#3D38B8] hover:bg-[#141148]/80"
                    >
                      <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F1B60] text-[#8E8AF0]">
                        <Icon
                          className="h-4 w-4"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </span>
                      <div className="flex flex-col">
                        {item.href ? (
                          <a
                            href={item.href}
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.href.startsWith("http")
                                ? "noreferrer"
                                : undefined
                            }
                            className="flex flex-col space-y-1 transition hover:text-[#CFCDFD]"
                          >
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A6A4F3]">
                              {item.label}
                            </span>
                            <span className="text-sm text-white">
                              {item.value}
                            </span>
                          </a>
                        ) : (
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A6A4F3]">
                              {item.label}
                            </span>
                            <span className="text-sm text-white">
                              {item.value}
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-6 text-xs text-[#BEBDF7]">
            <p>© {currentYear} Revive Education. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              {policyLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-white"
                >
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
