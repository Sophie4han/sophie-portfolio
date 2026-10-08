"use client";
import type { ReactNode } from "react";

export function HomeAnchor({ href, children, className, label }: { href: string; children: ReactNode; className?: string; label?: string }) {
  return <a href={href} className={className} aria-label={label} onClick={(event) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    history.replaceState(null, "", href);
  }}>{children}</a>;
}
