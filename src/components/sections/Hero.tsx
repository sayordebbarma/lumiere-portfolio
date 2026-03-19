"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

const images = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    alt: "Mountain landscape",
    width: 220,
    height: 300,
    top: "6%",
    left: "3%",
    rotate: -5,
    parallaxSpeed: -50,
    floatFrom: { x: -80, y: -60 },
  },
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    alt: "Aerial nature",
    width: 175,
    height: 230,
    top: "4%",
    left: "27%",
    rotate: 4,
    parallaxSpeed: -30,
    floatFrom: { x: -20, y: -80 },
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
    alt: "Foggy forest",
    width: 205,
    height: 265,
    top: "5%",
    right: "4%",
    rotate: 6,
    parallaxSpeed: -40,
    floatFrom: { x: 80, y: -50 },
  },
  {
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80",
    alt: "Forest light",
    width: 195,
    height: 255,
    bottom: "7%",
    left: "4%",
    rotate: 5,
    parallaxSpeed: -35,
    floatFrom: { x: -70, y: 60 },
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80",
    alt: "Sunset hills",
    width: 215,
    height: 275,
    bottom: "5%",
    right: "22%",
    rotate: -4,
    parallaxSpeed: -25,
    floatFrom: { x: 20, y: 70 },
  },
  {
    src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80",
    alt: "Forest path",
    width: 185,
    height: 245,
    bottom: "6%",
    right: "3%",
    rotate: -6,
    parallaxSpeed: -55,
    floatFrom: { x: 80, y: 50 },
  },
];

interface HeroProps {
  isLoaded: boolean;
}

export default function Hero({ isLoaded }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

useEffect(() => {
  if (!isLoaded) return;

  const ctx = gsap.context(() => {

    gsap.delayedCall(0.05, () => {

      const tl = gsap.timeline({ delay: 0.2 });

      // ── 1. Images project from center ─────────────────────────
      imageRefs.current.forEach((img, i) => {
        if (!img) return;

        const rect = img.getBoundingClientRect();
        const centerX = window.innerWidth / 2 - rect.left - rect.width / 2;
        const centerY = window.innerHeight / 2 - rect.top - rect.height / 2;

        gsap.set(img, {
          x: centerX,
          y: centerY,
          scale: 0,
          opacity: 0,
          rotation: 0, // use 'rotation' not 'rotate' in GSAP
        });

        tl.to(
          img,
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: images[i].rotate,
            duration: 1.8,
            ease: "power4.out",
          },
          i * 0.07
        );
      });

      // ── 2. Eyebrow ─────────────────────────────────────────────
      tl.from(
        eyebrowRef.current,
        { opacity: 0, y: 12, duration: 0.8, ease: "power2.out" },
        0.5
      );

      // ── 3. Headline SplitText ──────────────────────────────────
      const split = new SplitText(headlineRef.current, { type: "chars" });

      tl.from(
        split.chars,
        {
          yPercent: 120,
          opacity: 0,
          rotationX: -20,
          stagger: 0.04,
          duration: 1.2,
          ease: "power3.out",
        },
        0.6
      );

      // ── 4. Rule ────────────────────────────────────────────────
      tl.from(
        ruleRef.current,
        {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.9,
          ease: "power2.inOut",
        },
        1.1
      );

      // ── 5. Tagline ─────────────────────────────────────────────
      tl.from(
        taglineRef.current,
        { opacity: 0, y: 10, duration: 0.8, ease: "power2.out" },
        1.2
      );

      // ── 6. Scroll indicator ────────────────────────────────────
      tl.from(
        scrollIndRef.current,
        { opacity: 0, y: 10, duration: 0.6, ease: "power2.out" },
        1.4
      );

      // ── 7. Hover — lift + derotate ─────────────────────────────
      imageRefs.current.forEach((img, i) => {
        if (!img) return;

        img.addEventListener("mouseenter", () => {
          gsap.to(img, {
            scale: 1.06,
            rotation: images[i].rotate * 0.4,
            zIndex: 20,
            duration: 0.5,
            ease: "power2.out",
          });
        });

        img.addEventListener("mouseleave", () => {
          gsap.to(img, {
            scale: 1,
            rotation: images[i].rotate,
            zIndex: 1,
            duration: 0.6,
            ease: "power2.out",
          });
        });
      });

      // ── 8. Parallax ────────────────────────────────────────────
      imageRefs.current.forEach((img, i) => {
        if (!img) return;

        gsap.to(img, {
          y: images[i].parallaxSpeed,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

    });

  }, sectionRef);

  return () => ctx.revert();
}, [isLoaded]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-bg"
    >
      {/* Scattered images */}
      {images.map((img, i) => (
        <div
          key={i}
          ref={(el) => {
            imageRefs.current[i] = el;
          }}
          className="absolute overflow-hidden"
          style={{
            width: img.width,
            height: img.height,
            top: (img as any).top,
            left: (img as any).left,
            right: (img as any).right,
            bottom: (img as any).bottom,
            rotate: `${img.rotate}deg`,
            willChange: "transform, opacity",
            zIndex: 1,
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 40vw, 20vw"
          />

          {/* Subtle inner shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />
        </div>
      ))}

      {/* Center typography */}
      <div className="relative z-10 flex flex-col items-center text-center select-none">
        <p
          ref={eyebrowRef}
          className="mb-6 font-mono text-[10px] tracking-[0.5em] text-[#0a0a0a]/35 uppercase"
        >
          Photography & Film
        </p>
        <div className="overflow-hidden">
          <h1
            ref={headlineRef}
            className="font-display text-[clamp(4rem,9vw,8rem)] leading-none font-light tracking-[-0.02em] text-[#0a0a0a]"
          >
            Lumière
          </h1>
        </div>

        <p
          ref={taglineRef}
          className="font-mono text-[10px] tracking-[0.45em] text-[#0a0a0a]/35 uppercase"
        >
          Light. Captured.
        </p>
      </div>

      <div
        ref={scrollIndRef}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] text-[#0a0a0a]/25 uppercase">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-[#0a0a0a]/10">
          <div
            className="absolute inset-0 bg-[#0a0a0a]/50"
            style={{ animation: "scrollLine 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
