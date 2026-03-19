"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";

const footerLinks = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(textRef.current, { type: "chars" });

      gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.04,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 90%",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="bg-bg">

      {/* Top row */}
      <div className="px-6 md:px-14 pt-16 flex justify-between items-start">

        {/* Left — tagline */}
        <p className="font-mono text-[10px] tracking-[0.3em]
                       text-[#0a0a0a]/20 uppercase">
          Photography & Film
        </p>

        {/* Right column of links */}
        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-[11px] tracking-[0.2em]
                           text-[#0a0a0a]/50 uppercase
                           hover:text-[#0a0a0a] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] tracking-[0.2em]
                           text-[#0a0a0a]/50 uppercase
                           hover:text-[#0a0a0a] transition-colors duration-300"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Large text */}
      <div className="px-6 md:px-14 pt-12 pb-4 overflow-hidden">
        <p
          ref={textRef}
          className="font-display font-light leading-none tracking-tight
                     text-[#0a0a0a] select-none overflow-hidden
                     text-[clamp(5rem,18vw,18rem)]
                     whitespace-nowrap"
        >
          Lumière
        </p>
      </div>

      {/* Bottom bar */}
      <div className="px-6 md:px-14 py-6 flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-[0.3em]
                       text-[#0a0a0a]/30 uppercase">
          © {new Date().getFullYear()} Lumière
        </p>
      </div>

    </footer>
  );
}