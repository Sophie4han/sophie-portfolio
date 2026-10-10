"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { TransitionRuntimeState } from "@/types/transition";
import { FitMateProblemSection, FitMateCoreExperienceSection, FitMateMvpSection } from "./FitMateStrategySections";
import { FitMateDesignStatesSection, FitMateBuildSection } from "./FitMateTechnicalSection";
import { FitMateTestIterationSection, FitMateShippedSection } from "./FitMateTestIterationSection";
import { FitMateMakeItWorkSection, FitMateFromPlanToProductSection, FitMateReflectionSection } from "./FitMateFromPlanToProductSection";
import s from "./fitmate-editorial.module.css";

interface FitMateProjectDetailProps {
  transition?: TransitionRuntimeState;
  onBackToFocus?: () => void;
  onBackToWorld?: () => void;
}

export function FitMateProjectDetail({ transition }: FitMateProjectDetailProps = {}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const scroller = node.closest<HTMLElement>("[data-project-content]");
    const sequences = [...node.querySelectorAll<HTMLElement>("[data-sequence]")].map(element => ({element, steps:[...element.querySelectorAll<HTMLElement>(":scope > [data-flow-step]")]}));
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = scroller?.getBoundingClientRect();
      const top = bounds?.top ?? 0, height = bounds?.height ?? innerHeight;
      for (const {element,steps} of sequences) {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < top || rect.top > top + height) continue;
        const progress = Math.max(0,Math.min(.999,(top + height * .72 - rect.top)/(rect.height + height * .35)));
        const index = Math.floor(progress * steps.length);
        steps.forEach((step,i) => { step.dataset.active = String(i === index); });
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const target = scroller ?? window;
    target.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(node);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting) { entry.target.setAttribute("data-seen","true"); observer.unobserve(entry.target); } });
    }, {root:scroller,threshold:0.05});
    node.querySelectorAll("[data-fitmate-chapter] > header").forEach(el=>observer.observe(el));
    update();
    return () => { target.removeEventListener("scroll",schedule); window.removeEventListener("resize",schedule); resize.disconnect(); observer.disconnect(); cancelAnimationFrame(frame); };
  },[]);

  return <main ref={root} className={s.page} aria-labelledby="fitmate-detail-title" data-transition-phase={transition?.phase}>
    <div className={s.content}>
      <header className={s.hero}>
        <div className={s.heroTop}><span className={s.label}>FITMATE / iOS TEAM PRODUCT</span><span className={s.release}>APP STORE RELEASED ↗</span></div>
        <h1 id="fitmate-detail-title">From user flow<br />to <em>working product.</em></h1>
        <div className={s.heroCopy}><p>혼자 기록하는 운동 앱이 아니라, 누군가와 연결되어 함께 운동을 이어갈 수 있는 경험을 만들고 싶었습니다.</p><p>서비스 구조와 핵심 사용자 흐름을 기획하고, UX/UI 방향을 잡은 뒤 Swift 기반 iOS 구현까지 직접 참여했습니다. 실제 사용자 테스트에서 발견한 문제를 다시 수정하고, App Store 출시까지 이어간 팀 프로젝트입니다.</p></div>
        <dl className={s.meta}><div><dt>MY ROLE</dt><dd>Product Planning · UX/UI Structure &amp; Direction · iOS Development</dd></div><div><dt>COLLABORATION</dt><dd>Visual Design — Collaborating Designer<br />Development — iOS Team</dd></div></dl>
        <figure className={s.heroVisual}><Image src="/images/projects/fitmate/summary/fitmate-five-screens.png" alt="메이트 시스템, 운동 기록, 마이페이지, 협동 목표, 대결 목표의 FitMate 앱 화면" width={7094} height={2778} sizes="(max-width:760px) 100vw, 1280px" priority /><figcaption>TEAM PRODUCT · Mate / Record / Growth / Cooperate / Compete</figcaption></figure>
      </header>
      <FitMateProblemSection /><FitMateCoreExperienceSection /><FitMateMvpSection />
      <FitMateMakeItWorkSection /><FitMateDesignStatesSection /><FitMateBuildSection />
      <FitMateTestIterationSection /><FitMateShippedSection /><FitMateFromPlanToProductSection /><FitMateReflectionSection />
    </div>
    <footer className={s.marquee} aria-label="Thanks for reading!"><div aria-hidden="true">{[0,1].map(group=><span key={group}>{[0,1,2,3].map(i=><span key={i}>Thanks for <em>reading!</em> <b>♥</b> </span>)}</span>)}</div></footer>
  </main>;
}
