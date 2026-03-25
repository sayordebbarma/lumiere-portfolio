"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { gsap, SplitText } from "@/lib/gsap";
import { usePageReady } from "@/hooks/usePageReady";
import { transitionStore } from "@/lib/transitionStore";
import works from "@/data/works.json";
import Link from "next/link";

export default function WorkDetail() {
    const { slug } = useParams();
    const pageReady = usePageReady();
    const work = works.find((w) => w.slug === slug);

    const heroRef = useRef<HTMLDivElement>(null);
    const heroImgRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const metaRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const backBtnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pageReady || !work) return;

        const savedRect = transitionStore.get();
        transitionStore.clear();

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // ✅ Initial state for back button (prevents early flash)
            gsap.set(backBtnRef.current, {
                opacity: 0,
                y: -10,
                filter: "blur(6px)",
            });

            // Shared element transition
            if (savedRect && heroImgRef.current) {
                const heroEl = heroImgRef.current;

                gsap.set(heroEl, {
                    position: "fixed",
                    top: savedRect.top,
                    left: savedRect.left,
                    width: savedRect.width,
                    height: savedRect.height,
                    zIndex: 100,
                });

                tl.to(heroEl, {
                    top: 0,
                    left: 0,
                    width: "50%",
                    height: "100vh",
                    duration: 1,
                    ease: "power4.inOut",
                    onComplete: () => {
                        gsap.set(heroEl, {
                            position: "sticky",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: "auto",
                        });
                    },
                });
            } else {
                gsap.from(heroImgRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                });
            }

            // Title
            const titleSplit = new SplitText(titleRef.current, { type: "chars" });
            gsap.set(titleSplit.chars, { yPercent: 110, opacity: 0 });

            tl.to(
                titleSplit.chars,
                {
                    yPercent: 0,
                    opacity: 1,
                    stagger: 0.03,
                    duration: 1,
                    ease: "power3.out",
                },
                savedRect ? "-=0.4" : "0"
            );

            // Meta
            tl.from(
                metaRef.current,
                {
                    opacity: 0,
                    y: 12,
                    duration: 0.7,
                    ease: "power2.out",
                },
                "-=0.6"
            );

            // Description
            const descSplit = new SplitText(descRef.current, {
                type: "lines",
                linesClass: "overflow-hidden",
            });

            tl.from(
                descSplit.lines,
                {
                    yPercent: 110,
                    opacity: 0,
                    stagger: 0.08,
                    duration: 0.9,
                    ease: "power3.out",
                },
                "-=0.4"
            );

            // Tags
            tl.from(
                tagsRef.current?.children
                    ? Array.from(tagsRef.current.children)
                    : [],
                {
                    opacity: 0,
                    y: 8,
                    stagger: 0.06,
                    duration: 0.6,
                    ease: "power2.out",
                },
                "-=0.5"
            );

            // Gallery
            tl.from(
                ".gallery-img",
                {
                    opacity: 0,
                    y: 30,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.3"
            );

            // Back button
            tl.to(
                backBtnRef.current,
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.7,
                    ease: "power3.out",
                },
                "-=0.3"
            );
        });

        return () => ctx.revert();
    }, [pageReady, work]);

    if (!work) return null;

    const heroSrc =
        work.type === "video" ? (work as any).poster : work.src;

    return (
        <main className="bg-bg min-h-screen">
            {/* BACK BUTTON */}
            <div
                ref={backBtnRef}
                className="fixed top-24 md:top-24 left-6 md:left-14 z-9999"
            >
                <Link
                    href="/work"
                    onClick={(e) => {
                        e.preventDefault();

                        const overlay = document.querySelector(
                            "[data-transition-overlay]"
                        ) as HTMLElement;

                        if (!overlay) {
                            window.location.href = "/work";
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
                                window.location.href = "/work";
                            },
                        });
                    }}
                    className="font-mono text-[10px] tracking-[0.3em]
                     text-text/40 uppercase
                     hover:text-text transition-colors duration-300
                     flex items-center gap-3"
                >
                    <span>←</span>
                    <span>All Work</span>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Left — hero */}
                <div
                    ref={heroRef}
                    className="w-full md:w-1/2 md:sticky md:top-0
                     h-[50vh] md:h-screen shrink-0"
                >
                    <div
                        ref={heroImgRef}
                        className="w-full h-full relative overflow-hidden"
                    >
                        <Image
                            src={heroSrc}
                            alt={work.title}
                            fill
                            className="object-cover"
                            sizes="50vw"
                            priority
                        />
                    </div>
                </div>

                {/* Right — content */}
                <div className="w-full md:w-1/2 px-8 md:px-14 py-24 flex flex-col justify-start">
                    {/* Meta */}
                    <div ref={metaRef} className="flex items-center gap-4 mb-8">
                        <span className="font-mono text-[9px] tracking-[0.4em] text-text/30 uppercase">
                            {work.id} / {works.length.toString().padStart(2, "0")}
                        </span>
                        <span className="w-4 h-px bg-text/20" />
                        <span className="font-mono text-[9px] tracking-[0.4em] text-text/30 uppercase">
                            {work.category}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="overflow-hidden mb-6">
                        <h1
                            ref={titleRef}
                            className="font-display font-light text-text
                         text-[clamp(2.5rem,5vw,4.5rem)]
                         leading-tight tracking-tight"
                        >
                            {work.title}
                        </h1>
                    </div>

                    {/* Tags */}
                    <div ref={tagsRef} className="flex flex-wrap gap-2 mb-10">
                        {work.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="font-mono text-[9px] tracking-[0.3em]
                           text-text/40 uppercase"
                            >
                                {tag}
                                {i < work.tags.length - 1 && (
                                    <span className="ml-2 text-text/20">·</span>
                                )}
                            </span>
                        ))}
                    </div>

                    {/* Location + year */}
                    <div className="flex items-center gap-6 mb-10 pb-10 border-b border-text/08">
                        <div>
                            <p className="font-mono text-[9px] tracking-[0.3em] text-text/25 uppercase mb-1">
                                Location
                            </p>
                            <p className="font-display text-text font-light text-lg">
                                {work.location}
                            </p>
                        </div>
                        <div>
                            <p className="font-mono text-[9px] tracking-[0.3em] text-text/25 uppercase mb-1">
                                Year
                            </p>
                            <p className="font-display text-text font-light text-lg">
                                {work.year}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p
                        ref={descRef}
                        className="font-mono text-text/50 text-sm
                       leading-relaxed tracking-wide mb-14"
                    >
                        {work.description}
                    </p>

                    {/* Gallery */}
                    {work.gallery && work.gallery.length > 0 && (
                        <div ref={galleryRef}>
                            <p className="font-mono text-[9px] tracking-[0.4em] text-text/25 uppercase mb-4">
                                Series
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {work.gallery.map((img, i) => (
                                    <div
                                        key={i}
                                        className="gallery-img relative overflow-hidden aspect-square"
                                    >
                                        <Image
                                            src={img}
                                            alt={`${work.title} ${i + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                            sizes="20vw"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}