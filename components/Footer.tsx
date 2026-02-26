import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default async function Footer() {
  const content = await getSiteContent();
  const { shared } = content;

  return (
    <footer className="bg-[#0c1825]">
      <div className="container py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-semibold text-lg text-white">{shared.doctorName}</div>
          <p className="text-white/55 mt-2 text-sm leading-relaxed">
            {shared.footerTagline}
          </p>
        </div>

        <div className="text-sm">
          <div className="font-semibold mb-3 text-white/80">קישורים</div>
          <div className="flex flex-col gap-2">
            <Link className="text-white/50 hover:text-[var(--accent-color)] transition duration-200" href="/">בית</Link>
            <Link className="text-white/50 hover:text-[var(--accent-color)] transition duration-200" href="/about">אודות</Link>
            <Link className="text-white/50 hover:text-[var(--accent-color)] transition duration-200" href="/treatments">תחומי טיפול</Link>
            <Link className="text-white/50 hover:text-[var(--accent-color)] transition duration-200" href="/patient-instructions">מרכז הדרכה</Link>
            <Link className="text-white/50 hover:text-[var(--accent-color)] transition duration-200" href="/pricing">עלויות טיפול</Link>
            <Link className="text-white/50 hover:text-[var(--accent-color)] transition duration-200" href="/publications">אקדמיה/פרסומים</Link>
            <Link className="text-white/50 hover:text-[var(--accent-color)] transition duration-200" href="/contact">צור קשר</Link>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-semibold mb-3 text-white/80">פרטים</div>
          <div className="text-white/50 space-y-1.5">
            <div>כתובת: {shared.address}</div>
            <div>טלפון: {shared.phone}</div>
            <div>נייד: {shared.mobile}</div>
            <div>
              אימייל:{" "}
              <a
                href={`mailto:${shared.email}`}
                className="hover:text-[var(--accent-color)] underline underline-offset-2 transition duration-200"
              >
                {shared.email}
              </a>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs">
            {shared.social.facebook ? (
              <a href={shared.social.facebook} target="_blank" rel="noreferrer"
                className="text-white/40 hover:text-[var(--accent-color)] transition duration-200">Facebook</a>
            ) : null}
            {shared.social.instagram ? (
              <a href={shared.social.instagram} target="_blank" rel="noreferrer"
                className="text-white/40 hover:text-[var(--accent-color)] transition duration-200">Instagram</a>
            ) : null}
            {shared.social.linkedin ? (
              <a href={shared.social.linkedin} target="_blank" rel="noreferrer"
                className="text-white/40 hover:text-[var(--accent-color)] transition duration-200">LinkedIn</a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 container py-5 text-xs text-white/30">
        © {new Date().getFullYear()} {shared.doctorName}. {shared.footerDisclaimer}
        <span className="mx-2">|</span>
        <a href="#" className="hover:text-white/60 transition duration-200">
          הצהרת נגישות
        </a>
      </div>
    </footer>
  );
}
