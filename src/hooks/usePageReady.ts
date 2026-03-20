import { useEffect, useState } from "react";

// Must match total PageTransition duration
// chars in (0.6s) + hold (0.3s) + chars out (0.4s) + wipe (0.8s) - overlap (0.2s) ≈ 1.5s
const TRANSITION_DURATION = 1500;

export function usePageReady() {
    const [pageReady, setPageReady] = useState(false);

    useEffect(() => {
        const handler = () => setPageReady(true);

        window.addEventListener("lumiere:transition-complete", handler, {
            once: true,
        });

        const fallback = setTimeout(handler, TRANSITION_DURATION);

        return () => {
            window.removeEventListener("lumiere:transition-complete", handler);
            clearTimeout(fallback);
        };
    }, []);

    return pageReady;
}