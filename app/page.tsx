import Link from "next/link";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import AdminEditHint from "@/components/AdminEditHint";
import { getSiteContent } from "@/lib/site-content";

export default async function HomePage() {
  const content = await getSiteContent();
  const { home } = content;

  return (
    <>
      <AdminEditHint section="home" />
      <section className="py-14 md:py-20">
        <div className="container grid gap-10 md:grid-cols-2 items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {home.pill}
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
              {home.heroTitle}
            </h1>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              {home.heroSubtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-primary"
              >
                {home.primaryCta}
              </Link>
              <Link
                href="/treatments"
                className="btn-secondary"
              >
                {home.secondaryCta}
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {home.valueCards.map((card) => (
                <div key={card.title} className="surface-card p-4">
                  <div className="text-base font-bold text-sky-700">{card.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{card.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/80 to-white p-8 shadow-[0_15px_40px_-24px_rgba(2,132,199,0.5)]">
            <div className="text-sm font-semibold text-sky-800">{home.clinicalTitle}</div>
            <ul className="mt-4 space-y-3 text-slate-700">
              {home.clinicalBullets.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-5">
              <div className="font-semibold">{home.professionalMessageTitle}</div>
              <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                {home.professionalMessage}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section
        title={home.treatmentsTitle}
        subtitle={home.treatmentsSubtitle}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {home.treatmentsCards.map((card) => (
            <Card
              key={card.title}
              title={card.title}
              text={card.text}
              badge={card.badge}
            />
          ))}
        </div>

        <div className="mt-6">
          <Link
            className="text-sm font-semibold text-sky-800 underline decoration-sky-300 underline-offset-4"
            href="/treatments"
          >
            לכל תחומי הטיפול →
          </Link>
        </div>
      </Section>

      <Section
        title={home.processTitle}
        subtitle={home.processSubtitle}
      >
        <div className="grid gap-4 md:grid-cols-4">
          {home.processSteps.map((step) => (
            <div key={step.title} className="surface-card p-5">
              <div className="font-semibold text-slate-900">{step.title}</div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={home.testimonialsTitle} subtitle={home.testimonialsSubtitle}>
        <Testimonials />
      </Section>

      <Section
        title={home.faqTitle}
        subtitle={home.faqSubtitle}
      >
        <FAQ />
      </Section>

      <section className="py-12">
        <div className="container">
          <div className="rounded-3xl bg-gradient-to-r from-sky-800 to-cyan-700 text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_60px_-35px_rgba(8,145,178,0.9)]">
            <div>
              <div className="text-2xl font-bold">{home.bottomCtaTitle}</div>
              <div className="text-slate-200 mt-2">
                {home.bottomCtaSubtitle}
              </div>
            </div>
            <Link
              href="/contact"
              className="rounded-xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold hover:bg-sky-50 transition"
            >
              {home.bottomCtaButton}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
