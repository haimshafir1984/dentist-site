"use client";

import { Children, useEffect, useRef, useState } from "react";

export default function StaggerReveal({
  children,
  className = "",
  staggerMs = 100
}: {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, i) => (
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(64px)",
            transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${i * staggerMs}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${i * staggerMs}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
