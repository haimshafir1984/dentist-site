import Link from "next/link";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import AdminEditHint from "@/components/AdminEditHint";
import { getSiteContent } from "@/lib/site-content";
import RevealOnScroll from "@/components/RevealOnScroll";
import StaggerReveal from "@/components/StaggerReveal";
import HeroParallax from "@/components/HeroParallax";
import {
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  ScanLine,
  Smile,
  PhoneCall,
  MapPin,
  LifeBuoy
} from "lucide-react";

export default async function HomePage() {
  const content = await getSiteContent();
  const { home, about, shared } = content;

  return (
    <>
      <AdminEditHint section="home" />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <HeroParallax imageUrl={home.heroBackgroundImageUrl} />

        <div className="container relative z-10 grid gap-10 md:grid-cols-2 items-center">
          <RevealOnScroll>
            <p className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold text-white/75 backdrop-blur-sm">
              {home.pill}
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
              {home.heroTitle}
            </h1>
            <p className="mt-5 text-white/70 text-lg md:text-xl leading-relaxed">
              {home.heroSubtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">קביעת תור</Link>
              <Link
                href="/treatments"
                className="rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-white/20 inline-flex items-center justify-center"
                style={{ minHeight: "44px" }}
              >
                {home.secondaryCta}
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              {home.valueCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
                >
                  <div className="text-sm font-bold text-[var(--accent-color)]">{card.title}</div>
                  <div className="text-xs text-white/55 mt-1">{card.text}</div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={150}>
            <div className="rounded-3xl border border-white/12 bg-white/8 p-8 backdrop-blur-sm shadow-[0_20px_60px_-24px_rgba(0,0,0,0.5)]">
              {home.heroImageUrl ? (
                <img
                  src={home.heroImageUrl}
                  alt={home.heroTitle}
                  className="mb-4 h-44 w-full rounded-2xl border border-white/15 object-cover"
                />
              ) : null}
              <div className="text-sm font-semibold text-[var(--accent-color)]">{home.clinicalTitle}</div>
              <ul className="mt-4 space-y-3 text-white/75">
                {home.clinicalBullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[var(--accent-color)]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-white/10 border border-white/12 p-5">
                <div className="font-semibold text-white">{home.professionalMessageTitle}</div>
                <p className="text-white/65 mt-1 text-sm leading-relaxed">{home.professionalMessage}</p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ─── TREATMENTS ──────────────────────────────────────────── */}
      <Section title={home.treatmentsTitle} subtitle={home.treatmentsSubtitle}>
        <StaggerReveal className="grid gap-4 md:grid-cols-3">
          {home.treatmentsCards.map((card, idx) => (
            <Card
              key={card.title}
              title={card.title}
              text={card.text}
              badge={card.badge}
              imageUrl={card.imageUrl}
              icon={card.imageUrl ? undefined : [Stethoscope, ShieldCheck, Sparkles, ScanLine, Smile, PhoneCall][idx % 6]}
            />
          ))}
        </StaggerReveal>

        <RevealOnScroll>
          <div className="mt-6">
            <Link
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-color)] hover:brightness-110 transition duration-300"
              href="/treatments"
            >
              לכל תחומי הטיפול
              <ArrowLeft size={14} />
            </Link>
          </div>
        </RevealOnScroll>
      </Section>

      {/* ─── ABOUT ───────────────────────────────────────────────── */}
      <Section title="המרפאה והרופא" subtitle={about.subtitle}>
        <RevealOnScroll>
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            <div className="surface-card overflow-hidden">
              {about.profileImageUrl ? (
                <img
                  src={about.profileImageUrl}
                  alt={about.introTitle}
                  className="h-full min-h-80 w-full object-cover"
                />
              ) : (
                <div className="h-full min-h-80 bg-gradient-to-br from-slate-100 to-slate-50 p-6 flex items-center justify-center text-slate-400">
                  תמונת פרופיל מקצועית
                </div>
              )}
            </div>
            <div className="surface-card p-7 flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900">{about.introTitle}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{about.introText}</p>
              <ul className="mt-5 space-y-2 text-slate-700 text-sm">
                {about.introBullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheck size={16} className="mt-0.5 text-[var(--accent-color)] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold transition duration-300 hover:gap-2"
                style={{ color: "var(--accent-color)" }}
              >
                להמשך קריאה
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </Section>

      {/* ─── PROCESS ─────────────────────────────────────────────── */}
      <Section title={home.processTitle} subtitle={home.processSubtitle}>
        <StaggerReveal className="grid gap-4 md:grid-cols-4">
          {home.processSteps.map((step) => (
            <div key={step.title} className="surface-card p-5">
              <div className="font-semibold text-[var(--accent-color)] text-xs mb-1 uppercase tracking-wider">
                {step.title.split(".")[0]}
              </div>
              <div className="font-bold text-slate-900">{step.title.split(".").slice(1).join(".")}</div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </StaggerReveal>
      </Section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────── */}
      <Section title={home.testimonialsTitle} subtitle={home.testimonialsSubtitle}>
        <RevealOnScroll>
          <Testimonials />
        </RevealOnScroll>
      </Section>

      {/* ─── FAQ ─────────────────────────────────────────────────── */}
      <Section title={home.faqTitle} subtitle={home.faqSubtitle}>
        <RevealOnScroll>
          <FAQ />
        </RevealOnScroll>
      </Section>

      {/* ─── CONTACT ─────────────────────────────────────────────── */}
      <Section title="יצירת קשר ומיקום" subtitle="אפשר לקבוע תור בטלפון או להשאיר פרטים ונחזור אליכם בהקדם.">
        <RevealOnScroll>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface-card p-6">
              <div className="space-y-3 text-slate-700">
                <div className="flex items-center gap-2">
                  <PhoneCall size={17} className="text-[var(--accent-color)] flex-shrink-0" />
                  <a href={`tel:${shared.phone}`} className="hover:text-slate-900 transition">
                    {shared.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <LifeBuoy size={17} className="text-[var(--accent-color)] flex-shrink-0" />
                  <a href={`tel:${shared.mobile}`} className="hover:text-slate-900 transition">
                    {shared.mobile}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-[var(--accent-color)] flex-shrink-0" />
                  <span>{shared.address}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">לתיאום ייעוץ</Link>
                <a href={`tel:${shared.phone}`} className="btn-secondary">חיוג מהיר</a>
              </div>
            </div>

            <div className="surface-card overflow-hidden">
              {shared.mapEmbedUrl ? (
                <iframe
                  src={shared.mapEmbedUrl}
                  title="clinic-map"
                  className="h-[320px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="h-[320px] flex items-center justify-center text-slate-400">
                  הוסף קישור מפה מתוך פאנל הניהול
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </Section>

      {/* ─── BOTTOM CTA ──────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container">
          <RevealOnScroll>
            <div
              className="rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              style={{ background: "linear-gradient(130deg, #0f2235 0%, #1a3a5c 50%, #0f2235 100%)", border: "1px solid rgba(201,163,92,0.2)", boxShadow: "0 20px 60px -20px rgba(0,0,0,0.6)" }}
            >
              <div>
                <div className="text-2xl font-bold text-white">{home.bottomCtaTitle}</div>
                <div className="mt-2 text-white/60">{home.bottomCtaSubtitle}</div>
              </div>
              <Link href="/contact" className="btn-primary whitespace-nowrap">
                {home.bottomCtaButton}
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
