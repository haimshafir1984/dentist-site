"use client";

import { useEffect, useRef, useState } from "react";

export default function SectionHeader({
  title,
  subtitle,
  dark = false
}: {
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="max-w-2xl">
      <h2
        className={`text-2xl md:text-3xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)"
        }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-3 leading-relaxed ${dark ? "text-white/65" : "text-slate-600"}`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition:
              "opacity 0.8s cubic-bezier(0.22,1,0.36,1) 130ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) 130ms"
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
