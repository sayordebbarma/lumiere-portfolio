"use client";

import { forwardRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, children, className = "" }, ref) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();

      // If already on this page — do nothing
      if (pathname === href) return;

      const overlay = document.querySelector(
        "[data-transition-overlay]"
      ) as HTMLElement;

      if (!overlay) {
        router.push(href);
        return;
      }

      gsap.set(overlay, {
        scaleY: 0,
        transformOrigin: "bottom center",
        display: "block",
      });

      gsap.to(overlay, {
        scaleY: 1,
        transformOrigin: "bottom center",
        duration: 0.6,
        ease: "power4.inOut",
        onComplete: () => {
          router.push(href);
        },
      });
    };

    return (
      <a ref={ref} href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    );
  }
);

TransitionLink.displayName = "TransitionLink";

export default TransitionLink;