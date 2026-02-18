import Section from "@/components/Section";
import AdminEditHint from "@/components/AdminEditHint";
import { getSiteContent } from "@/lib/site-content";

export default async function AboutPage() {
  const { about } = await getSiteContent();

  return (
    <Section
      title={about.title}
      subtitle={about.subtitle}
    >
      <AdminEditHint section="about" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-card p-6">
          {about.profileImageUrl ? (
            <img
              src={about.profileImageUrl}
              alt={about.introTitle}
              className="mb-4 h-52 w-full rounded-2xl border border-slate-200 object-cover"
            />
          ) : null}
          <h3 className="font-semibold text-lg">{about.introTitle}</h3>
          <p className="mt-3 text-slate-600 leading-relaxed">
            {about.introText}
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            {about.introBullets.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="surface-card p-6 bg-gradient-to-b from-sky-50/70 to-white">
          <h3 className="font-semibold text-lg">{about.approachTitle}</h3>
          <p className="mt-3 text-slate-600 leading-relaxed">
            {about.approachText}
          </p>
          <div className="mt-4 grid gap-3">
            {about.approachItems.map((item) => (
              <div key={item.title} className="rounded-xl bg-white border border-slate-200 p-4">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-slate-600 mt-1">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/70 to-white p-6">
        <h3 className="text-xl font-bold text-slate-900">{about.principlesTitle}</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {about.principles.map((item) => (
            <div key={item.title} className="rounded-xl bg-white border border-slate-200 p-4">
              <div className="font-semibold">{item.title}</div>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
