"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

const navLinks = [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/#gallery" },
];

interface NavbarProps {
    isLoaded: boolean;
}

export default function Navbar({ isLoaded }: NavbarProps) {
    const navRef = useRef<HTMLElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLAnchorElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const lastScrollY = useRef(0);
    const pathname = usePathname();

    // ── Entrance animation ───────────────────────────────────────────
    useEffect(() => {
        if (!isLoaded) return;

        // Only set Y — opacity handled by CSS opacity-0 class
        gsap.set(navRef.current, { y: -80 });

        const tl = gsap.timeline();

        tl.to(navRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
        });

        tl.to(
            linksRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
            },
            "-=0.4"
        );

        tl.to(
            contactRef.current,
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: "power2.out",
            },
            "-=0.4"
        );
    }, [isLoaded]);

    // ── Hide on scroll down, show on scroll up ───────────────────────
    useEffect(() => {
        let isHidden = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const nav = navRef.current;
            if (!nav) return;

            if (currentScrollY < 20) {
                // At very top — always show
                if (isHidden) {
                    isHidden = false;
                    gsap.to(nav, { y: 0, duration: 0.4, ease: "power2.out" });
                }
                lastScrollY.current = currentScrollY;
                return;
            }

            if (currentScrollY > lastScrollY.current && !isHidden) {
                // Scrolling down — hide
                isHidden = true;
                gsap.to(nav, {
                    y: "-100%",
                    duration: 0.8,
                    ease: "power4.inOut",
                });
            } else if (currentScrollY < lastScrollY.current && isHidden) {
                // Scrolling up — show
                isHidden = false;
                gsap.to(nav, {
                    y: 0,
                    duration: 0.8,
                    ease: "power4.inOut",
                });
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ── Mobile menu animation ────────────────────────────────────────
    useEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;

        if (menuOpen) {
            gsap.to(menu, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.7,
                ease: "power4.inOut",
            });

            gsap.from(".mobile-link", {
                yPercent: 100,
                opacity: 0,
                stagger: 0.08,
                duration: 0.8,
                delay: 0.3,
                ease: "power3.out",
            });
        } else {
            gsap.to(menu, {
                clipPath: "inset(0% 0% 100% 0%)",
                duration: 0.6,
                ease: "power4.inOut",
            });
        }
    }, [menuOpen]);

    // ── Close menu on route change ───────────────────────────────────
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-0 left-0 right-0 z-50
                   px-8 md:px-14 h-16 flex items-center justify-between
                   bg-[#f5f5f0]/80 backdrop-blur-md
                   border-b border-[#0a0a0a]/06
                   opacity-0"
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="font-display text-[#0a0a0a] text-lg font-light
                     tracking-tight hover:opacity-60
                     transition-opacity duration-300"
                >
                    Lumière
                </Link>

                {/* Center links — desktop only */}
                <div
                    ref={linksRef}
                    className="hidden md:flex items-center gap-10 absolute
                     left-1/2 -translate-x-1/2 opacity-0"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`font-mono text-[11px] tracking-[0.25em]
                          uppercase transition-opacity duration-300
                          ${pathname === link.href
                                    ? "text-[#0a0a0a] opacity-100"
                                    : "text-[#0a0a0a]/40 hover:opacity-100 hover:text-[#0a0a0a]"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-6">
                    {/* Contact button — desktop */}
                    <Link
                        ref={contactRef}
                        href="/contact"
                        className="hidden md:flex items-center opacity-0
                       font-mono text-[11px] tracking-[0.25em] uppercase
                       border border-[#0a0a0a]/20 px-5 py-2.5
                       text-[#0a0a0a]/60 hover:text-[#0a0a0a]
                       hover:border-[#0a0a0a]/60
                       transition-all duration-300"
                    >
                        Contact
                    </Link>

                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-1"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block h-px w-6 bg-[#0a0a0a] transition-all
                          duration-300 origin-center
                          ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
                        />
                        <span
                            className={`block h-px w-6 bg-[#0a0a0a] transition-all
                          duration-300
                          ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
                        />
                        <span
                            className={`block h-px w-6 bg-[#0a0a0a] transition-all
                          duration-300 origin-center
                          ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            <div
                ref={menuRef}
                className="fixed inset-0 z-40 bg-[#f5f5f0] flex flex-col
                   items-start justify-end px-8 pb-16 md:hidden"
                style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            >
                <div className="flex flex-col gap-0 mb-12 w-full">
                    {[...navLinks, { label: "Contact", href: "/contact" }].map(
                        (link) => (
                            <div
                                key={link.label}
                                className="overflow-hidden border-b border-[#0a0a0a]/08 py-5"
                            >
                                <Link
                                    href={link.href}
                                    className="mobile-link block font-display font-light
                             text-[clamp(2.5rem,8vw,4rem)] text-[#0a0a0a]
                             tracking-tight leading-none
                             hover:opacity-50 transition-opacity duration-300"
                                >
                                    {link.label}
                                </Link>
                            </div>
                        )
                    )}
                </div>

                <p
                    className="font-mono text-[10px] tracking-[0.3em]
                     text-[#0a0a0a]/30 uppercase"
                >
                    Lumière © {new Date().getFullYear()}
                </p>
            </div>
        </>
    );
}