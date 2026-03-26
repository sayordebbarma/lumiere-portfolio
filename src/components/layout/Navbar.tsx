"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import TransitionLink from "@/components/ui/TransitionLink";


const navLinks = [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
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

    // Entrance animation
    useEffect(() => {
        if (!isLoaded) return;

        gsap.set(navRef.current, { y: -60 });

        const tl = gsap.timeline();

        tl.to(navRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
        });

        tl.to(
            linksRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
            },
            0
        );

        tl.to(
            contactRef.current,
            {
                opacity: 1,
                x: 0,
                duration: 0.9,
                ease: "power3.out",
            },
            0
        );

    }, [isLoaded]);

    // Hide on scroll down, show on scroll up
    useEffect(() => {
        let isHidden = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const nav = navRef.current;
            if (!nav) return;

            if (currentScrollY < 20) {
                if (isHidden) {
                    isHidden = false;
                    gsap.to(nav, { y: 0, duration: 0.8, ease: "power4.inOut" });
                }
                lastScrollY.current = currentScrollY;
                return;
            }

            if (currentScrollY > lastScrollY.current && !isHidden) {
                isHidden = true;
                gsap.to(nav, { y: "-100%", duration: 0.8, ease: "power4.inOut" });
            } else if (currentScrollY < lastScrollY.current && isHidden) {
                isHidden = false;
                gsap.to(nav, { y: 0, duration: 0.8, ease: "power4.inOut" });
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Mobile menu animation
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

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-0 left-0 right-0 z-50
                   px-8 md:px-14 h-16
                   flex items-center justify-between
                   bg-bg/90 backdrop-blur-sm
                   border-b border-[#0a0a0a]/4
                   opacity-0"
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="font-display font-light text-[#0a0a0a]
                     text-xl tracking-tight
                     hover:opacity-50 transition-opacity duration-500"
                >
                    Lumière
                </Link>

                {/* Center links */}
                <div
                    ref={linksRef}
                    className="hidden md:flex items-center gap-10
                     absolute left-1/2 -translate-x-1/2 opacity-0"
                >
                    {navLinks.map((link) => (
                        <TransitionLink
                            key={link.label}
                            href={link.href}
                            className={`font-mono text-[10px] tracking-[0.25em]
                uppercase transition-opacity duration-500
                ${pathname === link.href
                                    ? "text-[#0a0a0a]"
                                    : "text-[#0a0a0a]/35 hover:text-[#0a0a0a]"
                                }`}
                        >
                            {link.label}
                        </TransitionLink>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-6">
                    {/* Contact button */}
                    <TransitionLink
                        ref={contactRef}
                        href="/contact"
                        className="group relative hidden md:flex items-center justify-center
             opacity-0 overflow-hidden
             font-mono text-[10px] tracking-[0.25em] uppercase
             border border-[#0a0a0a]/15 px-5 py-2.5
             text-[#0a0a0a]/40 hover:text-[#0a0a0a]
             hover:border-[#0a0a0a]/40
             transition-all duration-500"
                    >
                        {/* glow / sweep effect */}
                        <span className="pointer-events-none absolute inset-0 opacity-0
                   group-hover:opacity-100
                   bg-linear-to-r from-transparent via-black/10 to-transparent
                   -translate-x-full group-hover:translate-x-full
                   transition-all duration-700" />

                        {/* content */}
                        <span className="relative z-10">
                            Contact
                        </span>
                    </TransitionLink>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-1"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block h-px w-5 bg-[#0a0a0a]/60 transition-all
                          duration-500 origin-center
                          ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
                        />
                        <span
                            className={`block h-px w-5 bg-[#0a0a0a]/60 transition-all
                          duration-500
                          ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
                        />
                        <span
                            className={`block h-px w-5 bg-[#0a0a0a]/60 transition-all
                          duration-500 origin-center
                          ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            <div
                ref={menuRef}
                className="fixed inset-0 z-40 bg-bg flex flex-col
                   items-start justify-end px-8 md:px-14 pb-16 md:hidden"
                style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            >
                <div className="flex flex-col gap-0 mb-12 w-full">
                    {[...navLinks, { label: "Contact", href: "/contact" }].map((link) => (
                        <div
                            key={link.label}
                            className="overflow-hidden border-b border-[#0a0a0a]/06 py-5"
                        >
                            <Link
                                href={link.href}
                                className="mobile-link block font-display font-light
                           text-[clamp(2.5rem,8vw,4rem)] text-[#0a0a0a]
                           tracking-tight leading-none
                           hover:opacity-40 transition-opacity duration-500"
                            >
                                {link.label}
                            </Link>
                        </div>
                    ))}
                </div>

                <p className="font-mono text-[10px] tracking-[0.3em]
                       text-[#0a0a0a]/25 uppercase">
                    Lumière © {new Date().getFullYear()}
                </p>
            </div>
        </>
    );
}