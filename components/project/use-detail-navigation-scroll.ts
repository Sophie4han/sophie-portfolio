"use client";

import { useLayoutEffect, type RefObject } from "react";
import { resetNavigationScroll } from "@/lib/navigation-scroll";

export function useDetailNavigationScroll(
  sectionId: string | null,
  sceneRoot: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    resetNavigationScroll(sceneRoot.current);
  }, [sectionId, sceneRoot]);
}
