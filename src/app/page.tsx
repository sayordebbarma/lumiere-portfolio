"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setIsLoaded(true)} />

      <main
        className={`transition-opacity duration-500 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="h-[300vh] p-16">
          <h1 className="font-display text-6xl font-light">Lumière</h1>
        </div>
      </main>
    </>
  );
}
