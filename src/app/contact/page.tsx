"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gsap, SplitText } from "@/lib/gsap";
import { usePageReady } from "@/hooks/usePageReady";

type FormState = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const pageReady = usePageReady();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: serviceParam || "",
    message: serviceParam
      ? `Hi, I'm interested in your ${serviceParam} services.`
      : "",
  });

  // Animations
  useEffect(() => {
    if (!pageReady) return;

    const ctx = gsap.context(() => {
      const headSplit = new SplitText(headingRef.current, { type: "chars" });

      gsap.set(headSplit.chars, { yPercent: 110, opacity: 0 });
      gsap.to(headSplit.chars, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 1.4,
        ease: "power4.out",
      });

      gsap.from(subheadRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.8,
        delay: 0.4,
      });

      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1,
        delay: 0.5,
      });

      gsap.from(".form-field", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.6,
      });
    });

    return () => ctx.revert();
  }, [pageReady]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setFormState("success");

      // ✅ CLEAR FORM HERE
      setForm({
        name: "",
        email: "",
        service: serviceParam || "",
        message: serviceParam
          ? `Hi, I'm interested in your ${serviceParam} services.`
          : "",
      });

      gsap.to(formRef.current, {
        opacity: 0.6,
        duration: 0.4,
      });

    } catch (err) {
      console.error(err);
      setFormState("error");
    }
  };

  return (
    <main className="bg-bg min-h-screen pt-24 px-8 md:px-14 pb-24">

      {/* Heading */}
      <div className="overflow-hidden mb-6">
        <h1
          ref={headingRef}
          className="font-display font-light text-text leading-none
                     tracking-tight
                     text-[clamp(3.5rem,10vw,9rem)]"
        >
          Let's work<br />together.
        </h1>
      </div>

      {/* Subhead */}
      <p
        ref={subheadRef}
        className="font-mono text-text/40 text-sm tracking-wide
                   leading-relaxed max-w-md mb-12"
      >
        Available for photography and videography commissions worldwide.
      </p>

      {/* Divider */}
      <div ref={dividerRef} className="w-full h-px bg-text/10 mb-16" />

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl">
        {/* Name */}
        <div className="form-field mb-8">
          <label
            htmlFor="name"
            className="block font-mono text-[9px] tracking-[0.4em] text-text/50 uppercase mb-3"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full bg-transparent border-b border-text/15
                         pb-3 font-display font-light text-text
                         text-xl tracking-tight outline-none
                         placeholder:text-text/20
                         focus:border-text/40
                         transition-colors duration-300"
          />
        </div>

        {/* Email */}
        <div className="form-field mb-8">
          <label
            htmlFor="email"
            className="block font-mono text-[9px] tracking-[0.4em] text-text/50 uppercase mb-3"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full bg-transparent border-b border-text/15
                         pb-3 font-display font-light text-text
                         text-xl tracking-tight outline-none
                         placeholder:text-text/20
                         focus:border-text/40
                         transition-colors duration-300"
          />
        </div>

        {/* Service */}
        <div className="form-field mb-8">
          <label className="block font-mono text-[9px] tracking-[0.4em] text-text/50 uppercase mb-3">
            Service
          </label>
          <input
            name="service"
            value={form.service}
            onChange={handleChange}
            placeholder="Photography, Videography..."
            className="w-full bg-transparent border-b border-text/15
                         pb-3 font-display font-light text-text
                         text-xl tracking-tight outline-none
                         placeholder:text-text/20
                         focus:border-text/40
                         transition-colors duration-300"
          />
        </div>

        {/* Message */}
        <div className="form-field mb-14">
          <label
            htmlFor="message"
            className="block font-mono text-[9px] tracking-[0.4em] text-text/50 uppercase mb-3"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell me about your project..."
            className="w-full bg-transparent border-b border-text/15
                         pb-3 font-display font-light text-text
                         text-xl tracking-tight outline-none
                         placeholder:text-text/20
                         focus:border-text/40
                         transition-colors duration-300
                         resize-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={formState === "sending"}
          className="group relative flex items-center gap-4
             font-mono text-[11px] tracking-[0.3em] uppercase
             text-text/40 hover:text-text
             border border-text/20
             px-6 py-3
             overflow-hidden
             transition-all duration-500
             disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {/* glow / sweep effect */}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100
                   bg-linear-to-r from-transparent via-text/10 to-transparent
                   -translate-x-full group-hover:translate-x-full
                   transition-all duration-700" />

          {/* text */}
          <span className="relative z-10">
            {formState === "sending" ? "Sending..." : "Send message"}
          </span>
        </button>

        {/* Success */}
        {formState === "success" && (
          <p className="mt-6 font-mono text-[10px] tracking-[0.2em]
                         text-text uppercase">
            Message received — I'll be in touch shortly.
          </p>
        )}

        {/* Error */}
        {formState === "error" && (
          <p className="mt-6 font-mono text-[10px] tracking-[0.2em]
                         text-red-400 uppercase">
            Something went wrong. Please try again.
          </p>
        )}

      </form>
    </main>
  );
}