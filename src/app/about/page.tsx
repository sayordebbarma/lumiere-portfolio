"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap, SplitText } from "@/lib/gsap";
import { usePageReady } from "@/hooks/usePageReady";

const services = [
  {
    label: "Landscape",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  },
  {
    label: "Portrait",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80",
  },
  {
    label: "Documentary",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
  },
  {
    label: "Editorial",
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80",
  },
  {
    label: "Commercial",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
  },
];

export default function About() {
  const sectionOneRef = useRef<HTMLElement>(null);
  const sectionTwoRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const hoverImageRef = useRef<HTMLDivElement>(null);
  const hoverImgElRef = useRef<HTMLImageElement>(null);
  const clipTween = useRef<gsap.core.Tween | null>(null);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);
  const [activeService, setActiveService] = useState<number | null>(null);
  const router = useRouter();
  const pageReady = usePageReady();

  const getClipMid = () => {
    const el = hoverImageRef.current;
    if (!el) return 0;
    return el.offsetHeight / 2;
  };

  const animateClip = (
    fromTop: number,
    fromBottom: number,
    toTop: number,
    toBottom: number,
    duration: number,
    ease: string
  ) => {
    const el = hoverImageRef.current;
    if (!el) return;

    const clip = { t: fromTop, b: fromBottom };

    clipTween.current?.kill();
    clipTween.current = gsap.to(clip, {
      t: toTop,
      b: toBottom,
      duration,
      ease,
      onUpdate: () => {
        el.style.clipPath = `inset(${clip.t}px 0px ${clip.b}px 0px)`;
      },
    });
  };

  // Clip init — runs immediately, no gate needed
  useEffect(() => {
    const el = hoverImageRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      const mid = el.offsetHeight / 2;
      el.style.clipPath = `inset(${mid}px 0px ${mid}px 0px)`;
    });
  }, []);

  // All animations — gated on pageReady
  useEffect(() => {
    if (!pageReady) return;

    // Small buffer after transition fully clears
    const timer = gsap.delayedCall(0.15, () => {

      const ctx = gsap.context(() => {

        // Name reveal
        const nameSplit = new SplitText(nameRef.current, { type: "chars" });
        gsap.set(nameSplit.chars, { yPercent: 110, opacity: 0 });
        gsap.to(nameSplit.chars, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.03,
          duration: 1.4,
          ease: "power4.out",
        });

        // Index
        gsap.from(indexRef.current, {
          opacity: 0,
          y: -10,
          duration: 1,
          delay: 0.1,
          ease: "power2.out",
        });

        // Bio lines
        const bioSplit = new SplitText(bioRef.current, {
          type: "lines",
          linesClass: "overflow-hidden",
        });
        gsap.from(bioSplit.lines, {
          yPercent: 110,
          opacity: 0,
          stagger: 0.12,
          duration: 1.1,
          delay: 0.1,
          ease: "power3.out",
        });

        // Services stagger in
        gsap.from(".service-item", {
          opacity: 0,
          x: 20,
          stagger: 0.1,
          duration: 1,
          delay: 0.15,
          ease: "power3.out",
        });

        // Section 1 fades out on scroll
        gsap.to(sectionOneRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionOneRef.current,
            start: "80% top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Portrait parallax
        gsap.to(portraitRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionTwoRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        // Label reveal
        gsap.from(labelRef.current, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionTwoRef.current,
            start: "top 80%",
            once: true,
          },
        });
      });

      // Store ctx for cleanup
      ctxRef.current = ctx;
    });

    return () => {
      timer.kill();
      ctxRef.current?.revert();
      clipTween.current?.kill();
    };
  }, [pageReady]);

  const handleServiceEnter = (index: number) => {
    setActiveService(index);
    const img = hoverImgElRef.current;
    if (!img) return;

    img.src = services[index].image;

    const mid = getClipMid();
    animateClip(mid, mid, 0, 0, 0.7, "power3.out");
  };

  const handleServiceLeave = () => {
    setActiveService(null);
    const mid = getClipMid();
    animateClip(0, 0, mid, mid, 0.5, "power3.in");
  };

  const handleServiceClick = (label: string) => {
    const overlay = document.querySelector(
      "[data-transition-overlay]"
    ) as HTMLElement;

    if (!overlay) {
      router.push(`/contact?service=${label.toLowerCase()}`);
      return;
    }

    gsap.set(overlay, {
      scaleY: 0,
      transformOrigin: "bottom center",
      display: "flex",
    });

    gsap.to(overlay, {
      scaleY: 1,
      duration: 0.6,
      ease: "power4.inOut",
      onComplete: () => {
        router.push(`/contact?service=${label.toLowerCase()}`);
      },
    });
  };

  return (
    <main className="bg-bg">

      {/* Section 1 — Typography + Services */}
      <section
        ref={sectionOneRef}
        className="relative h-screen flex flex-col justify-end
                   px-8 md:px-14 pb-16 pt-24 overflow-hidden"
      >
        {/* Hover image */}
        <div
          ref={hoverImageRef}
          className="absolute left-0 right-0 pointer-events-none z-5"
          style={{ top: "37.5%", height: "25%" }}
        >
          <img
            ref={hoverImgElRef}
            src={services[0].image}
            alt=""
            className="w-full h-full object-cover"
            style={{ display: "block" }}
          />
          <div className="absolute inset-0 bg-bg/10" />
        </div>

        {/* Index */}
        <span
          ref={indexRef}
          className="absolute top-24 left-8 md:left-14 z-10
                     font-mono text-[10px] tracking-[0.4em]
                     text-text/25 uppercase"
        >
          01 / About
        </span>

        {/* Services list */}
        <div className="absolute top-24 right-8 md:right-14
                        mt-8 flex flex-col gap-5 z-10">
          {services.map((service, i) => (
            <div
              key={i}
              className="service-item flex flex-col items-end cursor-pointer"
              onMouseEnter={() => handleServiceEnter(i)}
              onMouseLeave={handleServiceLeave}
              onClick={() => handleServiceClick(service.label)}
            >
              <span
                className={`font-display font-light text-right
                             text-[clamp(1rem,2vw,1.4rem)] tracking-tight
                             leading-none transition-opacity duration-300
                             ${activeService === i
                    ? "text-text opacity-100"
                    : "text-text/30"
                  }`}
              >
                {service.label}
              </span>
            </div>
          ))}
        </div>

        {/* Large name */}
        <div className="overflow-hidden mb-10 relative z-10">
          <h1
            ref={nameRef}
            className="font-display font-light text-text leading-none
                       tracking-tight whitespace-nowrap
                       text-[clamp(4rem,12vw,11rem)]"
          >
            Between Frames
          </h1>
        </div>

        {/* Bio */}
        <div className="max-w-lg relative z-10">
          <p
            ref={bioRef}
            className="font-mono text-text/50 text-sm
                       leading-relaxed tracking-wide"
          >
            A visual storyteller based between light and shadow.
            Specialising in landscape, portrait, and documentary photography
            — capturing the quiet moments that define a place, a face, a feeling.
            Available for editorial, commercial, and personal commissions worldwide.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-14
                        flex flex-col items-center gap-2 z-10">
          <span className="font-mono text-[9px] tracking-[0.4em]
                            text-text/20 uppercase">
            Scroll
          </span>
          <div className="relative w-px h-10 overflow-hidden bg-text/10">
            <div
              className="absolute inset-0 bg-text/50"
              style={{ animation: "scrollLine 1.8s ease-in-out infinite" }}
            />
          </div>
        </div>
      </section>

      {/* Section 2 — Portrait */}
      <section
        ref={sectionTwoRef}
        className="relative h-screen overflow-hidden"
      >
        <div
          ref={portraitRef}
          className="absolute inset-0 h-[115%] -top-[7.5%]
                     will-change-transform"
        >
          <Image
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80"
            alt="Portrait"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-text/10" />
        </div>

        {/* Label */}
        <div
          ref={labelRef}
          className="absolute bottom-10 left-8 md:left-14 z-10"
        >
          <p className="font-mono text-bg/50 text-[9px]
                         tracking-[0.4em] uppercase mb-1">
            Available worldwide
          </p>
          <p className="font-display text-bg font-light
                         text-2xl tracking-tight">
            Based in Tripura, IN
          </p>
        </div>

        <span className="absolute top-8 right-8 md:right-14 z-10
                          font-mono text-[10px] tracking-[0.4em]
                          text-bg/30 uppercase">
          02 / Portrait
        </span>
      </section>

    </main>
  );
}