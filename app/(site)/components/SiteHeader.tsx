"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DropdownItem = {
  title: string;
  description: string;
  href: string;
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
        description: "Browse our complete catalog of MBA and PGDM programs",
        href: "/programs",
      },
      {
        title: "Online MBA",
        description: "Flexible online MBA programs with live sessions",
        href: "/programs?type=online-mba",
      },
      {
        title: "Executive MBA",
        description: "Advanced programs for working professionals",
        href: "/programs?type=executive-mba",
      },
      {
        title: "PGDM Programs",
        description: "Post Graduate Diploma in Management specializations",
        href: "/programs?type=pgdm",
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
        description: "Real outcomes from our students and alumni",
        href: "/#success-stories",
      },
      {
        title: "ROI Calculator",
        description: "Calculate your return on investment",
        href: "/#roi-calculator",
      },
      {
        title: "Career Support",
        description: "Comprehensive career guidance and placement support",
        href: "/#career-support",
      },
    ],
  },
  {
    label: "Guidance Tools",
    href: "/#guidance",
    hasDropdown: true,
    dropdown: [
      {
        title: "Program Finder",
        description: "AI-powered program recommendations",
        href: "/#program-finder",
      },
      {
        title: "Scholarship Finder",
        description: "Discover available scholarships and financial aid",
        href: "/#scholarship-finder",
      },
      {
        title: "Career Assessment",
        description: "Evaluate your career goals and growth potential",
        href: "/#career-assessment",
      },
    ],
  },
];

function useScrollLock() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

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
  const isScrolled = useScrollLock();

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
        d="M19 9l-7 7-7-7"
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[var(--surface-subtle)]/96 backdrop-blur"
          : "border-b border-transparent bg-[color:color-mix(in_srgb,var(--surface-subtle)_90%,white_10%)]/80"
      }`}
    >
      <div className="section-container flex h-16 items-center justify-between gap-6 md:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="font-semibold tracking-tight text-[color:var(--color-secondary)] md:text-lg"
        >
          Revive
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)] md:flex">
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
                className={`flex items-center space-x-1 rounded-full px-3 py-1.5 transition-colors ${
                  activeDropdown === item.label
                    ? "bg-[color:var(--color-secondary)] text-[var(--color-primary-foreground)]"
                    : "hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_15%,transparent)] hover:text-[color:var(--color-secondary)]"
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && <ChevronDownIcon />}
              </Link>

              {/* Desktop Dropdown */}
              {item.hasDropdown && activeDropdown === item.label && (
                <div className="absolute left-0 top-full mt-2 w-80 rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[var(--surface-subtle)] shadow-xl">
                  <div className="p-6">
                    <div className="grid gap-4">
                      {item.dropdown?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.title}
                          href={dropdownItem.href}
                          className="block rounded-lg p-3 transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)]"
                        >
                          <h3 className="font-semibold text-[color:var(--color-secondary)]">
                            {dropdownItem.title}
                          </h3>
                          <p className="mt-1 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                            {dropdownItem.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/lead-form"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            Get AI recommendations
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] px-4 py-2 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] hover:text-[color:var(--color-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            Browse programs
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[var(--surface-subtle)] md:hidden">
          <div className="px-4 py-6 space-y-4">
            {navigationItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block text-base font-medium text-[color:var(--color-secondary)]"
                >
                  {item.label}
                </Link>
                {item.hasDropdown && item.dropdown && (
                  <div className="mt-2 ml-4 space-y-2">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.title}
                        href={dropdownItem.href}
                        className="block text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]"
                      >
                        {dropdownItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <Link
                href="/lead-form"
                className="block w-full rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-accent-foreground)]"
              >
                Get AI recommendations
              </Link>
              <Link
                href="/programs"
                className="block w-full rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] px-4 py-2 text-center text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)]"
              >
                Browse programs
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default SiteHeader;
