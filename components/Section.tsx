export default function Section({
  title,
  subtitle,
  children,
  className = "",
  dark = false
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section className={`py-20 ${className}`}>
      <div className="container">
        <div className="max-w-2xl">
          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
            {title}
          </h2>
          {subtitle ? (
            <p className={`mt-3 leading-relaxed ${dark ? "text-white/65" : "text-slate-600"}`}>{subtitle}</p>
          ) : null}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
