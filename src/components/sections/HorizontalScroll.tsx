"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const panels = [
  {
    src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80",
    alt: "Waterfall",
    location: "Iceland",
    year: "2024",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    alt: "Mountain peak",
    location: "Switzerland",
    year: "2024",
  },
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    alt: "Aerial coast",
    location: "Norway",
    year: "2023",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    alt: "Foggy valley",
    location: "Scotland",
    year: "2023",
  },
  {
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80",
    alt: "Forest light",
    location: "Canada",
    year: "2022",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      // ── Section heading reveal before pin starts ───────────────
      gsap.from(".hscroll-heading", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // ── Main horizontal scroll ─────────────────────────────────
      const totalWidth = track.scrollWidth - window.innerWidth;

      const horizontalTween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Drive progress bar
            if (progressRef.current) {
              gsap.set(progressRef.current, {
                scaleX: self.progress,
                transformOrigin: "left center",
              });
            }
          },
        },
      });

      // ── Each panel fades in as it enters view ─────────────────
      const panelEls = track.querySelectorAll(".h-panel");

      panelEls.forEach((panel, i) => {
        if (i === 0) return; // first panel already visible

        const img = panel.querySelector(".panel-img");
        const meta = panel.querySelector(".panel-meta");

        gsap.from([img, meta], {
          opacity: 0,
          x: 40,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontalTween,
            start: "left 80%",
            once: true,
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg">

      {/* Section label — visible before pin */}
      <div className="hscroll-heading px-6 pt-24 pb-8 md:px-16
                       flex items-end justify-between">
        <div>
          <p className="mb-3 font-mono text-[10px] tracking-[0.4em]
                         text-[#0a0a0a]/35 uppercase">
            In The Field
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)]
                          font-light leading-none tracking-tight text-[#0a0a0a]">
            The Work
          </h2>
        </div>
        <span className="font-mono text-[10px] tracking-[0.3em]
                          text-[#0a0a0a]/25 uppercase">
          Drag or scroll →
        </span>
      </div>

      {/* Progress bar */}
      <div className="mx-6 mb-8 h-px bg-[#0a0a0a]/08 md:mx-16">
        <div
          ref={progressRef}
          className="h-full bg-[#0a0a0a]/40 origin-left scale-x-0"
        />
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ width: `${panels.length * 85}vw` }}
      >
        {panels.map((panel, i) => (
          <div
            key={i}
            className="h-panel relative shrink-0 overflow-hidden"
            style={{ width: "82vw", height: "70vh", marginRight: "2vw" }}
          >
            {/* Image */}
            <div className="panel-img absolute inset-0">
              <Image
                src={panel.src}
                alt={panel.alt}
                fill
                className="object-cover"
                sizes="82vw"
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0
                              bg-linear-to-t from-black/30 to-transparent" />
            </div>

            {/* Panel meta — bottom left */}
            <div className="panel-meta absolute bottom-6 left-6
                             flex items-end justify-between w-full pr-6 z-10">
              <div>
                <p className="font-mono text-white/50 text-[9px]
                               tracking-[0.4em] uppercase mb-1">
                  {panel.location}
                </p>
                <p className="font-display text-white text-2xl
                               font-light tracking-tight">
                  {panel.alt}
                </p>
              </div>

              {/* Index */}
              <span className="font-mono text-white/30 text-[10px]
                                tracking-[0.3em]">
                {String(i + 1).padStart(2, "0")} /
                {String(panels.length).padStart(2, "0")}
              </span>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}