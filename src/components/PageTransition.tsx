"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const overlay = overlayRef.current;
    const text = textRef.current;
    if (!overlay || !text) return;

    // Get the current page label from pathname
    const getLabel = (path: string) => {
      if (path === "/") return "Home";
      return path.replace("/", "").charAt(0).toUpperCase() +
             path.replace("/", "").slice(1);
    };

    // Set label text
    text.textContent = getLabel(pathname);

    // Split text for animation
    const split = new SplitText(text, { type: "chars" });

    // Enter sequence
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        split.revert();
      },
    });

    // Overlay wipes in from top — already set by TransitionLink exit
    // Just handle the reveal (wipe up)
    tl.set(overlay, {
      scaleY: 1,
      transformOrigin: "top center",
      display: "flex",
    });

    // Text chars animate in
    tl.from(split.chars, {
      yPercent: 110,
      opacity: 0,
      stagger: 0.04,
      duration: 0.6,
      ease: "power3.out",
    }, 0);

    // Overlay wipes upward
    tl.to(overlay, {
      scaleY: 0,
      transformOrigin: "top center",
      duration: 0.8,
      ease: "power4.inOut",
    }, 0.3);

    // Text fades out with overlay
    tl.to(text, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }, 0.2);

  }, [pathname]);

  return (
    <>
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        data-transition-overlay
        className="fixed inset-0 z-9990 bg-surface
                   hidden items-center justify-center
                   origin-top pointer-events-none"
      >
        {/* Page label */}
        <p
          ref={textRef}
          className="font-display font-light text-text
                     text-[clamp(3rem,8vw,7rem)]
                     tracking-tight leading-none overflow-hidden"
        />
      </div>
      {children}
    </>
  );
}