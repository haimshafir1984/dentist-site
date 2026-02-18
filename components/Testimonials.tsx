import { getSiteContent } from "@/lib/site-content";

export default async function Testimonials() {
  const testimonials = (await getSiteContent()).testimonials;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {testimonials.items.map((x, idx) => (
        <div
          key={`${x.name}-${idx}`}
          className="surface-card p-6 bg-gradient-to-b from-white to-sky-50/40"
        >
          <div className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
            {testimonials.badgeLabel}
          </div>
          <div className="text-sky-700 text-lg leading-none">“</div>
          <div className="text-slate-800 leading-relaxed mt-1">{x.text}</div>
          <div className="mt-3 text-sm font-semibold text-slate-700">{x.name}</div>
        </div>
      ))}
    </div>
  );
}
