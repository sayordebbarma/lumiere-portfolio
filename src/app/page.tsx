"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/sections/Hero";
import Gallery from "@/components/sections/Gallery";
import HorizontalScroll from "@/components/sections/HorizontalScroll";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setIsLoaded(true)} />
      <main className={`transition-opacity duration-700 ease-in-out
                        ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <Hero isLoaded={isLoaded} />
        <Gallery />
        <HorizontalScroll />
      </main>
    </>
  );
}