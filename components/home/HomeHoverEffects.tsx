"use client";

import { useEffect } from "react";

/** Pointer-only enhancements; navigation and animation completion stay independent. */
export function HomeHoverEffects() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-home-hero]");
    if (!hero) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = matchMedia("(hover: hover) and (pointer: fine)");
    const badge = hero.querySelector<SVGElement>("[data-welcome-badge]");
    const reset = () => {
      const button = hero.querySelector<HTMLElement>("[data-down-slot] a");
      button?.style.removeProperty("--magnet-x");
      button?.style.removeProperty("--magnet-y");
    };
    const move = (event: PointerEvent) => {
      if (reduced.matches || !mouse.matches || event.pointerType !== "mouse") { reset(); return; }
      const slot = hero.querySelector<HTMLElement>('[data-scroll-locked="true"]');
      const button = slot?.querySelector<HTMLElement>("a");
      if (!slot || !button) { reset(); return; }
      // Measure the fixed slot so the magnetic offset cannot feed back into itself.
      const rect = slot.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(x, y);
      const amount = distance < 100 ? Math.min(7, distance * .12) : 0;
      button.style.setProperty("--magnet-x", `${distance ? x / distance * amount : 0}px`);
      button.style.setProperty("--magnet-y", `${distance ? y / distance * amount : 0}px`);
    };
    const speed = (rate: number) => {
      badge?.getAnimations({ subtree: true }).forEach(animation => {
        if (animation instanceof CSSAnimation && animation.animationName.includes("welcomeRotation")) animation.updatePlaybackRate(rate);
      });
    };
    const enterBadge = () => { if (!reduced.matches && mouse.matches) speed(1.15); };
    const leaveBadge = () => speed(1);
    const preferenceChanged = () => { reset(); speed(1); };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", reset);
    hero.addEventListener("click", reset);
    badge?.addEventListener("pointerenter", enterBadge);
    badge?.addEventListener("pointerleave", leaveBadge);
    reduced.addEventListener("change", preferenceChanged);
    return () => {
      reset(); speed(1);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      hero.removeEventListener("click", reset);
      badge?.removeEventListener("pointerenter", enterBadge);
      badge?.removeEventListener("pointerleave", leaveBadge);
      reduced.removeEventListener("change", preferenceChanged);
    };
  }, []);
  return null;
}
