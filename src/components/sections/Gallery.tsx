"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    alt: "Portrait in light",
    location: "Paris, 2024",
    width: 280,
    height: 380,
    left: "6%",
    rotate: -3,
  },
  {
    src: "https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=800&q=80",
    alt: "Misty mountains",
    location: "Iceland, 2024",
    width: 340,
    height: 260,
    left: "52%",
    rotate: 2,
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    alt: "Foggy valley",
    location: "Scotland, 2023",
    width: 260,
    height: 340,
    left: "28%",
    rotate: -2,
  },
  {
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
    alt: "Forest light",
    location: "Canada, 2023",
    width: 300,
    height: 400,
    left: "62%",
    rotate: 4,
  },
  {
    src: "https://images.unsplash.com/photo-1490750967868-88df5691cc87?w=800&q=80",
    alt: "Spring blossoms",
    location: "Tokyo, 2023",
    width: 320,
    height: 240,
    left: "8%",
    rotate: 3,
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    alt: "Lake reflection",
    location: "Norway, 2022",
    width: 270,
    height: 360,
    left: "38%",
    rotate: -4,
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80",
    alt: "Hands and bokeh",
    location: "Milan, 2022",
    width: 290,
    height: 380,
    left: "68%",
    rotate: -2,
  },
  {
    src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    alt: "Car on road",
    location: "LA, 2022",
    width: 360,
    height: 260,
    left: "18%",
    rotate: 2,
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Change the recede ScrollTrigger in useEffect:

      itemRefs.current.forEach((item, i) => {
        if (!item) return;

        const imageEl = item.querySelector(".image-inner");

        // ── Appear: whole item fades in ────────────────────────────
        gsap.from(item, {
          opacity: 0,
          y: 30,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            once: true,
          },
        });

        // ── Recede: ONLY the image scales down, not the label ──────
        gsap.to(imageEl, {
          scale: 0.94,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top 20%",
            end: "top -20%",
            scrub: 1.5,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg px-6 py-24 md:px-12"
    >
      {/* Section header */}
      <div className="mb-24 flex items-end justify-between">
        <div>
          <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-[#0a0a0a]/35 uppercase">
            Selected Work
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-light tracking-tight text-[#0a0a0a]">
            The Collection
          </h2>
        </div>
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#0a0a0a]/25 uppercase">
          {String(photos.length).padStart(2, "0")} Images
        </span>
      </div>

      {/* Scattered layout — each image is positioned independently */}
      <div
        className="relative w-full"
        style={{ height: `${photos.length * 340}px` }}
      >
        {photos.map((photo, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="group absolute cursor-pointer"
            style={{
              width: photo.width,
              height: photo.height,
              left: photo.left,
              top: `${i * 320}px`,
              willChange: "transform, opacity",
            }}
          >
            {/* Image */}
            <div className="image-inner relative h-full w-full overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 80vw, 35vw"
              />
              <div className="absolute inset-0 bg-[#0a0a0a]/0 transition-colors duration-500 group-hover:bg-[#0a0a0a]/15" />
            </div>

            {/* Location label — outside image-inner, unaffected by scale */}
            <p className="mt-2 font-mono text-[9px] tracking-[0.35em] text-[#0a0a0a]/35 uppercase">
              {photo.location}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
