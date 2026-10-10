"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ChooniGuide } from "./ChooniGuide";
import styles from "./home.module.css";
import { RETURN_TO_WORK_KEY } from "@/components/project/ProjectNavigation";

type IntroStage = "introLocked" | "navigationReady" | "unlocked";

export function DelayedDown() {
  const [stage, setStage] = useState<IntroStage>("introLocked");
  const [revealAt] = useState(() => Date.now() + 8_000);
  const unlock = useRef<() => void>(() => {});
  const slot = useRef<HTMLDivElement>(null);
  const advance = useCallback((next: IntroStage) => {
    setStage(next);
  }, []);

  useLayoutEffect(() => {
    // A project Back link restores work; ordinary HOME entry keeps its intro lock.
    if (location.hash === "#work" && sessionStorage.getItem(RETURN_TO_WORK_KEY) === "true") {
      const frame = requestAnimationFrame(() => {
        sessionStorage.removeItem(RETURN_TO_WORK_KEY);
        advance("unlocked");
        if (slot.current) slot.current.dataset.scrollLocked = "false";
        document.getElementById("work")?.scrollIntoView({ behavior: "instant" });
      });
      return () => cancelAnimationFrame(frame);
    }
    const remaining = Math.max(0, revealAt - Date.now());
    const hero = slot.current?.closest("section");
    if (!hero) return;
    const elements = [document.documentElement, document.body];
    const properties = ["overflow", "overscroll-behavior", "touch-action"];
    const previous = elements.map(element => properties.map(property => ({ value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) })));
    const outside = [...Array.from(hero.parentElement?.children ?? []).filter((element): element is HTMLElement => element instanceof HTMLElement && element !== hero), ...document.querySelectorAll<HTMLElement>("footer")];
    const previousInert = outside.map(element => element.inert);
    outside.forEach(element => { element.inert = true; });
    elements.forEach(element => {
      element.style.setProperty("overflow", "hidden");
      element.style.setProperty("overscroll-behavior", "none");
      element.style.setProperty("touch-action", "none");
    });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const prevent = (event: Event) => event.preventDefault();
    const keys = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey && ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(event.key)) event.preventDefault();
    };
    const pin = () => { if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", keys);
    window.addEventListener("scroll", pin);
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      elements.forEach((element,index) => properties.forEach((property,key) => {
        const old = previous[index][key];
        if (old.value) element.style.setProperty(property, old.value, old.priority);
        else element.style.removeProperty(property);
      }));
      outside.forEach((element,index) => { element.inert = previousInert[index]; });
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", keys);
      window.removeEventListener("scroll", pin);
    };
    unlock.current = release;
    const timer = window.setTimeout(() => advance("navigationReady"), remaining);
    return () => { clearTimeout(timer); release(); };
  }, [advance, revealAt]);

  return <><ChooniGuide revealAt={revealAt} /><div ref={slot} className={styles.downSlot} data-down-slot data-intro-stage={stage} data-scroll-locked={stage !== "unlocked"}>
    {stage !== "introLocked" && <a href="#work" className={styles.down} aria-label="Selected Work로 이동" onClick={event => {
      event.preventDefault();
      unlock.current();
      // Remove the pre-hydration CSS lock before starting native scrolling.
      slot.current!.dataset.scrollLocked = "false";
      advance("unlocked");
      const target = document.getElementById("work");
      target?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
      history.replaceState(null, "", "#work");
    }}><span aria-hidden="true">↓</span></a>}
  </div></>;
}
