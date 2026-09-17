"use client";

import Image from "next/image";
import { useState } from "react";
import { FITMATE_PROJECT, type FitMateSectionId } from "@/lib/fitmate-project";
import { loadDetailSection, saveDetailSection } from "@/lib/scene-persistence";
import type { TransitionRuntimeState } from "@/types/transition";
import styles from "./harubareun-project-detail.module.css";
import navigation from "./project-detail-navigation.module.css";
import fitmate from "./fitmate-project-detail.module.css";
import invader from "./invader-project-detail.module.css";
import { useReadingFocus } from "./use-reading-focus";
import { useDetailNavigationScroll } from "./use-detail-navigation-scroll";
import { ProductStrategySection } from "./FitMateStrategySections";
import { DesignTechnicalSection } from "./FitMateTechnicalSection";
import { FitMateTestIterationSection } from "./FitMateTestIterationSection";
import { FitMateFromPlanToProductSection } from "./FitMateFromPlanToProductSection";

interface FitMateProjectDetailProps {
  transition: TransitionRuntimeState;
  onBackToFocus: () => void;
  onBackToWorld: () => void;
}

export function FitMateProjectDetail({ transition, onBackToFocus, onBackToWorld }: FitMateProjectDetailProps) {
  const sectionIds = FITMATE_PROJECT.sections.map((section) => section.id);
  const [activeSection, setActiveSection] = useState<FitMateSectionId | null>(() =>
    loadDetailSection("fitmate", sectionIds),
  );
  const section = FITMATE_PROJECT.sections.find((item) => item.id === activeSection);
  const detailSceneRef = useReadingFocus<HTMLElement>(activeSection, styles.isReading);
  useDetailNavigationScroll(activeSection, detailSceneRef);
  const disabled = transition.phase !== "idle";
  const selectSection = (sectionId: FitMateSectionId | null) => {
    setActiveSection(sectionId);
    saveDetailSection("fitmate", sectionId);
  };

  return (
    <main ref={detailSceneRef} className={styles.detailScene} data-transition-phase={transition.phase} aria-labelledby="fitmate-detail-title">
      <div className={`${styles.atmosphere} ${fitmate.atmosphere}`} aria-hidden="true">
        <Image src="/images/pixel/world/shared/world-background-floating-v02.png" alt="" fill priority sizes="100vw" className={styles.atmosphereBackground} />
        <div className={styles.atmosphereIslandWrap}>
          <Image src="/images/pixel/world/islands/fitmate/island-fitmate-base.png" alt="" width={1920} height={1080} priority sizes="min(78vw, 1180px)" className={styles.atmosphereIsland} />
        </div>
      </div>

      <header className={navigation.header}>
        <nav className={`${navigation.actions} ${fitmate.navigationActions}`} aria-label="Project navigation">
          <button type="button" disabled={disabled} onClick={onBackToFocus} aria-label="Back to FitMate Focus">← BACK TO FOCUS</button>
          <button type="button" disabled={disabled} onClick={onBackToWorld}>WORLD</button>
        </nav>
        <span>FitMate / PROJECT DETAIL</span>
      </header>

      <div className={styles.detailContent}>
        {section ? (
          <section className={fitmate.wideDetail} aria-labelledby="fitmate-detail-title">
            <button type="button" className={styles.summaryReturn} onClick={() => selectSection(null)}>← PROJECT SUMMARY</button>
            {section.id === "product-strategy" ? <ProductStrategySection /> : section.id === "design-technical-flow" ? <DesignTechnicalSection /> : section.id === "test-iteration" ? <FitMateTestIterationSection /> : <FitMateFromPlanToProductSection />}
          </section>
        ) : (
          <>
            <FitMateSummary />
            <nav className={styles.exploration} aria-label="FitMate detailed sections">
              <div className={styles.explorationHeader}>EXPLORE THE PROJECT</div>
              <div className={styles.sectionList}>
                {FITMATE_PROJECT.sections.map((item) => (
                  <button type="button" key={item.id} className={styles.sectionItem} onClick={() => selectSection(item.id)}>
                    <span className={styles.sectionNumber}>{item.number}</span>
                    <span className={styles.sectionCopy}><strong>{item.title}</strong><span>{item.summary}</span></span>
                    <span className={styles.sectionArrow} aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </nav>
          </>
        )}
      </div>
    </main>
  );
}

function FitMateSummary() {
  return (
    <div className={fitmate.summary}>
      <section className={fitmate.summaryTop} aria-labelledby="fitmate-detail-title">
        <div className={fitmate.summaryIntro}>
          <Image className={fitmate.summaryLogo} src="/images/projects/fitmate/summary/fitmate-logo.png" alt="FitMate" width={3699} height={1119} sizes="(max-width: 760px) 65vw, 34vw" priority />
          <p className={`${styles.eyebrow} ${fitmate.summaryMotion} ${fitmate.introEyebrow} ${invader.heroBrand}`}>FITMATE / iOS FITNESS APP</p>
          <h1 id="fitmate-detail-title" className={`${fitmate.summaryHeadline} ${fitmate.summaryMotion} ${fitmate.introHeadline} ${invader.heroBrand}`}>운동 메이트와 함께 기록하고,<br />경쟁하고, 성장하는 피트니스 앱</h1>
          <p className={`${styles.bodyCopy} ${fitmate.summaryDescription} ${fitmate.summaryMotion} ${fitmate.introDescription} ${invader.heroBrand}`}>메이트와 운동 기록을 공유하고, 협동과 대결, 보상 경험을 통해 운동 지속을 돕는 iOS 피트니스 앱입니다.</p>
        </div>

        <dl className={fitmate.summaryInfo}>
          <div><dt><span className={`${fitmate.summaryMotion} ${fitmate.infoNumber} ${invader.heroBrand}`}>01</span><span className={`${fitmate.summaryMotion} ${fitmate.infoLabel} ${invader.heroBrand}`}>PROJECT</span></dt><dd><strong className={`${fitmate.summaryMotion} ${fitmate.infoMain} ${invader.heroBrand}`}>FitMate</strong><span className={`${fitmate.summaryMotion} ${fitmate.infoSub} ${invader.heroBrand}`}>iOS Fitness Matching App</span><span className={`${fitmate.summaryMotion} ${fitmate.infoMeta} ${invader.heroBrand}`}>Swift · Xcode</span></dd></div>
          <div><dt><span className={`${fitmate.summaryMotion} ${fitmate.infoNumber} ${invader.heroBrand}`}>02</span><span className={`${fitmate.summaryMotion} ${fitmate.infoLabel} ${invader.heroBrand}`}>ROLE</span></dt><dd><strong className={`${fitmate.summaryMotion} ${fitmate.infoMain} ${invader.heroBrand}`}>Product Planning<br />UX/UI Structure &amp; Direction<br />iOS Development</strong><span className={`${fitmate.summaryMotion} ${fitmate.infoSub} ${invader.heroBrand}`}>서비스 구조와 화면 경험을 설계하고,<br />실제 구현과 개선까지 참여했습니다.</span></dd></div>
          <div><dt><span className={`${fitmate.summaryMotion} ${fitmate.infoNumber} ${invader.heroBrand}`}>03</span><span className={`${fitmate.summaryMotion} ${fitmate.infoLabel} ${invader.heroBrand}`}>KEY SCOPE</span></dt><dd><strong className={`${fitmate.summaryMotion} ${fitmate.infoMain} ${invader.heroBrand}`}>Onboarding · Mate Matching · Main Experience</strong><span className={`${fitmate.summaryMotion} ${fitmate.infoSub} ${invader.heroBrand}`}>Avatar · Reward Shop · UX Iteration</span></dd></div>
          <div><dt><span className={`${fitmate.summaryMotion} ${fitmate.infoNumber} ${invader.heroBrand}`}>04</span><span className={`${fitmate.summaryMotion} ${fitmate.infoLabel} ${invader.heroBrand}`}>PROCESS</span></dt><dd><strong className={`${fitmate.summaryMotion} ${fitmate.infoMain} ${invader.heroBrand}`}>Planning → UX/UI → Development → UT → Iteration</strong></dd></div>
          <div><dt><span className={`${fitmate.summaryMotion} ${fitmate.infoNumber} ${invader.heroBrand}`}>05</span><span className={`${fitmate.summaryMotion} ${fitmate.infoLabel} ${invader.heroBrand}`}>COLLABORATION</span></dt><dd><strong className={`${fitmate.summaryMotion} ${fitmate.infoMain} ${invader.heroBrand}`}>Planning / UX Direction / Development — Han Yeojeong</strong><span className={`${fitmate.summaryMotion} ${fitmate.infoSub} ${invader.heroBrand}`}>Visual Design — Collaborating Designer<br />Development — iOS Team</span></dd></div>
        </dl>
      </section>

      <section className={fitmate.coreExperience} aria-labelledby="fitmate-core-title">
        <div className={fitmate.coreDivider}><span data-reading-focus>CORE PRODUCT EXPERIENCE</span><span data-reading-focus>MATE · RECORD · GROW · COOPERATE · COMPETE</span></div>
        <p className={`${styles.eyebrow} ${fitmate.coreLabel}`} data-reading-focus>CORE EXPERIENCE</p>
        <h2 id="fitmate-core-title" data-reading-focus>함께 시작하고, 기록하고,<br />경쟁하며 운동을 지속하는 하나의 흐름</h2>
        <div className={`${fitmate.screenScroll} ${invader.carouselColumn}`} tabIndex={0} role="region" aria-label="FitMate 앱 화면 5개, 모바일에서는 가로로 스크롤">
          <Image className={fitmate.fiveScreens} src="/images/projects/fitmate/summary/fitmate-five-screens.png" alt="메이트 시스템, 운동 기록, 마이페이지, 협동 목표, 대결 목표의 FitMate 앱 화면 5개" width={7094} height={2778} sizes="(max-width: 760px) 1100px, min(1320px, calc(100vw - 96px))" />
        </div>
      </section>
    </div>
  );
}
