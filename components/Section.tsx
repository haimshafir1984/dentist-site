import SectionHeader from "./SectionHeader";

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
        <SectionHeader title={title} subtitle={subtitle} dark={dark} />
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
