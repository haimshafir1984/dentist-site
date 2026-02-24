import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

const navItems = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  { href: "/treatments", label: "תחומי טיפול" },
  { href: "/patient-instructions", label: "מרכז הדרכה" },
  { href: "/publications", label: "אקדמיה/פרסומים" },
  { href: "/contact", label: "צור קשר" },
  { href: "/admin", label: "Admin" }
] as const;

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="text-slate-600 hover:text-sky-800 transition duration-300 font-medium"
  >
    {label}
  </Link>
);

export default async function Navbar() {
  const content = await getSiteContent();
  const { shared } = content;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-sky-700 text-white font-bold shadow-sm">
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
            <div className="font-semibold">{shared.doctorName}</div>
            <div className="text-xs text-slate-500">{shared.specialty}</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="btn-primary px-4 py-2 hidden sm:inline-flex"
          >
            {shared.navCtaLabel}
          </Link>

          <div className="md:hidden relative">
            <details className="group">
              <summary className="list-none h-10 w-10 cursor-pointer rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-700 [&::-webkit-details-marker]:hidden">
                <span className="text-xl leading-none">☰</span>
              </summary>

              <div className="absolute top-12 left-0 w-[88vw] max-w-xs rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={`mobile-${item.href}`}
                      href={item.href}
                      className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-12 flex items-center"
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
