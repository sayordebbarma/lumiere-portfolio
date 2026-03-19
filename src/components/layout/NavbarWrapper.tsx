"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handler = () => setIsLoaded(true);
    window.addEventListener("lumiere:loaded", handler, { once: true });
    return () => window.removeEventListener("lumiere:loaded", handler);
  }, []);

  return <Navbar isLoaded={isLoaded} />;
}