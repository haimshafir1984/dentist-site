import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default async function Footer() {
  const content = await getSiteContent();
  const { shared } = content;

  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="container py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold text-lg text-slate-900">{shared.doctorName}</div>
          <p className="text-slate-600 mt-2 text-sm">
            {shared.footerTagline}
          </p>
        </div>

        <div className="text-sm">
          <div className="font-semibold mb-2 text-slate-900">קישורים</div>
          <div className="flex flex-col gap-2">
            <Link className="text-slate-600 hover:text-sky-800" href="/">
              בית
            </Link>
            <Link className="text-slate-600 hover:text-sky-800" href="/about">
              אודות
            </Link>
            <Link className="text-slate-600 hover:text-sky-800" href="/treatments">
              תחומי טיפול
            </Link>
            <Link className="text-slate-600 hover:text-sky-800" href="/pricing">
              עלויות טיפול
            </Link>
            <Link className="text-slate-600 hover:text-sky-800" href="/publications">
              אקדמיה/פרסומים
            </Link>
            <Link className="text-slate-600 hover:text-sky-800" href="/contact">
              צור קשר
            </Link>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-semibold mb-2 text-slate-900">פרטים</div>
          <div className="text-slate-600 space-y-1">
            <div>כתובת: {shared.address}</div>
            <div>טלפון: {shared.phone}</div>
            <div>נייד: {shared.mobile}</div>
            <div>
              אימייל:{" "}
              <a
                href={`mailto:${shared.email}`}
                className="hover:text-sky-800 underline underline-offset-2"
              >
                {shared.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 text-xs text-slate-500">
        © {new Date().getFullYear()} {shared.doctorName}. {shared.footerDisclaimer}
      </div>
    </footer>
  );
}
