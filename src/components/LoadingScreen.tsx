"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          // Soft dissolve out — no wipe, just fade
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power1.inOut",
            onComplete,
          });
        },
      });

      // 1. Line draws left → right
      tl.to(lineRef.current, {
        scaleX: 1,
        duration: 1.6,
        ease: "power3.inOut",
        transformOrigin: "left center",
      });

      // 2. Counter ticks 0000 → 0100
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2.4,
          ease: "power1.inOut",
          onUpdate: function () {
            setCount(Math.round(this.targets()[0].val));
          },
        },
        "-=0.8"
      );

      // 3. Logo fades in — letter-spacing wide → tight
      tl.fromTo(
        logoRef.current,
        {
          opacity: 0,
          letterSpacing: "0.8em",
        },
        {
          opacity: 1,
          letterSpacing: "0.2em",
          duration: 2,
          ease: "power2.out",
        },
        "-=2" // overlaps with counter
      );

      // 4. Breathe — hold before exit
      tl.to({}, { duration: 0.8 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex flex-col items-center
                 justify-center bg-bg"
    >
      {/* Counter */}
      <span
        ref={counterRef}
        className="font-mono text-[#0a0a0a]/30 text-[10px]
                   tracking-[0.5em] mb-6 tabular-nums"
      >
        {String(count).padStart(4, "0")}
      </span>

      {/* The line */}
      <div className="relative w-48 h-px bg-[#0a0a0a]/10 mb-6">
        <div
          ref={lineRef}
          className="absolute inset-0 bg-[#0a0a0a] origin-left scale-x-0"
        />
      </div>

      {/* Logo */}
      <p
        ref={logoRef}
        className="font-display text-[#0a0a0a] text-sm font-light
                   opacity-0 tracking-[0.8em] uppercase"
      >
        Lumière
      </p>
    </div>
  );
}