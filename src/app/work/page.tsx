"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import { usePageReady } from "@/hooks/usePageReady";
import works from "@/data/works.json";
import { useRouter } from "next/navigation";
import { transitionStore } from "@/lib/transitionStore";

type Work = (typeof works)[0];

export default function Work() {
  const pageReady = usePageReady();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Page entrance animations
  useEffect(() => {
    if (!pageReady) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      const split = new SplitText(headingRef.current, { type: "chars" });
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
      gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 1.2,
        ease: "power4.out",
      });

      // Work items stagger in
      gsap.from(".work-item", {
        opacity: 0,
        y: 50,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });
    });

    return () => ctx.revert();
  }, [pageReady]);

  const handleWorkClick = (work: Work, itemEl: HTMLDivElement) => {
    const rect = itemEl.getBoundingClientRect();

    // Store position for shared element transition
    transitionStore.set({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });

    // Page transition overlay
    const overlay = document.querySelector(
      "[data-transition-overlay]"
    ) as HTMLElement;

    if (!overlay) {
      router.push(`/work/${work.slug}`);
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
        router.push(`/work/${work.slug}`);
      },
    });
  };

  return (
    <main className="bg-bg min-h-screen pt-24 px-8 md:px-14">
      {/* Page heading */}
      <div className="overflow-hidden mb-4">
        <h1
          ref={headingRef}
          className="font-display font-light text-text leading-none
                     tracking-tight text-[clamp(4rem,12vw,11rem)]"
        >
          Work
        </h1>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-text/08 mb-16" />

      {/* Asymmetric work grid */}
      <div ref={listRef} className="relative">
        {/* Watermark text */}
        <div
          className="absolute inset-0 flex flex-col justify-around
                        pointer-events-none overflow-hidden select-none"
        >
          {["Cinéma", "Lumière", "Pellicule"].map((word, i) => (
            <p
              key={i}
              className="font-display font-light text-text/4
                         whitespace-nowrap leading-none
                         text-[clamp(6rem,20vw,18rem)]"
              style={{
                marginLeft: i % 2 === 0 ? "-2%" : "auto",
                marginRight: i % 2 !== 0 ? "-2%" : "auto",
              }}
            >
              {word}
            </p>
          ))}
        </div>

        {/* Row 1 */}
        <div className="flex justify-center mb-4">
          {works
            .filter((w) => w.id === "01")
            .map((work) => (
              <WorkItem
                key={work.id}
                work={work}
                className="w-full md:w-[65%]"
                onClick={(el) => handleWorkClick(work, el)}
              />
            ))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-4 mb-4">
          {works
            .filter((w) => ["02", "03"].includes(w.id))
            .map((work) => (
              <WorkItem
                key={work.id}
                work={work}
                className="w-1/2"
                onClick={(el) => handleWorkClick(work, el)}
              />
            ))}
        </div>

        {/* Row 3 */}
        <div className="flex justify-end mb-4">
          {works
            .filter((w) => w.id === "04")
            .map((work) => (
              <WorkItem
                key={work.id}
                work={work}
                className="w-full md:w-[55%]"
                onClick={(el) => handleWorkClick(work, el)}
              />
            ))}
        </div>

        {/* Row 4 */}
        <div className="flex gap-4 mb-4">
          {works
            .filter((w) => ["05", "06"].includes(w.id))
            .map((work, i) => (
              <WorkItem
                key={work.id}
                work={work}
                className={i === 0 ? "w-[38%]" : "w-[62%]"}
                onClick={(el) => handleWorkClick(work, el)}
              />
            ))}
        </div>

        {/* Row 5 */}
        <div className="flex gap-4 mb-16">
          {works
            .filter((w) => ["07", "08"].includes(w.id))
            .map((work) => (
              <WorkItem
                key={work.id}
                work={work}
                className="w-1/2"
                onClick={(el) => handleWorkClick(work, el)}
              />
            ))}
        </div>
      </div>
    </main>
  );
}

function WorkItem({
  work,
  className,
  onClick,
}: {
  work: Work;
  className: string;
  onClick: (el: HTMLDivElement) => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  const onMouseEnter = () => {
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(mediaRef.current, {
      scale: 1.04,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const onMouseLeave = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(mediaRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={itemRef}
      className={`work-item relative overflow-hidden
                  cursor-pointer ${className}`}
      style={{ aspectRatio: work.size === "large" ? "16/9" : "4/3" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => itemRef.current && onClick(itemRef.current)}
    >
      <div ref={mediaRef} className="absolute inset-0">
        {work.type === "video" ? (
          <video
            src={work.src}
            poster={(work as any).poster}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={work.src}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        )}
      </div>

      {/* Hover overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-text/30 opacity-0
                   flex items-end p-4 pointer-events-none"
      >
        <div>
          <p className="font-mono text-bg/60 text-[9px]
                         tracking-[0.3em] uppercase mb-1">
            {work.category}
          </p>
          <p className="font-display text-bg font-light
                         text-lg tracking-tight">
            {work.title}
          </p>
        </div>

        {work.type === "video" && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-bg/60 animate-pulse" />
            <span className="font-mono text-bg/50 text-[9px]
                              tracking-[0.3em] uppercase">
              Video
            </span>
          </div>
        )}
      </div>
    </div>
  );
}