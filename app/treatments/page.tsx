import Section from "@/components/Section";
import Card from "@/components/Card";
import Link from "next/link";
import AdminEditHint from "@/components/AdminEditHint";
import { getSiteContent } from "@/lib/site-content";

export default async function TreatmentsPage() {
  const { treatments } = await getSiteContent();

  return (
    <Section
      title={treatments.title}
      subtitle={treatments.subtitle}
    >
      <AdminEditHint section="treatments" />
      <div className="grid gap-4 md:grid-cols-3">
        {treatments.cards.map((t) => (
          <Card key={t.title} title={t.title} text={t.text} badge={t.badge} />
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-sky-100 p-6 bg-gradient-to-b from-sky-50/70 to-white">
        <div className="font-semibold text-sky-800">{treatments.suitableTitle}</div>
        <p className="text-slate-600 mt-2 leading-relaxed">
          {treatments.suitableText}
        </p>
      </div>

      <div className="mt-8">
        <Link href="/contact" className="btn-primary">
          {treatments.ctaLabel}
        </Link>
      </div>
    </Section>
  );
}
