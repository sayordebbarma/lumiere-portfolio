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

        // Split text
        const split = new SplitText(text, { type: "chars" });
        gsap.set(text, { visibility: "visible" });
        gsap.set(split.chars, { yPercent: 110, opacity: 0 });

        // Make overlay visible
        gsap.set(overlay, {
            scaleY: 1,
            transformOrigin: "top center",
            display: "flex",
        });

        const tl = gsap.timeline();

        tl.to(split.chars, {
            yPercent: 0,
            opacity: 1,
            stagger: 0.04,
            duration: 0.6,
            ease: "power3.out",
        });

        tl.to({}, { duration: 0.3 });

        tl.to(split.chars, {
            yPercent: -110,
            opacity: 0,
            stagger: 0.03,
            duration: 0.4,
            ease: "power3.in",
        });

        tl.to(
            overlay,
            {
                scaleY: 0,
                transformOrigin: "top center",
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => {
                    gsap.set(overlay, { display: "none" });
                    gsap.set(text, { visibility: "hidden" });
                    split.revert();
                },
            },
            "-=0.2"
        );

    }, [pathname]);

    return (
        <>
            <div
                ref={overlayRef}
                data-transition-overlay
                className="fixed inset-0 z-9990 bg-surface
               items-center justify-center
               origin-top pointer-events-none"
                style={{ display: "none" }}
            >
                <div className="overflow-hidden">
                    <p
                        ref={textRef}
                        className="font-display font-light text-text
                       text-[clamp(2rem,6vw,5rem)]
                       tracking-tight leading-none"
                        style={{ visibility: "hidden" }}
                    >
                        Lumière
                    </p>
                </div>
            </div>
            {children}
        </>
    );
}