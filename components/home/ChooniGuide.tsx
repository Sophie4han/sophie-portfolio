"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./chooni-guide.module.css";

let greeted = false;

/** A decorative guide: no essential information or keyboard interaction. */
export function ChooniGuide({ revealAt }: { revealAt: number }) {
  const actor = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = actor.current;
    const hero = node?.closest("section");
    if (!node || !hero) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    let blink: ReturnType<typeof setTimeout> | undefined;
    let hello: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let started = false;
    let arrived = false;

    let start = { x: 0, y: 0 };
    let finish = { x: 0, y: 0 };
    let route: { x: number; y: number }[] = [];
    let safe = false;
    const move = (point: { x: number; y: number }) => `translate3d(${point.x}px, ${point.y}px, 0)`;
    function layout() {
      if (!node || !hero) return;
      const h = hero.getBoundingClientRect();
      const slot = hero.querySelector<HTMLElement>("[data-down-slot]")!.getBoundingClientRect();
      const title = hero.querySelector("h1")!;
      const word = hero.querySelector("[data-toward]")!;
      const wordRange = document.createRange();
      wordRange.selectNodeContents(word);
      const toward = wordRange.getBoundingClientRect();
      const width = node.offsetWidth, height = node.offsetHeight;
      const mobile = h.width < 768;
      // Breakpoint-sized rails follow the reference around the text blocks.
      const inkInset = parseFloat(getComputedStyle(word).fontSize) * .22;
      start = { x: toward.left - h.left + (toward.width - width) * .5, y: toward.top - h.top + inkInset - height - 3 };
      // The reference ends to the LEFT of the down button, after crossing the
      // headline/copy gap and descending outside the copy's left edge.
      finish = { x: h.width / 2 - slot.height / 2 - width - 28, y: slot.top - h.top + (slot.height - height) / 2 };
      const rail = mobile ? h.width - width - 2 : Math.min(h.width - width - 16, toward.right - h.left + 32);

      // Use actual text runs, not h1's full-width rectangle: the initial perch is
      // deliberately inside its whitespace. Annotations remain exclusion zones.
      const zones: DOMRect[] = [];
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        for (const rect of range.getClientRects()) {
          zones.push(word.contains(walker.currentNode) ? new DOMRect(rect.x, rect.y + inkInset, rect.width, rect.height - inkInset) : rect);
        }
      }
      const headlineBottom = Math.max(...zones.map(z => z.bottom - h.top));
      zones.push(...[...hero.querySelectorAll<HTMLElement>("[data-intro] p, [data-positioning], h1 svg")].map(e => e.getBoundingClientRect()));
      const copy = hero.querySelector<HTMLElement>("[data-intro] p")!.getBoundingClientRect();
      const middleLane = headlineBottom + 4;
      const leftRail = Math.max(2, copy.left - h.left - width - (mobile ? 8 : 24));
      route = [start, { x: rail, y: start.y }, { x: rail, y: middleLane }, { x: leftRail, y: middleLane }, { x: leftRail, y: finish.y }, finish];
      safe = route.every(p => p.x >= 2 && p.y >= 2 && p.x + width <= h.width - 2 && p.y + height <= h.height - 2);
      for (let index = 1; index < route.length; index++) {
        const a = route[index-1], b = route[index];
        const left = Math.min(a.x,b.x) + h.left - 2, right = Math.max(a.x,b.x) + h.left + width + 2;
        const top = Math.min(a.y,b.y) + h.top - 2, bottom = Math.max(a.y,b.y) + h.top + height + 2;
        if (zones.some(z => left < z.right && right > z.left && top < z.bottom && bottom > z.top)) safe = false;
      }
      const initialSafe = zones.every(z => !(start.x+h.left < z.right && start.x+h.left+width > z.left && start.y+h.top < z.bottom && start.y+h.top+height > z.top));
      node.style.visibility = arrived || initialSafe ? "visible" : "hidden";
      node.style.transform = move(arrived ? finish : start);
      node.dataset.pathSafe = String(safe);
      node.dataset.waypoints = JSON.stringify(route);
    }
    function renderRestingPose() {
      clearTimeout(delay); clearTimeout(blink); clearTimeout(hello);
      animation?.cancel();
      node!.dataset.state = "arrived";
      node!.dataset.direction = "right";
      delete node!.dataset.segment;
      delete node!.dataset.hello;
      node!.style.visibility = "visible";
      node!.style.transform = move(finish);
    }
    function resize() {
      // Layout may never write position while the movement clock is active.
      if (!started || arrived) layout();
    }
    function begin() {
      if (disposed || started) return;
      layout();
      if (arrived) { renderRestingPose(); return; }
      started = true;
      node!.dataset.state = "crawling";
      delete node!.dataset.hello;
      const distances = route.slice(1).map((point, index) => Math.hypot(point.x - route[index].x, point.y - route[index].y));
      const total = distances.reduce((sum, distance) => sum + distance, 0);
      function complete() {
        if (disposed) return;
        // Only the final native animation's completion may mark arrival.
        arrived = true;
        renderRestingPose();
      }
      // Geometry diagnostics must not replace the approved route with a
      // stationary animation followed by a jump to finish.
      // Only the explicit reduced-motion preference suppresses travel.
      if (motion.matches) {
        animation = node!.animate([{ transform: move(start) }, { transform: move(start) }], { duration: 3600 });
        animation.onfinish = complete;
        return;
      }
      // Restore the 10:18 native engine and its distance-weighted timing (3.6s total).
      function travel(index: number) {
        if (disposed || arrived) return;
        const from = route[index], to = route[index + 1];
        node!.dataset.segment = String(index + 1);
        node!.dataset.direction = to.x < from.x ? "left" : to.x > from.x ? "right" : "down";
        const duration = 160 + (3600 - distances.length * 160) * distances[index] / total;
        animation = node!.animate([{ transform: move(from) }, { transform: move(to) }], {
          duration, easing: "ease-in-out", fill: "forwards",
        });
        animation.onfinish = () => {
          if (disposed) return;
          node!.style.transform = move(to);
          animation?.cancel();
          if (index + 1 === distances.length) complete();
          else travel(index + 1);
        };
      }
      travel(0);
    }
    function hover(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !matchMedia("(hover:hover)").matches || (node!.dataset.state === "crawling" || arrived)) return;
      node!.dataset.hello = "true";
      clearTimeout(hello);
      hello = setTimeout(() => { delete node!.dataset.hello; }, 1100);
    }
    function leave() { clearTimeout(hello); delete node!.dataset.hello; }
    // Place on mount; font loading may refine placement without another delay.
    layout();
    void document.fonts.ready.then(() => { if (!disposed && !started) layout(); });
    if (!greeted && !motion.matches) {
      blink = setTimeout(() => { greeted = true; node.dataset.blink = "true"; }, 2000);
    }
    // Independent one-shot timer: button rendering and document scroll state
    // neither start nor finish this timeline. No scroll/visibility subscriptions.
    const delay = setTimeout(begin, Math.max(0, revealAt - Date.now()));
    window.addEventListener("resize", resize);
    node.addEventListener("pointerenter", hover);
    node.addEventListener("pointerleave", leave);
    return () => {
      disposed = true;
      clearTimeout(delay); clearTimeout(blink); clearTimeout(hello);
      animation?.cancel();
      window.removeEventListener("resize", resize);
      node.removeEventListener("pointerenter", hover); node.removeEventListener("pointerleave", leave);
    };
  }, [revealAt]);

  return <div ref={actor} className={styles.actor} aria-hidden="true" data-chooni data-state="idle">
    <span className={styles.hello}><span className={styles.greeting}>hello!</span><span className={styles.explore}>Let&apos;s explore!</span></span>
    <div className={styles.facing} data-facing>
    <svg viewBox="0 0 120 140" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <g>
        {/* Raised gecko head, protruding eyes and a continuous cheek-to-cheek smile. */}
        <path data-anatomy="head" d="M48 23Q40 21 39 29C40 43 50 55 60 61L62 78M71 14L77 13L78 22Q86 26 94 31L103 29L104 34M111 49Q114 57 109 62Q101 69 91 69" />
        <g className={styles.body}><path data-anatomy="chest" d="M95 69L94 98Q83 112 58 120" />
        <path data-anatomy="torso" d="M62 78Q48 85 36 90M29 103Q18 110 20 119" /></g>
        <g className={styles.tail} data-anatomy="tail"><path d="M36 90Q31 85 28 77C26 67 18 66 11 66Q21 72 21 83C21 92 25 99 29 103M36 90Q38 93 40 94" /></g>
        <g data-limb="rear-left" className={styles.legB}><path d="M61 119L68 123L72 127L64 127L60 124" /></g>
        <g data-limb="front-left" className={styles.legA}><path d="M91 102L91 122L98 126L93 128L89 127L86 131L83 128L76 129L80 121L80 112" /></g>
        <g data-limb="rear-right" className={styles.legA}><path d="M20 119L16 124Q14 127 20 126L18 129Q21 131 25 127L29 130Q32 131 32 128L29 122Q33 116 39 112" /></g>
        <g data-limb="front-right" className={styles.legB}><path d="M49 99Q42 111 43 122L40 128L44 127L45 132Q48 133 49 129Q51 134 54 131L55 128L59 130Q63 130 59 126L55 122Q56 109 61 104Q66 96 62 78" /></g>
        <g className={styles.gaze} data-anatomy="gaze"><g className={styles.eyes}>
          <g data-eye="left"><path d="M49 31C46 24 49 15 55 13C65 9 73 16 73 24Q72 32 65 35Q54 38 49 31Z" /><ellipse data-anatomy="pupil" cx="59.5" cy="28" rx="2.2" ry="2.2" transform="rotate(12 59.5 28)" fill="currentColor" stroke="none" /></g>
          <g data-eye="right"><path d="M96 52C91 47 93 37 99 34C107 30 115 37 115 44Q115 52 108 55Q101 57 96 52Z" /><ellipse data-anatomy="pupil" cx="102.5" cy="48" rx="2.2" ry="2.2" transform="rotate(12 102.5 48)" fill="currentColor" stroke="none" /></g>
        </g></g>
        <path className={styles.mouth} data-anatomy="mouth" d="M40 28Q44 26 46 31C51 42 67 41 78 48C92 56 101 61 110 59" />
        <path strokeWidth="2" d="M74 42h.1M84 48h.1" />
      </g>
    </svg>
    </div>
  </div>;
}
