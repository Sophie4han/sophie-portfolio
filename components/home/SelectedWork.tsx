"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { HOME_CAROUSEL_ITEMS } from "@/lib/home-projects";
import styles from "./home.module.css";

export function SelectedWork() {
  const reel = useRef<HTMLDivElement>(null);
  const drag = useRef({ start: 0, scroll: 0, down: false, moved: false });
  const [active, setActive] = useState(0);
  const count = HOME_CAROUSEL_ITEMS.length;
  const lastIndex = count - 1;
  function go(index: number) {
    const viewport = reel.current;
    const item = viewport?.children[index] as HTMLElement | undefined;
    if (!viewport || !item) return;
    viewport.scrollTo({ left: item.offsetLeft - viewport.offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <section id="work" className={styles.work} aria-labelledby="work-title" aria-roledescription="carousel">
    <div className={styles.sectionHeading}><h2 id="work-title" className={styles.eyebrow}>SELECTED WORK</h2><p aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")} <span>/ {String(count).padStart(2, "0")}</span></p></div>
    <div ref={reel} className={styles.reel} tabIndex={0} aria-label="프로젝트 목록. 좌우 방향키로 이동" onKeyDown={(event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      go(event.key === "Home" ? 0 : event.key === "End" ? lastIndex : Math.max(0, Math.min(lastIndex, active + (event.key === "ArrowRight" ? 1 : -1))));
    }} onScroll={() => {
      const viewport = reel.current;
      if (!viewport) return;
      const items = Array.from(viewport.children) as HTMLElement[];
      const closest = items.reduce((best, item, index) => Math.abs(item.offsetLeft - viewport.offsetLeft - viewport.scrollLeft) < Math.abs(items[best].offsetLeft - viewport.offsetLeft - viewport.scrollLeft) ? index : best, 0);
      setActive(closest);
    }} onPointerDown={(event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag.current = { start: event.clientX, scroll: event.currentTarget.scrollLeft, down: true, moved: false };
    }} onPointerMove={(event) => {
      const state = drag.current;
      if (!state.down) return;
      const distance = event.clientX - state.start;
      if (Math.abs(distance) > 5) {
        state.moved = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging = "true";
        event.currentTarget.scrollLeft = state.scroll - distance;
      }
    }} onPointerUp={(event) => {
      drag.current.down = false;
      delete event.currentTarget.dataset.dragging;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      if (drag.current.moved) go(active);
    }} onPointerCancel={(event) => { drag.current.down = false; delete event.currentTarget.dataset.dragging; }} onClickCapture={(event) => {
      if (drag.current.moved) { event.preventDefault(); drag.current.moved = false; }
    }} onDragStart={(event) => event.preventDefault()}>
      {HOME_CAROUSEL_ITEMS.map((project, index) => <article key={project.id} className={styles.project} aria-label={`${index + 1} / ${count}: ${project.title}`}>
        <Link href={project.href} prefetch={false} className={styles.projectLink} onFocus={() => go(index)}>
          <div className={`${styles.imageFrame} ${project.id === "fitmate" ? styles.fitmate : ""}`}>{project.kind === "experience" ? <div className={styles.experienceCover} aria-hidden="true"><p className={styles.coverCaption}>started with design, then kept moving toward the questions behind it.</p><div className={styles.coverPhrases}><span>디자인으로 시작했고</span><span>고객 반응을 보며 생각이 넓어졌습니다.</span><span>운영하면서 구조를 익혔고</span><span>기획을 맡으며 제품에 더 가까이 갔습니다.</span></div></div> : <Image src={project.image} alt={project.alt} fill sizes="(max-width: 767px) 88vw, 60vw" draggable={false} />}<span className={styles.viewProject}>{project.kind === "experience" ? "View experience" : "View project"} ↗</span></div>
          <div className={styles.projectInfo}><div><h3>{project.title}<span aria-hidden="true">↗</span></h3>{project.subtitle && <p className={styles.subtitle}>{project.subtitle}</p>}<p className={styles.category}>{project.category}</p></div></div>
        </Link>
      </article>)}
    </div>
    <div className={styles.reelControls}><div className={styles.progress} aria-hidden="true"><span style={{ width: `${100 / count}%`, transform: `translateX(${active * 100}%)` }} /></div><div className={styles.arrows}><button type="button" aria-label="이전 프로젝트" disabled={active === 0} onClick={() => go(active - 1)}>←</button><button type="button" aria-label="다음 프로젝트" disabled={active === lastIndex} onClick={() => go(active + 1)}>→</button></div></div>
  </section>;
}
