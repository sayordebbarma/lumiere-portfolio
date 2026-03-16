"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/sections/Hero";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setIsLoaded(true)} />
      <main className={`transition-opacity duration-700 ease-in-out
                        ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <Hero isLoaded={isLoaded} />
      </main>
    </>
  );
}