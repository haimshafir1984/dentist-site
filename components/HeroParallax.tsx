"use client";

import { useEffect, useRef } from "react";

export default function HeroParallax({ imageUrl }: { imageUrl?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="absolute inset-[-15%] will-change-transform">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" />
      ) : null}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #0c1825 0%, #0d2137 50%, #0a1920 100%)" }}
      />
      <div className="absolute top-[-10%] right-[20%] w-[700px] h-[700px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(201,163,92,0.07) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)" }} />
    </div>
  );
}
