"use client";

import { useEffect, useRef } from "react";

export function useReadingFocus<T extends HTMLElement>(refreshKey: unknown, isReadingClass: string) {
  const rootRef = useRef<T>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const readingBlocks = root.querySelectorAll<HTMLElement>("[data-reading-focus]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(isReadingClass, entry.isIntersecting);
        });
      },
      { rootMargin: "-60% 0px -30% 0px", threshold: 0 },
    );

    readingBlocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, [refreshKey, isReadingClass]);

  return rootRef;
}
