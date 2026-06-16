"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { MessageCircle } from "lucide-react";

type DropdownItem = {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  external?: boolean;
  isSectionHeader?: boolean;
  subItems?: DropdownItem[];
};

type NavigationItem = {
  label: string;
  href: string;
  hasDropdown: boolean;
  dropdown?: DropdownItem[];
};

const navigationItems: NavigationItem[] = [
  {
    label: "Programs",
    href: "/programs",
    hasDropdown: true,
    dropdown: [
      {
        title: "All Programs",
        description:
          "Browse our complete catalog of Master's and Bachelors programs.",
        href: "/programs",
      },
      {
        title: "All Universities",
        description: "Browse our complete catalog of universities.",
        href: "/universities",
      },
      {
        title: "Masters Programs",
        description: "MBA, PGDM, and Master's degrees from top universities.",
        href: "/programs?category=masters",
      },
      {
        title: "Bachelors Programs",
        description: "BBA, B.Com, B.Sc and other undergraduate degrees.",
        href: "/programs?category=bachelors",
      },
      {
        title: "Global Programs",
        description: "International programs from top global universities.",
        href: "/programs?institution=umas",
      },
    ],
  },
  {
    label: "Why Revive",
    href: "/#why-revive",
    hasDropdown: true,
    dropdown: [
      {
        title: "Success Stories",
        description: "See real outcomes from learners we have supported.",
        href: "#testimonials",
      },
      {
        title: "Career Support",
        description: "Placement prep, mentoring, and profile positioning.",
        href: "#contact",
      },
    ],
  },
  {
    label: "Guidance Tools",
    href: "/lead-form",
    hasDropdown: true,
    dropdown: [
      {
        title: "Program Finder",
        description: "Answer a few questions for a matching shortlist.",
        href: "/#program-finder",
      },
      {
        title: "Career Assessment",
        description: "Align program choices with your next role move.",
        href: "/lead-form",
      },
      {
        title: "Chat on WhatsApp",
        description: "Message our counsellor for quick clarifications.",
        href: "https://wa.me/919619412234",
        icon: MessageCircle,
        external: true,
      },
    ],
  },
];

function useScrollState() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
}

export function SiteHeader() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollState();

  const handleHoverStart = (label: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveDropdown(label);
  };

  const handleHoverEnd = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
    setHoverTimeout(timeout);
  };

  const ChevronDownIcon = () => (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 9l6 6 6-6"
      />
    </svg>
  );

  const MenuIcon = () => (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const headerClasses = isScrolled
    ? "border-b border-[#3D38B8] bg-white shadow-[0_10px_30px_-20px_rgba(16,19,26,0.35)]"
    : "bg-white";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${headerClasses}`}
    >
      <div className="section-container flex h-16 items-center justify-between gap-6 md:h-20">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-[#3D38B8] md:gap-3 md:text-lg"
        >
          <img
            src="/images/revive_education.png"
            alt="Revive Education"
            className="h-8 w-auto sm:h-9"
          />
          <span className="hidden sm:inline whitespace-nowrap">
            Revive Education
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium text-[#514EA1] md:flex">
          {navigationItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() =>
                item.hasDropdown && handleHoverStart(item.label)
              }
              onMouseLeave={handleHoverEnd}
            >
              <Link
                href={item.href}
                className={`flex items-center space-x-1 rounded-full px-3 py-1.5 transition ${
                  activeDropdown === item.label
                    ? "bg-[#3D38B8] text-white"
                    : "hover:bg-[#514EA101] hover:text-[#3D38B8]"
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && <ChevronDownIcon />}
              </Link>

              {item.hasDropdown && activeDropdown === item.label && (
                <div className="absolute left-0 top-full mt-3 w-[22rem] rounded-xl border border-[#3D38B8] bg-white p-4 shadow-[0_24px_36px_-28px_rgba(16,19,26,0.5)]">
                  <div className="grid gap-3">
                    {item.dropdown?.map((dropdownItem, index) => {
                      // Render section header
                      if (dropdownItem.isSectionHeader) {
                        return (
                          <div key={dropdownItem.title}>
                            <div className="border-t border-[#3D38B8]/10 px-3 pt-3 pb-3 first:border-t-0 first:pt-0">
                              <h3 className="text-sm font-semibold text-[#3D38B8]">
                                {dropdownItem.title}
                              </h3>
                              {dropdownItem.description && (
                                <p className="mt-1 text-xs text-[#514EA1]">
                                  {dropdownItem.description}
                                </p>
                              )}
                            </div>
                            {dropdownItem.subItems && (
                              <div>
                                {dropdownItem.subItems.map((subItem) => {
                                  const Icon = subItem.icon;
                                  const content = (
                                    <div className="flex items-start gap-3">
                                      {Icon && (
                                        <span className="mt-0.5 text-[#3D38B8]">
                                          <Icon
                                            className="h-4 w-4"
                                            strokeWidth={1.75}
                                            aria-hidden
                                          />
                                        </span>
                                      )}
                                      <div>
                                        <h4 className="text-sm font-semibold text-[#3D38B8]">
                                          {subItem.title}
                                        </h4>
                                        {subItem.description && (
                                          <p className="mt-1 text-xs text-[#514EA1]">
                                            {subItem.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );

                                  return subItem.external ? (
                                    <a
                                      key={subItem.title}
                                      href={subItem.href}
                                      className="block rounded-lg p-3 transition hover:bg-[#514EA10F]"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {content}
                                    </a>
                                  ) : (
                                    <Link
                                      key={subItem.title}
                                      href={subItem.href}
                                      className="block rounded-lg p-3 transition hover:bg-[#514EA10F]"
                                    >
                                      {content}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Render regular dropdown item
                      const Icon = dropdownItem.icon;
                      const content = (
                        <div className="flex items-start gap-3">
                          {Icon && (
                            <span className="mt-0.5 text-[#3D38B8]">
                              <Icon
                                className="h-4 w-4"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </span>
                          )}
                          <div>
                            <h3 className="text-sm font-semibold text-[#3D38B8]">
                              {dropdownItem.title}
                            </h3>
                            <p className="mt-1 text-xs text-[#514EA1]">
                              {dropdownItem.description}
                            </p>
                          </div>
                        </div>
                      );

                      return dropdownItem.external ? (
                        <a
                          key={dropdownItem.title}
                          href={dropdownItem.href}
                          className="block rounded-lg p-3 transition hover:bg-[#514EA10F]"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          key={dropdownItem.title}
                          href={dropdownItem.href}
                          className="block rounded-lg p-3 transition hover:bg-[#514EA10F]"
                        >
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/lead-form"
            className="glow-cta relative inline-flex items-center justify-center gap-2 rounded-full bg-[#3D38B8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <img
                src="/images/icons8-gift-96.png"
                alt="Gift icon"
                className="h-5 w-5 shrink-0"
              />
              <span>Get AI recommendations</span>
            </span>
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full border border-[#3D38B8] px-4 py-2 text-sm font-semibold text-[#3D38B8] transition hover:bg-[#3D38B8] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            Contact us
          </Link>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[#3D38B8] text-[#3D38B8] md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-[#3D38B8] bg-white text-sm text-[#514EA1] md:hidden">
          <div className="space-y-4 px-6 py-6">
            {navigationItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block text-base font-semibold text-[#3D38B8]"
                >
                  {item.label}
                </Link>
                {item.hasDropdown && item.dropdown && (
                  <div className="mt-2 ml-3 space-y-2">
                    {item.dropdown.map((dropdownItem) => {
                      if (dropdownItem.isSectionHeader) {
                        return (
                          <div key={dropdownItem.title}>
                            <div className="border-t border-[#3D38B8]/10 px-3 pt-3 pb-3 first:border-t-0 first:pt-0">
                              <h3 className="text-sm font-semibold text-[#3D38B8]">
                                {dropdownItem.title}
                              </h3>
                              {dropdownItem.description && (
                                <p className="mt-1 text-xs text-[#514EA1]">
                                  {dropdownItem.description}
                                </p>
                              )}
                            </div>
                            {dropdownItem.subItems && (
                              <div>
                                {dropdownItem.subItems.map((subItem) =>
                                  subItem.external ? (
                                    <a
                                      key={subItem.title}
                                      href={subItem.href}
                                      className="block rounded-lg px-3 py-2 text-sm text-[#514EA1] transition hover:bg-[#514EA10F] hover:text-[#3D38B8]"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {subItem.title}
                                    </a>
                                  ) : (
                                    <Link
                                      key={subItem.title}
                                      href={subItem.href}
                                      className="block rounded-lg px-3 py-2 text-sm text-[#514EA1] transition hover:bg-[#514EA10F] hover:text-[#3D38B8]"
                                    >
                                      {subItem.title}
                                    </Link>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return dropdownItem.external ? (
                        <a
                          key={dropdownItem.title}
                          href={dropdownItem.href}
                          className="block rounded-lg px-3 py-2 text-sm text-[#514EA1] transition hover:bg-[#514EA10F] hover:text-[#3D38B8]"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {dropdownItem.title}
                        </a>
                      ) : (
                        <Link
                          key={dropdownItem.title}
                          href={dropdownItem.href}
                          className="block rounded-lg px-3 py-2 text-sm text-[#514EA1] transition hover:bg-[#514EA10F] hover:text-[#3D38B8]"
                        >
                          {dropdownItem.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <div className="space-y-2 pt-3">
              <Link
                href="/lead-form"
                className="glow-cta relative flex w-full items-center justify-center gap-2 rounded-full bg-[#3D38B8] px-4 py-2 text-center font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <img
                    src="/images/icons8-gift-96.png"
                    alt="Gift icon"
                    className="h-5 w-5 shrink-0"
                  />
                  <span>Get AI recommendations</span>
                </span>
              </Link>
              <Link
                href="/#contact"
                className="block w-full rounded-full border border-[#3D38B8] px-4 py-2 text-center font-semibold text-[#3D38B8] transition hover:bg-[#3D38B8] hover:text-white"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default SiteHeader;
