"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SharedData = {
  doctorName: string;
  specialty: string;
  navCtaLabel: string;
  logoImageUrl?: string;
};

const navItems = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  { href: "/treatments", label: "תחומי טיפול" },
  { href: "/patient-instructions", label: "מרכז הדרכה" },
  { href: "/publications", label: "אקדמיה/פרסומים" },
  { href: "/contact", label: "צור קשר" },
  { href: "/admin", label: "Admin" }
] as const;

export default function NavbarClient({ shared }: { shared: SharedData }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0c1825] shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
          : "bg-[#0c1825]/80 backdrop-blur-md"
      }`}
    >
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl font-bold shadow-sm text-white/90"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            {shared.logoImageUrl ? (
              <img
                src={shared.logoImageUrl}
                alt={shared.doctorName}
                className="h-full w-full object-cover"
              />
            ) : (
              "BF"
            )}
          </span>
          <div className="leading-tight">
            <div className="font-semibold text-white text-sm">{shared.doctorName}</div>
            <div className="text-xs text-white/50">{shared.specialty}</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`relative pb-1 transition duration-300 text-sm font-medium ${
                pathname === item.href
                  ? "text-[var(--accent-color)]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {item.label}
              <span
                className={`pointer-events-none absolute -bottom-0.5 right-0 h-0.5 rounded-full transition-all duration-300`}
                style={{
                  backgroundColor: "var(--accent-color)",
                  width: pathname === item.href ? "100%" : "0",
                  opacity: pathname === item.href ? 1 : 0
                }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-primary px-4 py-2 hidden sm:inline-flex text-xs">
            {shared.navCtaLabel}
          </Link>

          <div className="md:hidden relative">
            <details className="group">
              <summary className="list-none h-10 w-10 cursor-pointer rounded-xl border border-white/20 bg-white/10 flex items-center justify-center text-white [&::-webkit-details-marker]:hidden">
                <span className="text-xl leading-none">☰</span>
              </summary>

              <div className="absolute top-12 left-0 w-[88vw] max-w-xs rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={`mobile-${item.href}`}
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={`rounded-xl px-3 py-3 text-sm font-medium min-h-12 flex items-center transition ${
                        pathname === item.href
                          ? "bg-slate-100 text-[var(--primary-color)]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <Link href="/contact" className="btn-primary mt-3 w-full justify-center">
                  {shared.navCtaLabel}
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
