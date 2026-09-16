"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { INVADER_PROJECT, type InvaderSectionId } from "@/lib/invader-project";
import { loadDetailSection, saveDetailSection } from "@/lib/scene-persistence";
import type { TransitionRuntimeState } from "@/types/transition";
import styles from "./harubareun-project-detail.module.css";
import navigation from "./project-detail-navigation.module.css";
import invader from "./invader-project-detail.module.css";
import { useReadingFocus } from "./use-reading-focus";

interface InvaderProjectDetailProps {
  transition: TransitionRuntimeState;
  onBackToFocus: () => void;
  onBackToWorld: () => void;
}

export function InvaderProjectDetail({ transition, onBackToFocus, onBackToWorld }: InvaderProjectDetailProps) {
  const sectionIds = INVADER_PROJECT.sections.map((section) => section.id);
  const [activeSection, setActiveSection] = useState<InvaderSectionId | null>(() =>
    loadDetailSection("project-02", sectionIds),
  );
  const section = INVADER_PROJECT.sections.find((item) => item.id === activeSection);
  const detailSceneRef = useReadingFocus<HTMLElement>(activeSection, styles.isReading);
  const disabled = transition.phase !== "idle";
  const selectSection = (sectionId: InvaderSectionId | null) => {
    setActiveSection(sectionId);
    saveDetailSection("project-02", sectionId);
  };

  return (
    <main ref={detailSceneRef} className={styles.detailScene} data-transition-phase={transition.phase} aria-labelledby="invader-detail-title">
      <div className={`${styles.atmosphere} ${invader.atmosphere}`} aria-hidden="true">
        <Image src="/images/pixel/world/shared/world-background-floating-v02.png" alt="" fill priority sizes="100vw" className={styles.atmosphereBackground} />
        <div className={styles.atmosphereIslandWrap}>
          <Image src="/images/pixel/world/islands/invader/island-invader-base.png" alt="" width={1920} height={1080} priority sizes="min(78vw, 1180px)" className={styles.atmosphereIsland} />
        </div>
      </div>

      <header className={navigation.header}>
        <nav className={`${navigation.actions} ${invader.navigationActions}`} aria-label="Project navigation">
          <button type="button" disabled={disabled} onClick={onBackToFocus} aria-label="Back to INVADER Focus">← BACK TO FOCUS</button>
          <button type="button" disabled={disabled} onClick={onBackToWorld}>WORLD</button>
        </nav>
        <span>INVADER / PROJECT DETAIL</span>
      </header>

      <div className={styles.detailContent}>
        {section ? (
          <section className={`${styles.strategyDetail} ${section.id === "value" ? invader.planningDetail : section.id === "experience" ? invader.liveDetail : section.id === "signal" ? invader.operationDetail : invader.performanceDetail}`} aria-labelledby="invader-detail-title">
            <button type="button" className={styles.summaryReturn} onClick={() => selectSection(null)}>← PROJECT SUMMARY</button>
            <div className={styles.strategyHeading}>
              <span className={styles.eyebrow}>{section.number}</span>
              <h1 id="invader-detail-title">{section.title}</h1>
            </div>
            <h2 className={section.id === "value" ? `${styles.productLead} ${invader.valueTitle}` : section.id === "experience" ? `${styles.productLead} ${invader.experienceTitle}` : section.id === "signal" ? `${styles.productLead} ${invader.operationTitle}` : `${styles.productLead} ${invader.performanceTitle}`}>{section.summary}</h2>
            {section.id === "value" && <ProductValueBody />}
            {section.id === "experience" && <PurchaseExperienceBody />}
            {section.id === "signal" && <FunnelSignalBody />}
            {section.id === "performance" && <PerformanceBody />}
          </section>
        ) : (
          <InvaderSummary onSelectSection={selectSection} />
        )}
      </div>
    </main>
  );
}

const lectures = [
  { category: "AIRBNB / HOSPITALITY", name: "월세여왕 리나쌤", image: "/images/projects/invader/summary/rina-airbnb.jpg" },
  { category: "AI YOUTUBE", name: "유부녀들", image: "/images/projects/invader/summary/yubunyeodeul-ai-youtube.jpg" },
  { category: "BRAND COMMERCE", name: "파이어스 김준서", image: "/images/projects/invader/summary/fires-brand-commerce.png" },
] as const;

function InvaderSchoolLogo() {
  return <Image className={invader.schoolLogo} src="/images/projects/invader/summary/invader-school-logo-white.png" alt="인베이더스쿨" width={2069} height={555} priority />;
}

function InvaderSummary({ onSelectSection }: { onSelectSection: (sectionId: InvaderSectionId) => void }) {
  const [activeLecture, setActiveLecture] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const moveTo = (nextIndex: number) => {
    const index = (nextIndex + lectures.length) % lectures.length;
    setActiveLecture(index);
    carouselRef.current?.children[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const updateActiveFromScroll = () => {
    const track = carouselRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const cards = Array.from(track.children) as HTMLElement[];
    const nearest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return distance < best.distance ? { index, distance } : best;
    }, { index: activeLecture, distance: Number.POSITIVE_INFINITY });
    setActiveLecture(nearest.index);
  };

  return (
    <div className={invader.summary}>
      <section className={invader.summaryHero} aria-labelledby="invader-detail-title">
        <div className={invader.heroBrand}>
          <InvaderSchoolLogo />
          <span className={styles.eyebrow}>INVADER SCHOOL · CONTENT PRODUCT</span>
        </div>
        <div className={invader.heroHeadline}>
          <h1 id="invader-detail-title">From Expertise to Marketable Product</h1>
        </div>
        <div className={invader.heroDivider} aria-hidden="true" />

        <div className={invader.heroColumns}>
          <div className={invader.heroCopy}>
          <div className={invader.role}>Content Product PM · Planning &amp; Operations</div>
          <p className={`${invader.oneLineSummary} ${styles.bodyCopy}`} data-reading-focus>강사의 전문성을 고객이 구매할 수 있는 교육 Product로 구체화하고, 기획부터 무료강의·CRM·Live Sales·본강의 전환까지 Product Funnel을 운영했습니다.</p>
          <div className={invader.introCopy}>
            <p className={styles.bodyCopy} data-reading-focus>강사가 가진 경력과 노하우가 그대로 상품이 되는 것은 아니었습니다. 기획 미팅을 통해 강사의 실제 경쟁력과 고객에게 전달할 핵심 가치를 정리하고, 이를 무료강의와 상세페이지의 세일즈 메시지로 구체화했습니다.</p>
            <p className={styles.bodyCopy} data-reading-focus>이후 리허설을 통해 고객이 궁금해하거나 망설일 지점을 점검하고, CRM·Live Sales·수강생 온보딩까지 이어지는 운영 플로우를 관리했습니다. 강의 이후에는 신청자·시청자·결제자 등 주요 전환 지표를 동일한 기준으로 트래킹했습니다.</p>
          </div>
          </div>

          <div className={invader.carouselColumn}>
          <div className={invader.carousel} ref={carouselRef} onScroll={updateActiveFromScroll} tabIndex={0} role="region" aria-label="강의 사례 carousel" onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); moveTo(activeLecture - 1); }
            if (event.key === "ArrowRight") { event.preventDefault(); moveTo(activeLecture + 1); }
          }}>
            {lectures.map((lecture, index) => (
              <figure className={invader.lectureCard} data-active={activeLecture === index} key={lecture.name}>
                <Image src={lecture.image} alt={`${lecture.name} 강의 썸네일`} width={1200} height={775} sizes="(max-width: 760px) 78vw, 430px" priority={index === 0} />
                <figcaption><span>{lecture.category}</span><strong>{lecture.name}</strong></figcaption>
              </figure>
            ))}
          </div>
          <div className={invader.carouselControls}>
            <button type="button" onClick={() => moveTo(activeLecture - 1)} aria-label="이전 강의">←</button>
            <span>{String(activeLecture + 1).padStart(2, "0")} / 03</span>
            <button type="button" onClick={() => moveTo(activeLecture + 1)} aria-label="다음 강의">→</button>
          </div>
          <p className={invader.carouselStatement}><strong>Multiple Categories, One Product Framework</strong><span>서로 다른 강사와 시장을 하나의 교육상품 기획·운영 구조로 연결했습니다.</span></p>
          </div>
        </div>
      </section>

      <section className={`${invader.summarySection} ${invader.challengeSection}`} aria-labelledby="invader-challenge-title">
        <span className={styles.eyebrow}>CHALLENGE</span>
        <h2 id="invader-challenge-title">전문성을 가진 강사를<br />‘구매할 이유가 있는 Product’로 만드는 것.</h2>
        <p className={`${invader.sectionIntro} ${styles.bodyCopy}`} data-reading-focus>같은 교육상품이라도 강사의 강점, 시장, 고객의 우려는 모두 달랐습니다. 새로운 상품에서는 강사의 핵심 경쟁력을 발견하고, 기존 상품에서는 고객이 이해하지 못하거나 망설이는 지점을 다시 정리해야 했습니다.</p>
        <div className={invader.challengeGrid}>
          <article><span>01 / NEW PRODUCT</span><h3>강사의 실제 경쟁력을 어떻게 발견하고<br />고객이 이해하는 구매 이유로 만들 것인가?</h3><p>Expertise → USP → Product Message</p></article>
          <article><span>02 / EXISTING PRODUCT</span><h3>이미 존재하는 강의에서<br />고객이 망설이는 지점을 무엇부터 다시 설계할 것인가?</h3><p>Customer Objection → Content Revision → Sales Flow</p></article>
        </div>
      </section>

      <section className={invader.summarySection} aria-labelledby="invader-product-flow-title">
        <span className={styles.eyebrow}>PRODUCT FLOW</span>
        <h2 id="invader-product-flow-title" className={invader.visuallyHidden}>교육 상품 기획과 운영 흐름</h2>
        <ol className={invader.productFlow}>
          {[["EXPERTISE", "강사의 경험과 성과"], ["PRODUCT", "상품 아이템 · USP"], ["CONTENT", "상세페이지 · 무료강의"], ["CONVERSION", "CRM · LIVE SALES"], ["OPERATION", "결제 · 수강생 온보딩"], ["TRACKING", "신청 · 시청 · 결제 지표"]].map(([title, copy]) => <li key={title}><i aria-hidden="true" /><strong>{title}</strong><span>{copy}</span></li>)}
        </ol>
      </section>

      <section className={invader.summarySection} aria-labelledby="invader-scope-title">
        <span className={styles.eyebrow}>MY SCOPE</span>
        <h2 id="invader-scope-title" className={invader.visuallyHidden}>프로젝트 담당 범위</h2>
        <div className={invader.scopeGrid}>
          {[["Product Planning", "강사 분석 · 아이템 정리 · 핵심 메시지 기획"], ["Sales Content", "상세페이지 · 무료강의 구성 · 리허설 피드백"], ["CRM & Live Operation", "문자 · 채널톡 · 오픈톡 · 라이브 세일즈 운영"], ["Performance Tracking", "신청 · 톡방 입장 · 시청 · 결제 데이터 관리"]].map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p className={styles.bodyCopy} data-reading-focus>{copy}</p></article>)}
        </div>
      </section>

      <nav className={styles.exploration} aria-label="INVADER detailed sections">
        <div className={styles.explorationHeader}>EXPLORE THE PROJECT</div>
        <div className={styles.sectionList}>{INVADER_PROJECT.sections.map((item) => <button type="button" key={item.id} className={styles.sectionItem} onClick={() => onSelectSection(item.id)}><span className={styles.sectionNumber}>{item.number}</span><span className={styles.sectionCopy}><strong>{item.title}</strong><span>{item.summary}</span></span><span className={styles.sectionArrow} aria-hidden="true">↗</span></button>)}</div>
      </nav>
    </div>
  );
}

function ProductValueBody() {
  return (
    <div className={invader.planningNarrative}>
      <section className={invader.planningIntro} aria-labelledby="planning-intro-title">
        <div>
          <h3 id="planning-intro-title" className={invader.visuallyHidden}>Product Planning 소개</h3>
          <div className={invader.planningBody}>
            <p className={styles.bodyCopy} data-reading-focus>강사의 경력과 성과를 그대로 나열하는 것만으로는 고객의 구매 이유가 되지 않았습니다. 기획 미팅을 통해 실제 경쟁력과 운영 방식, 고객이 매력을 느낄 요소를 정리하고, 이를 상품 메시지와 무료강의 구조로 구체화했습니다.</p>
            <p className={styles.bodyCopy} data-reading-focus>이후 리허설에서는 고객이 궁금해하거나 망설이는 지점을 기준으로 후킹, 사례, 비교 포인트, 예상 반론의 순서를 조정하며 세일즈 흐름을 다듬었습니다.</p>
          </div>
        </div>
        <div className={invader.planningSummaryGrid}>
          {[["RAW EXPERTISE", "강사의 실제 성과와 운영 경험 정리"], ["PRODUCT MESSAGE", "무엇을 팔 것인지 한 문장으로 정의"], ["OBJECTION HANDLING", "고객이 망설이는 이유를 먼저 구조화"], ["REHEARSAL REFINEMENT", "결제되는 강의 흐름으로 재정렬"]].map(([title, copy]) => <article key={title}><strong>{title}</strong><span data-reading-focus>{copy}</span></article>)}
        </div>
      </section>
      <p className={invader.planningBridge}>경력 소개를 넘어, 고객이 이해하고 결제할 수 있는 Product 구조를 설계했습니다.</p>

      <PlanningBlock label="01 / RAW EXPERTISE" title={<>강사가 잘하는 것을 그대로 나열하지 않고,<br />무엇이 고객에게 구매 이유가 되는지 다시 분해했습니다.</>}>
        <p className={styles.bodyCopy} data-reading-focus>김준서님은 단순히 브랜드 상품을 판매해본 셀러가 아니라, 디자인·마케팅 경험과 실제 판매 성과, 그리고 운영 시스템까지 함께 설명할 수 있는 강사였습니다. 상품 기획 단계에서는 이러한 강점 중 무엇을 전면에 세우고, 무엇을 고객 언어로 재해석할지 정리하는 작업이 먼저 필요했습니다.</p>
        <div className={invader.evidenceSplit}>
          <EvidenceFigure src="/images/projects/invader/product-planning/planning-meeting.png" width={920} height={942} alt="김준서 강사 기획 미팅 정리 자료" caption="강사 정보, 판매 경험, 주력 브랜드, 초기 자본, 판매 방식 등 상품 기획의 핵심 입력값을 먼저 정리했다." />
          <div className={invader.factGrid}>{[["BACKGROUND", "IT 디자인·마케팅 경험"], ["BUSINESS PROOF", "운영하던 스마트스토어 2억 매각"], ["CORE CATEGORY", "나이키 · 크록스 · 뉴발 · 아디다스"], ["ENTRY BARRIER", "초기 자본 2~3백만 원"], ["SALES STRENGTH", "구매대행보다 브랜드 판매가 구매 전환 빠름"], ["SOCIAL PROOF", "30억 매출 / 에이블리 6000개 리뷰"]].map(([title, copy]) => <article key={title}><strong>{title}</strong><span data-reading-focus>{copy}</span></article>)}</div>
        </div>
      </PlanningBlock>

      <section className={invader.planningDiagram} aria-label="강사의 전문성을 교육 상품으로 전환하는 과정">
        <ol>{[["EXPERTISE", "강사의 경험과 성과"], ["PROOF", "실제 판매 성과와 운영 경험"], ["ADVANTAGE", "타 부업 대비 강점"], ["CUSTOMER VALUE", "고객이 얻는 실질 이점"], ["PRODUCT MESSAGE", "브랜드 셀링 교육상품"]].map(([title, copy]) => <li key={title}><strong>{title}</strong><span data-reading-focus>{copy}</span></li>)}</ol>
        <p>경력 소개가 아니라,<br />고객이 이해할 수 있는 Product 구조로 번역했습니다.</p>
      </section>

      <div className={invader.planningTwoColumn}>
        <PlanningBlock label="02 / PRODUCT MESSAGE" title={<>정보를 많이 전달하는 것보다,<br />한 문장으로 이해되는 상품 정의가 먼저였습니다.</>}>
          <p className={styles.bodyCopy} data-reading-focus>기획 단계에서는 브랜드 커머스, 브랜드 판매, 브랜드 셀링 등 여러 표현을 검토하며 김준서님이 가진 강점이 가장 명확하게 전달되는 메시지를 정리했습니다. 상품을 낯설게 보이게 하기보다, “검증된 브랜드를 활용해 빠르게 시작할 수 있는 실전 판매 방식”으로 인식되도록 방향을 맞췄습니다.</p>
          <EvidenceFigure src="/images/projects/invader/product-planning/thumbnail-message.png" width={992} height={352} alt="브랜드 셀링 강의 썸네일명 검토 자료" caption="여러 후보를 비교한 뒤 브랜드 셀링과 실행 속도를 함께 전달하는 메시지로 좁혔다." />
          <div className={invader.messageComparison}><div><span>BEFORE</span><strong data-reading-focus>브랜드 판매를 알려주는 강의</strong></div><div><span>AFTER</span><strong data-reading-focus>검증된 브랜드를 활용해 소자본으로 시작하는 브랜드 셀링 시스템</strong></div></div>
          <div className={invader.miniPointGrid}>{[["LOW BARRIER", "도매처 없이도 시작 가능"], ["FAST EXECUTION", "등록까지 빠르게 실행 가능"], ["SYSTEMIZED OPERATION", "복잡한 제작 없이 운영 구조 이해 가능"]].map(([title, copy]) => <article key={title}><strong>{title}</strong><span data-reading-focus>{copy}</span></article>)}</div>
        </PlanningBlock>
        <PlanningBlock label="03 / CONTENT ANGLE" title={<>상품의 가치는 설명만으로 전달되지 않기 때문에,<br />고객이 ‘살고 싶은 장면’을 먼저 설계했습니다.</>}>
          <p className={styles.bodyCopy} data-reading-focus>유튜브와 썸네일 기획에서는 브랜드 상품 그 자체보다 어떤 삶과 결과로 이어지는지가 보이도록 콘셉트를 구성했습니다. 집, 사무실, 차량, 재고, 실제 판매 장면은 모두 상품의 신뢰와 현실성을 강화하는 시각적 장치로 활용되었습니다.</p>
          <EvidenceFigure src="/images/projects/invader/product-planning/youtube-concept.png" width={696} height={1120} alt="브랜드 셀링 유튜브 콘텐츠 콘셉트 기획 자료" caption="장소와 상품, 판매 장면을 조합해 현실적인 수익 모델이 보이도록 콘텐츠 각도를 설계했다." />
          <div className={invader.miniPointGrid}>{[["SCENE", "집 / 사무실 / 차량"], ["ITEM", "브랜드 신발 / 재고 / 상품 이미지"], ["ANGLE", "반값 소싱 / 실제 매출 / 라이프스타일 변화"], ["GOAL", "막연한 부업이 아니라 현실적인 수익 모델처럼 보이게 하기"]].map(([title, copy]) => <article key={title}><strong>{title}</strong><span data-reading-focus>{copy}</span></article>)}</div>
        </PlanningBlock>
      </div>

      <div className={invader.planningTwoColumn}>
        <PlanningBlock label="04 / VALUE PROPOSITION" title={<>강점을 더하는 것만큼,<br />비교와 반박의 논리를 세우는 일이 중요했습니다.</>}>
          <p className={styles.bodyCopy} data-reading-focus>무료강의와 세일즈 메시지에서는 단순한 장점 소개보다 다른 부업 방식과 비교했을 때 왜 브랜드 셀링이 더 현실적인지 설명하는 구조가 필요했습니다. 초기 자본, 반품·불량 리스크, 운영 시간, 상세페이지 제작 부담 등 고객이 실제로 따지는 기준으로 비교 포인트를 정리했습니다.</p>
          <EvidenceFigure src="/images/projects/invader/product-planning/value-comparison.png" width={822} height={836} alt="브랜드 셀링 주요 세일즈 포인트 비교 및 반박 자료" caption="다른 판매 방식과 비교해 고객이 실제로 판단하는 비용과 리스크를 중심으로 강점을 구조화했다." />
          <div className={invader.miniPointGrid}>{[["VS 중국 사입", "최소 주문 수량과 초기비용 부담이 큼"], ["VS 구매대행", "반품·불량 리스크와 손실 가능성 존재"], ["브랜드 셀링의 강점", "검증된 상품, 낮은 진입장벽, 빠른 전환"], ["운영 구조", "직접 포장·재고 부담 없이 시스템 중심 운영"]].map(([title, copy]) => <article key={title}><strong>{title}</strong><span data-reading-focus>{copy}</span></article>)}</div>
        </PlanningBlock>
        <PlanningBlock label="05 / CUSTOMER OBJECTION" title={<>무엇을 가르칠까보다,<br />왜 아직 결제하지 않을까를 먼저 봤습니다.</>}>
          <p className={styles.bodyCopy} data-reading-focus>리허설 전후로는 고객이 가장 자주 가질 질문을 미리 구조화해 무료강의 안에서 자연스럽게 해소되도록 순서를 조정했습니다. 이 과정은 단순한 Q&amp;A 준비가 아니라, 결제를 방해하는 인식을 먼저 다루는 상품 설계에 가까웠습니다.</p>
          <EvidenceFigure src="/images/projects/invader/product-planning/customer-objections.png" width={942} height={578} alt="무료강의 Q&A 및 예상 반박 구성 자료" caption="시장 포화, 노하우, 신규 진입, 리스크와 판매 관련 오해를 사전에 다루도록 질문을 정리했다." />
          <div className={invader.objectionTableWrap}>
            <table className={invader.objectionTable}>
              <thead><tr><th scope="col">TYPE</th><th scope="col">CUSTOMER QUESTION</th><th scope="col">RESPONSE</th></tr></thead>
              <tbody>{[["MARKET SATURATION", "이미 파는 사람이 많지 않나?", "시장 구조와 실제 운영 사례 제시"], ["KNOW-HOW", "브랜드를 몰라도 가능한가?", "초보자도 이해할 수 있는 방식으로 설명"], ["NEW ENTRY", "리뷰 없는 신규 상품도 팔릴까?", "신규 등록과 판매 방식 안내"], ["RISK", "가품 이슈는 어떻게 해결하나?", "소싱 기준과 리스크 관리 제시"], ["LEGAL / REPORT", "브랜드 상품 판매가 문제없나?", "실무 기준에서 오해 요소 먼저 해소"]].map(([title, question, answer]) => <tr key={title}><th scope="row">{title}</th><td><span data-reading-focus>{question}</span></td><td><span data-reading-focus>{answer}</span></td></tr>)}</tbody>
            </table>
          </div>
        </PlanningBlock>
      </div>

      <PlanningBlock label="06 / REHEARSAL REFINEMENT" title={<>좋은 정보가 결제되는 강의가 되기 위해서는<br />‘무엇을 말할지’만큼 ‘어떻게 말할지’도 중요했습니다.</>}>
        <div className={invader.rehearsalCopy}>
          <p className={styles.bodyCopy} data-reading-focus>2차 리허설에서는 강의 톤과 전달 방식까지 함께 다듬었습니다. 전문 용어는 줄이고, 초보자도 이해할 수 있는 쉬운 비유를 사용했으며, 도입부에서는 신발이라는 카테고리의 필수 수요를 먼저 강조해 고객이 즉시 공감할 수 있도록 방향을 맞췄습니다.</p>
          <p className={styles.bodyCopy} data-reading-focus>또한 수익 인증, 온라인 소싱의 현실성, 프리미엄 구조의 이해도를 높이는 방식 등 정규강의 전환에 직접 연결되는 포인트를 중심으로 무료강의의 흐름을 재정렬했습니다.</p>
        </div>
        <div className={invader.evidenceSplit}>
          <EvidenceFigure src="/images/projects/invader/product-planning/rehearsal-feedback.png" width={970} height={974} alt="김준서 강사 2차 리허설 피드백 자료" caption="전문 용어와 정보 나열을 줄이고 수요, 신뢰, 가치, 반론, 사례가 순서대로 이해되도록 전달 흐름을 조정했다." />
          <div className={invader.rehearsalDiagram}><div><span>BEFORE</span>{["강사 중심 설명", "정보 나열", "노하우 설명", "세일즈"].map((item) => <strong key={item} data-reading-focus>{item}</strong>)}</div><div><span>AFTER</span>{[["HOOK", "왜 지금 들어야 하는가"], ["TRUST", "왜 이 강사인가"], ["VALUE", "무엇을 얻는가"], ["OBJECTION", "왜 망설일 필요가 없는가"], ["EVIDENCE", "실제 수익과 사례"], ["ACTION", "정규강의 전환"]].map(([title, copy]) => <strong key={title}><b>{title}</b><i data-reading-focus>{copy}</i></strong>)}</div></div>
        </div>
      </PlanningBlock>

      <footer className={invader.planningEnding}>
        <p>강사의 경험을 그대로 판매하지 않았습니다.<br />고객이 이해하고, 신뢰하고, 결제할 수 있는 Product 구조로 번역했습니다.</p>
        <span>이렇게 정리한 상품 가치는 이후 상세페이지와 세일즈 메시지 설계로 이어졌습니다.</span>
      </footer>
    </div>
  );
}

function PlanningBlock({ label, title, children }: { label: string; title: ReactNode; children: ReactNode }) {
  return <section className={invader.planningBlock}><span className={styles.eyebrow}>{label}</span><h3>{title}</h3>{children}</section>;
}

function EvidenceFigure({ src, width, height, alt, caption }: { src: string; width: number; height: number; alt: string; caption: string }) {
  return <figure className={invader.evidencePanel}><div><Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 760px) 92vw, 440px" /></div><figcaption data-reading-focus>{caption}</figcaption></figure>;
}

function PurchaseExperienceBody() {
  return (
    <div className={invader.liveNarrative}>
      <div className={invader.liveIntro}>
        <p className={styles.bodyCopy} data-reading-focus>무료강의는 단순히 많은 정보를 전달하는 자리가 아니었습니다.</p>
        <p className={styles.bodyCopy} data-reading-focus>시청자가 어느 지점에서 흥미를 잃고, 어떤 질문 때문에 구매를 망설이는지를 기준으로 강의 전후의 콘텐츠 흐름을 함께 점검했습니다.</p>
        <p className={styles.bodyCopy} data-reading-focus>강사 인터뷰를 통해 실제 경험과 성과를 먼저 정리하고, 카페 콘텐츠와 상세페이지를 통해 강사의 전문성과 상품 메시지를 사전에 전달했습니다.</p>
        <p className={styles.bodyCopy} data-reading-focus>이후 리허설에서는 도입부의 후킹, 강사의 신뢰도, 실제 성과와 수익 Evidence, 경쟁 방식과 예상 반론을 다시 배치하며 고객의 이해 → 신뢰 → 확신 → 행동으로 이어지는 흐름을 구체화했습니다.</p>
      </div>

      <LiveBlock label="01 / PRE-LIVE INTERVIEW" title={<>강의를 시작하기 전에,<br />먼저 ‘왜 이 강사의 이야기를 들어야 하는가’를 정리했습니다.</>}>
        <div className={invader.liveBody}><p className={styles.bodyCopy} data-reading-focus>무료강의 이전에는 강사 인터뷰를 통해 경력, 실제 성과, 사업 경험과 강의에서 강조할 핵심 노하우를 먼저 정리했습니다.</p><p className={styles.bodyCopy} data-reading-focus>강사가 가진 경험을 그대로 나열하기보다, 고객이 신뢰의 근거로 받아들일 수 있는 정보와 무료강의의 도입부에서 활용할 메시지를 선별했습니다.</p></div>
        <ProcessDiagram items={[["INTERVIEW", "강사의 경험"], ["EXTRACT", "경력 · 성과 · 노하우"], ["SELECT", "고객에게 신뢰가 되는 근거"], ["MESSAGE", "무료강의와 사전 콘텐츠의 핵심 메시지"]]} label="사전 인터뷰 메시지 선별 과정" />
      </LiveBlock>

      <LiveBlock label="02 / PRE-LIVE CONTENT" title={<>강의 당일 처음 신뢰를 만드는 것이 아니라,<br />강의 전부터 기대와 맥락을 만들었습니다.</>}>
        <div className={invader.liveBody}><p className={styles.bodyCopy} data-reading-focus>강사 인터뷰에서 정리한 내용을 바탕으로 카페에 강사 소개와 사전 콘텐츠를 발행했습니다.</p><p className={styles.bodyCopy} data-reading-focus>고객이 라이브에 입장하기 전에 강사의 배경, 전문성, 실제 경험과 문제 해결 방식을 먼저 접하도록 하여 무료강의가 시작되는 시점에는 이미 일정 수준의 신뢰와 기대가 형성되도록 했습니다.</p></div>
        <ProcessDiagram items={[["INTERVIEW", "강사 인터뷰"], ["CONTENT", "강사 소개 / 성공 경험 / 문제 해결 콘텐츠"], ["COMMUNITY", "카페 게시"], ["EXPECTATION", "무료강의 기대 형성"], ["LIVE", "라이브 진입"]]} label="사전 콘텐츠에서 라이브 진입까지의 흐름" />
        <div className={invader.liveEvidenceGrid}>
          <EvidenceFigure src="/images/projects/invader/live-content/fires-cafe-opening.png" width={1064} height={1440} alt="파이어스 강사 소개 카페 게시글" caption="강사의 경력과 실제 운영 경험을 먼저 노출해 무료강의 전 신뢰의 근거를 만들었습니다." />
          <EvidenceFigure src="/images/projects/invader/live-content/fires-cafe-intro.png" width={1340} height={1102} alt="파이어스 카페 사전 질문 콘텐츠" caption="일방적인 소개보다 고객이 실제로 궁금해할 질문을 중심으로 강사의 관점과 노하우를 먼저 경험하게 했습니다." />
          <EvidenceFigure src="/images/projects/invader/live-content/yubunyeodeul-cafe-opening.png" width={1120} height={1248} alt="유부녀들 강의 카페 사전 게시글" caption="새로운 강의 역시 강사와 상품을 먼저 소개하고 고객이 참여할 이유를 사전 콘텐츠에서 형성했습니다." />
          <EvidenceFigure src="/images/projects/invader/live-content/yubunyeodeul-success-qa.png" width={1112} height={686} alt="유부녀들 성공 비결 Q&A 콘텐츠" caption="강사의 전문성을 선언하는 대신, 고객 질문에 답하는 형식으로 핵심 메시지를 전달했습니다." />
        </div>
        <p className={invader.liveTakeaway}>무료강의의 설득은<br />라이브가 시작되는 순간부터 시작되지 않았습니다.</p>
      </LiveBlock>

      <LiveBlock label="03 / SALES MESSAGE" title={<>고객이 실제로 묻는 질문을<br />강의와 상세페이지의 메시지로 먼저 바꿨습니다.</>}>
        <div className={invader.liveBody}><p className={styles.bodyCopy} data-reading-focus>강사의 장점을 그대로 나열하기보다 고객이 먼저 떠올릴 질문과 불안을 기준으로 세일즈 메시지를 구성했습니다.</p><p className={styles.bodyCopy} data-reading-focus>특히 가격, 난이도, 시간, 시장성처럼 구매를 망설이게 하는 질문을 먼저 제시하고 실제 성과와 시스템으로 답하도록 구조화했습니다.</p></div>
        <div className={invader.salesEvidenceGrid}>
          <EvidenceFigure src="/images/projects/invader/live-content/fires-sales-page.png" width={410} height={744} alt="파이어스 상세페이지 세일즈 메시지 기획" caption="마진 · 시간 · 난이도처럼 실제 고객이 먼저 묻는 질문을 성과와 운영 방식으로 바로 답하는 구조를 설계했습니다." />
          <EvidenceFigure src="/images/projects/invader/live-content/yubunyeodeul-sales-page.png" width={416} height={564} alt="유부녀들 상세페이지 진입 장벽 메시지" caption="진입 장벽을 숨기지 않고 먼저 제시한 뒤, AI 자동화와 실제 경험으로 가능성을 설명했습니다." />
        </div>
        <ProcessDiagram vertical items={[["CUSTOMER QUESTION", "“나도 가능할까?”"], ["BARRIER", "시간 · 비용 · 난이도 · 경험 부족"], ["EVIDENCE", "실제 수치 · 운영 사례"], ["METHOD", "강사의 실행 방식"], ["CONFIDENCE", "구매 확신"]]} label="고객 질문을 구매 확신으로 바꾸는 흐름" />
      </LiveBlock>

      <LiveBlock label="04 / CONTENT STRUCTURE" title={<>무엇을 더 설명할지가 아니라,<br />고객이 어떤 순서로 납득해야 하는지를 설계했습니다.</>}>
        <div className={invader.contentDecisionDiagram}>
          <div><span>BEFORE</span><h4>강사 중심 설명</h4>{["정보 나열", "전문 용어", "강사의 경험", "노하우 전달"].map((item) => <p key={item} data-reading-focus>{item}</p>)}</div>
          <div className={invader.interventionColumn}><span>INTERVENTION</span>{[["HOOK", "왜 지금 들어야 하는가"], ["TRUST", "왜 이 강사인가"], ["EVIDENCE", "실제 결과가 있는가"], ["VALUE", "나에게 어떤 이점이 있는가"], ["OBJECTION", "무엇이 불안한가"], ["CTA", "그래서 무엇을 해야 하는가"]].map(([title, copy]) => <p key={title}><b>{title}</b><i data-reading-focus>{copy}</i></p>)}</div>
          <div><span>AFTER</span><h4>고객 의사결정 중심 강의</h4>{["이해", "신뢰", "확신", "행동"].map((item) => <p key={item} data-reading-focus>{item}</p>)}</div>
        </div>
        <p className={`${invader.liveSupportingCopy} ${styles.bodyCopy}`} data-reading-focus>강사의 지식 순서가 아니라, 고객의 의사결정 순서에 맞춰 콘텐츠의 위치와 강조점을 다시 정리했습니다.</p>
      </LiveBlock>

      <LiveBlock label="05 / REHEARSAL" title={<>리허설은 발표 연습이 아니라,<br />Product Message를 검증하는 과정이었습니다.</>}>
        <div className={invader.liveBody}><p className={styles.bodyCopy} data-reading-focus>실제 리허설에서는 말의 속도나 표현만 수정하지 않았습니다. 강의 초반에 상품의 필요성이 충분히 전달되는지, 강사의 성과가 신뢰로 연결되는지, 고객이 가질 반론이 결제 전에 해소되는지를 기준으로 콘텐츠를 반복해서 점검했습니다.</p><p className={styles.bodyCopy} data-reading-focus>어려운 용어는 초보자도 이해할 수 있는 표현으로 바꾸고, 추상적인 장점은 실제 수치와 사례로 구체화했습니다.</p></div>
        <div className={invader.checkpointGrid}>{[["01", "HOOK", "카테고리의 수요와 필요성을 초반에 강조"], ["02", "TRUST", "강사의 실제 경험과 성과를 신뢰의 근거로 배치"], ["03", "EVIDENCE", "수익 · 운영 결과를 구체적 수치로 설명"], ["04", "ACCESSIBILITY", "전문 용어를 초보자도 이해하는 언어로 변환"], ["05", "SYSTEM", "개인의 감각보다 따라할 수 있는 운영 방식 강조"], ["06", "COMMUNICATION", "딱딱한 강의보다 친근하고 쉽게 이해되는 전달 방식으로 조정"]].map(([number, title, copy]) => <article key={number}><span>{number}</span><strong>{title}</strong><p data-reading-focus>{copy}</p></article>)}</div>
      </LiveBlock>

      <LiveBlock label="06 / CUSTOMER OBJECTION" title={<>고객이 묻기 전에,<br />결제를 막는 질문부터 찾았습니다.</>}>
        <div className={invader.liveBody}><p className={styles.bodyCopy} data-reading-focus>고객의 질문은 단순한 Q&amp;A가 아니라 구매를 보류하게 만드는 원인이었습니다.</p><p className={styles.bodyCopy} data-reading-focus>예상되는 우려를 사전에 정리하고, 강의 안에서 Evidence와 실제 방법론으로 답할 수 있도록 구성했습니다.</p></div>
        <ObjectionTable rows={[["MARKET SATURATION", "이미 파는 사람이 많지 않나요?", "시장 구조와 실제 운영 사례"], ["KNOW-HOW", "브랜드나 유행을 몰라도 가능한가요?", "초보자 관점의 실행 방식"], ["NEW ENTRY", "리뷰 없는 신규 상품도 팔리나요?", "신규 등록과 실제 판매 방식"], ["RISK", "가품 문제는 어떻게 해결하나요?", "소싱 기준과 리스크 관리"], ["LEGAL / REPORT", "브랜드 상품 판매가 문제없나요?", "실무 기준과 오해 요소 해소"]]} />
        <p className={invader.liveTakeaway}>질문을 없애는 것이 아니라,<br />구매 전에 답을 먼저 제공했습니다.</p>
      </LiveBlock>

      <LiveBlock label="07 / REPEATABLE FRAMEWORK" title={<>상품은 달라도,<br />고객의 구매 결정을 설계하는 기준은 같았습니다.</>}>
        <div className={invader.frameworkGrid}>
          <FrameworkCase title="FIRES / BRAND COMMERCE" concerns="마진 · 시간 · 난이도 · 시장 포화 · 가품 · 브랜드 이해도" response="실제 수익 구조 · 운영 시스템 · 성과 Evidence · 소싱 방식 · 실무 기준" />
          <FrameworkCase title="YUBUNYEODEUL / AI YOUTUBE" concerns="일본어 · 영상 편집 · 초보자 · 성공 가능성" response="AI 자동화 · 실제 강사 경험 · 진입 가능성 · 방향성과 데이터" />
        </div>
        <p className={invader.liveTakeaway}>카테고리마다 다른 질문을 다뤘지만,<br />고객의 불안을 먼저 발견하고 Evidence로 해소하는 원칙은 동일했습니다.</p>
      </LiveBlock>

      <LiveBlock label="08 / LIVE READY" title={<>기획된 강의는<br />실제 운영 플로우로 이어졌습니다.</>}>
        <p className={`${invader.liveSupportingCopy} ${styles.bodyCopy}`} data-reading-focus>강의 콘텐츠와 세일즈 메시지가 확정되면 이를 실제 고객 접점에서 오류 없이 실행하기 위한 운영 단계로 연결했습니다.</p>
        <ProcessDiagram items={[["INTERVIEW", "강사 인터뷰"], ["PRE-LIVE CONTENT", "카페 콘텐츠 / 사전 신뢰 형성"], ["SALES MESSAGE", "상세페이지 / 고객 반론"], ["CONTENT PLANNING", "무료강의 구조"], ["REHEARSAL", "후킹 · Evidence · 반론 점검"], ["LIVE READY", "CRM · 바이럴 · 페이지 · 입장 환경 준비"], ["LIVE SALES", "무료강의 진행"], ["POST LIVE", "정규강의방 · 수강생 온보딩"]]} label="인터뷰에서 라이브 이후까지의 실행 흐름" />
        <div className={invader.pendingEvidenceGrid}>
          <EvidenceFigure src="/images/projects/invader/live-content/live-day-checklist.png" width={1920} height={1080} alt="무료강의 당일 운영 체크리스트" caption="무료강의 당일 필요한 CS, 입장 환경, CRM, 바이럴과 페이지 공개 항목을 체크리스트로 관리했습니다." />
          <EvidenceFigure src="/images/projects/invader/live-content/post-live-checklist.png" width={1920} height={1080} alt="무료강의 후 운영 체크리스트" caption="무료강의 후 정규강의방 개설, 수강생 초대와 트래킹, 수강기간 설정을 후속 운영 항목으로 관리했습니다." />
        </div>
        <p className={`${invader.liveBridge} ${styles.bodyCopy}`} data-reading-focus>강의 콘텐츠가 확정된 이후에는 이를 실제 고객 접점에서 실행하는 Live Operation &amp; CRM 단계로 연결했습니다.</p>
      </LiveBlock>

      <footer className={invader.liveEnding}>
        <p>무료강의를 ‘정보 전달’이 아니라,<br />고객의 구매 결정을 돕는 Product Experience로 설계했습니다.</p>
        <div>Interview <i>→</i> Content <i>→</i> Sales Message <i>→</i> Rehearsal <i>→</i> Objection <i>→</i> Evidence <i>→</i> Decision <i>→</i> Live</div>
      </footer>
    </div>
  );
}

function LiveBlock({ label, title, children }: { label: string; title: ReactNode; children: ReactNode }) {
  return <section className={invader.liveBlock}><span className={styles.eyebrow}>{label}</span><h3>{title}</h3>{children}</section>;
}

function ProcessDiagram({ items, label, vertical = false }: { items: readonly (readonly [string, string])[]; label: string; vertical?: boolean }) {
  return <ol className={`${invader.liveProcess} ${vertical ? invader.liveProcessVertical : ""}`} aria-label={label}>{items.map(([title, copy]) => <li key={title}><strong>{title}</strong><span data-reading-focus>{copy}</span></li>)}</ol>;
}

function ObjectionTable({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  return <div className={invader.objectionTableWrap}><table className={invader.objectionTable}><thead><tr><th scope="col">TYPE</th><th scope="col">CUSTOMER QUESTION</th><th scope="col">RESPONSE</th></tr></thead><tbody>{rows.map(([title, question, answer]) => <tr key={title}><th scope="row">{title}</th><td><span data-reading-focus>{question}</span></td><td><span data-reading-focus>{answer}</span></td></tr>)}</tbody></table></div>;
}

function FrameworkCase({ title, concerns, response }: { title: string; concerns: string; response: string }) {
  return <article><h4>{title}</h4><div><strong>CUSTOMER CONCERN</strong><p data-reading-focus>{concerns}</p></div><div><strong>RESPONSE</strong><p data-reading-focus>{response}</p></div></article>;
}

function CrmEvidenceFigure({ src, width, height, alt, label, caption, mask }: { src: string; width: number; height: number; alt: string; label: string; caption: string; mask: "channel" | "sms" | "open" }) {
  return <figure className={invader.crmEvidenceCard}><div className={invader.crmEvidenceFrame} data-mask={mask}><Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 760px) 92vw, 30vw" /></div><figcaption><strong>{label}</strong><span data-reading-focus>{caption}</span></figcaption></figure>;
}

function FunnelSignalBody() {
  return (
    <div className={invader.operationNarrative}>
      <div className={invader.operationIntro}>
        <p className={styles.bodyCopy} data-reading-focus>무료강의 신청 이후 고객이 실제 라이브에 입장하고, 결제 후 정규강의를 시작하기까지의 흐름을 운영했습니다.</p>
        <p className={styles.bodyCopy} data-reading-focus>문자·알림톡·채널톡·오픈톡을 시점별로 운영하고, 라이브 당일의 실행부터 결제 이후 수강생 온보딩과 콘텐츠 전달까지 하나의 운영 Flow로 연결했습니다.</p>
      </div>

      <ProcessDiagram items={[["신청", "고객 신청"], ["CRM", "시점별 메시지"], ["LIVE 유입", "라이브 입장"], ["실시간 운영", "진행 및 응대"], ["결제", "구매 전환"], ["수강생 관리", "명단과 입장"], ["콘텐츠 전달", "VOD 제공"], ["수강 시작", "강의 이용"]]} label="신청부터 수강 시작까지의 메인 운영 흐름" />

      <LiveBlock label="01 / LIVE DAY OPERATION" title={<>라이브 당일의 운영 요소를<br />하나의 체크리스트로 관리했습니다.</>}>
        <p className={`${invader.operationBody} ${styles.bodyCopy}`} data-reading-focus>CS 응대 준비부터 CRM 타임라인, 카카오 콘텐츠, 바이럴, 무료·유료 페이지 전환까지 라이브 진행과 동시에 필요한 업무를 사전에 정리해 운영했습니다.</p>
        <ProcessDiagram items={[["PREP", "사전 준비"], ["CRM", "메시지 발송"], ["LIVE", "라이브 진행"], ["SALES", "결제 안내"], ["FOLLOW-UP", "후속 운영"]]} label="라이브 당일 운영 흐름" />
      </LiveBlock>

      <LiveBlock label="02 / MULTI-CHANNEL CRM" title={<>채널마다 역할과 발송 시점을 나눠<br />고객의 라이브 유입을 관리했습니다.</>}>
        <div className={invader.liveBody}><p className={styles.bodyCopy} data-reading-focus>무료강의 전후로 문자·알림톡·채널톡·오픈톡을 병행했습니다.</p><p className={styles.bodyCopy} data-reading-focus>강의 전에는 입장 리마인드, 라이브 중에는 실시간 유입과 결제 안내, 종료 후에는 다시보기·Q&amp;A·마감 안내까지 고객의 단계에 맞춰 메시지를 이어갔습니다.</p></div>
        <div className={invader.crmDiagram} aria-label="채널별 CRM 운영 흐름">
          <div className={invader.crmChannels}>{["문자", "알림톡", "채널톡", "오픈톡"].map((channel) => <span key={channel}>{channel}</span>)}</div>
          <div className={invader.crmConnector} aria-hidden="true">↓</div>
          <ProcessDiagram items={[["PRE-LIVE", "입장 리마인드"], ["LIVE", "실시간 유입"], ["SALES", "결제 안내"], ["FOLLOW-UP", "다시보기 · Q&A · 마감"]]} label="CRM 시점별 역할" />
        </div>
        <div className={invader.crmEvidenceGrid}>
          <CrmEvidenceFigure src="/images/projects/invader/live-content/channel-talk.png" width={1014} height={1214} alt="사전 관심 형성을 위한 채널톡 메시지 기획" label="CHANNEL TALK" caption="사전 사례와 강의 메시지를 통해 관심과 참여를 유도" mask="channel" />
          <CrmEvidenceFigure src="/images/projects/invader/live-content/sms.png" width={1018} height={966} alt="라이브 직전 입장을 안내하는 문자 메시지 기획" label="SMS" caption="라이브 직전 핵심 메시지와 입장 CTA 전달" mask="sms" />
          <CrmEvidenceFigure src="/images/projects/invader/live-content/open-talk.png" width={1004} height={802} alt="강의 중 실시간 유입을 위한 오픈톡 메시지 기획" label="OPEN TALK" caption="강의 시작 전후 5분 간격으로 실시간 유입 메시지 운영" mask="open" />
        </div>
      </LiveBlock>

      <LiveBlock label="03 / POST-LIVE OPERATION" title={<>무료강의 종료 후에도<br />실제 수강이 시작될 때까지 이어서 관리했습니다.</>}>
        <div className={invader.liveBody}><p className={styles.bodyCopy} data-reading-focus>결제 이후에는 수강생 명단을 기준으로 정규강의 그룹을 구분하고, 초대 여부와 입장 상태, 수강기간을 관리했습니다.</p><p className={styles.bodyCopy} data-reading-focus>추가 결제나 환불 등 상태 변경 사항도 구분해 후속 운영에 반영했습니다.</p></div>
        <ProcessDiagram items={[["PAYMENT", "결제"], ["STUDENT LIST", "수강생 명단"], ["INVITE", "그룹 초대"], ["ACCESS CHECK", "입장 상태"], ["COURSE PERIOD", "수강기간"]]} label="결제 이후 수강생 운영 흐름" />
      </LiveBlock>

      <LiveBlock label="04 / CONTENT DELIVERY" title={<>수강생이 실제 콘텐츠를 시청할 수 있도록<br />VOD 전달 과정까지 운영했습니다.</>}>
        <p className={`${invader.operationBody} ${styles.bodyCopy}`} data-reading-focus>강의 녹화본 또는 VOD는 Vimeo에 업로드해 시청 링크를 생성하고, 관리자 페이지에 등록해 수강생이 실제 강의를 시청할 수 있도록 운영했습니다.</p>
        <ProcessDiagram items={[["COURSE RECORDING", "강의 녹화본"], ["VIMEO UPLOAD", "영상 업로드"], ["VIDEO LINK", "시청 링크"], ["ADMIN PUBLISH", "관리자 등록"], ["STUDENT VIEW", "수강생 시청"]]} label="VOD 콘텐츠 전달 흐름" />
      </LiveBlock>

      <LiveBlock label="05 / END-TO-END OPERATION" title={<>라이브 하나가 아니라,<br />신청부터 수강 시작까지의 전체 경험을 운영했습니다.</>}>
        <ProcessDiagram items={[["ACQUISITION", "신청"], ["CRM", "고객 유입"], ["LIVE", "무료강의"], ["CONVERSION", "결제"], ["ONBOARDING", "수강생 관리"], ["DELIVERY", "VOD 제공"], ["COURSE", "수강 시작"]]} label="End-to-End Customer Operation Flow" />
      </LiveBlock>

      <footer className={invader.operationEnding}>신청부터 라이브, 결제, 온보딩과 콘텐츠 전달까지<br />Customer Operation Flow 전체를 연결해 운영했습니다.</footer>
    </div>
  );
}

const performanceCases = [
  { name: "FIRES / BRAND COMMERCE", description: "브랜드 커머스 무료강의", values: [["CHAT ENTRY", "톡방 입장률", "81.3%"], ["APPLICATION → LIVE", "신청 대비 LIVE 시청", "20.4%"], ["CHAT → LIVE", "톡방 대비 LIVE 시청", "25.1%"], ["LIVE → PAYMENT", "LIVE 시청 대비 결제 전환", "11.3%"], ["RETENTION", "결제 이후 잔존", "99.59%"]] },
  { name: "RINA / HOSPITALITY", description: "숙박업 무료강의", values: [["CHAT ENTRY", "톡방 입장률", "79.4%"], ["APPLICATION → LIVE", "신청 대비 LIVE 시청", "20.5%"], ["CHAT → LIVE", "톡방 대비 LIVE 시청", "25.8%"], ["LIVE → PAYMENT", "LIVE 시청 대비 결제 전환", "5.7%"], ["RETENTION", "결제 이후 잔존", "98.92%"]] },
] as const;

function PerformanceBody() {
  return (
    <div className={invader.performanceNarrative}>
      <div className={invader.performanceIntro}>
        <p className={styles.bodyCopy} data-reading-focus>무료강의 운영 이후에는 신청부터 LIVE, 결제와 잔존까지 Funnel 단위로 결과를 확인했습니다.</p>
        <p className={styles.bodyCopy} data-reading-focus>어디에서 고객의 이동이 끊겼는지 파악하고, 그 결과를 다음 회차의 콘텐츠·CRM·LIVE 운영에 다시 반영했습니다.</p>
      </div>

      <PerformanceBlock label="01 / REPEATABLE PRODUCT FUNNEL" description="반복 가능한 Product 운영 구조" title={<>기획부터 성과 확인까지,<br />하나의 Product Funnel로 연결했습니다.</>}>
        <LoopDiagram items={[["PRODUCT PLANNING", "상품과 핵심 메시지 정의"], ["CONTENT", "사전 콘텐츠와 구매 판단 구조 설계"], ["OPERATION", "CRM · LIVE · 온보딩 실행"], ["PERFORMANCE", "단계별 전환과 이탈 확인"], ["ITERATION", "병목을 다음 수정안으로 전환"]]} centerTitle="REPEATABLE PRODUCT FUNNEL" centerCopy="반복 가능한 Product 운영 구조" />
        <DiagramSummary><p>각 업무를 개별 Task로 보지 않고 하나의 연속된 Funnel로 관리했습니다.</p><p>운영 결과는 마지막 성과 보고가 아니라 다음 Product Planning으로 돌아가는 입력값이 되었고, 이를 기준으로 회차별 수정과 실행을 반복했습니다.</p></DiagramSummary>
      </PerformanceBlock>

      <PerformanceBlock label="02 / FUNNEL TRACKING" description="고객 이동 단계 추적" title={<>결과 하나가 아니라,<br />고객이 어디까지 이동했는지를 봤습니다.</>}>
        <ProcessDiagram items={[["APPLICATION", "무료강의 신청"], ["CHAT ROOM", "톡방 입장 · 톡방 입장률"], ["LIVE VIEW", "실제 LIVE 시청 · 신청/톡방 → LIVE 전환율"], ["PAYMENT", "정규강의 결제 · LIVE → 결제 전환율"], ["RETENTION", "결제 이후 잔존 · 환불률/잔존율"]]} label="고객 이동 단계 Funnel" />
        <DiagramSummary><p>단순 신청자 수나 결제자 수만 보는 대신, 고객이 각 단계에서 얼마나 다음 단계로 이동했는지를 확인했습니다.</p><p>이를 통해 성과가 낮은 경우에도 유입의 문제인지, LIVE 시청의 문제인지, 결제 전환의 문제인지 구분할 수 있었습니다.</p></DiagramSummary>
      </PerformanceBlock>

      <PerformanceBlock label="03 / CASE COMPARISON" description="회차별 Funnel 비교" title={<>유입은 비슷했지만,<br />차이는 LIVE 이후에 벌어졌습니다.</>}>
        <div className={invader.caseComparison}>{performanceCases.map((item) => <article key={item.name}><header><strong>{item.name}</strong><span>{item.description}</span></header><dl>{item.values.map(([label, copy, value]) => <div key={label}><dt><b>{label}</b><span>{copy}</span></dt><dd>{value}</dd></div>)}</dl></article>)}</div>
        <div className={invader.comparisonSignal}><div><strong>SIMILAR ENTRY</strong><span>유사한 유입</span></div><i>+</i><div><strong>SIMILAR LIVE VIEW</strong><span>유사한 LIVE 시청 흐름</span></div><i>↓</i><div data-result><strong>DIFFERENT PAYMENT CONVERSION</strong><span>다르게 나타난 결제 전환</span></div></div>
        <DiagramSummary><p>두 회차는 톡방 입장과 LIVE 시청까지의 흐름이 상당히 유사했습니다.</p><p>반면 LIVE 이후 결제 전환에서 차이가 나타났기 때문에, 단순 모객 규모보다는 LIVE 내부의 설득 구조와 Closing 구간을 별도로 점검해야 한다고 판단했습니다.</p></DiagramSummary>
        <div className={invader.metricEvidenceGrid}>
          <MetricEvidence src="/images/projects/invader/performance/fires-live-metrics.png" width={1230} height={310} alt="김준서 회차 Funnel 비율 기록" label="FIRES" crop="fires" />
          <MetricEvidence src="/images/projects/invader/performance/rina-live-metrics.png" width={1064} height={322} alt="리나쌤 회차 Funnel 비율 기록" label="RINA" crop="rina" />
        </div>
      </PerformanceBlock>

      <PerformanceBlock label="04 / SIGNAL → DIAGNOSIS → ACTION" description="지표에서 문제를 찾고 액션으로 연결" title={<>지표가 떨어진 위치에 따라<br />다시 봐야 할 문제도 달랐습니다.</>}>
        <div className={invader.signalBranch}><div className={invader.branchRoot}><strong>FUNNEL SIGNAL</strong><span>Funnel 이상 신호</span></div>{[["ENTRY RATE ↓", "톡방 입장률 하락", ["CRM TIMING|CRM 발송 시점", "MESSAGE|메시지 설계", "ENTRY FLOW|입장 동선"]], ["LIVE RATE ↓", "LIVE 시청 전환 하락", ["PRE-LIVE CONTENT|사전 콘텐츠", "REMINDER|리마인드 운영", "HOOK|초반 후킹"]], ["PAYMENT RATE ↓", "결제 전환 하락", ["EVIDENCE|성과와 신뢰 근거", "OBJECTION|고객 반론 대응", "CTA / CLOSING|결제 제안과 마감 구조"]], ["RETENTION ↓", "결제 이후 잔존 하락", ["EXPECTATION|사전 기대치", "ONBOARDING|수강 시작 경험", "PRODUCT EXPERIENCE|실제 강의 경험"]]].map(([title, copy, actions]) => <article key={title as string}><header><strong>{title as string}</strong><span>{copy as string}</span></header><div>{(actions as string[]).map((action) => { const [label, description] = action.split("|"); return <p key={label}><b>{label}</b><span>{description}</span></p>; })}</div></article>)}</div>
        <DiagramSummary><p>같은 “성과 하락”이라도 발생한 Funnel Stage에 따라 다시 점검해야 할 원인은 달랐습니다.</p><p>그래서 숫자 자체보다 어느 단계에서 하락했는지를 먼저 보고, 해당 단계와 연결된 콘텐츠·CRM·LIVE 운영 요소를 점검했습니다.</p></DiagramSummary>
      </PerformanceBlock>

      <PerformanceBlock label="05 / ITERATION LOOP" description="성과를 다음 회차로 연결하는 개선 Loop" title={<>측정값은 다음 회차의<br />Input이 되었습니다.</>}>
        <LoopDiagram items={[["TRACK", "Funnel 결과 기록"], ["READ", "전환 차이 확인"], ["DIAGNOSE", "병목 구간 정의"], ["ADJUST", "콘텐츠 · CRM · LIVE 수정"], ["NEXT LIVE", "다음 회차 실행"]]} centerTitle="ADJUST" centerCopy="CONTENT · CRM · LIVE" />
        <DiagramSummary><p>한 번의 무료강의를 독립적인 이벤트로 끝내지 않았습니다.</p><p>성과를 기록하고 병목을 정의한 뒤, 콘텐츠와 CRM, LIVE 운영을 수정해 다음 회차에서 다시 검증하는 반복 구조로 운영했습니다.</p></DiagramSummary>
      </PerformanceBlock>

      <footer className={invader.performanceEnding}>
        <p>성과는 결과가 아니라,<br />다음 Product의 Brief가 되었습니다.</p>
        <ProcessDiagram items={[["PLAN", "기획"], ["BUILD", "콘텐츠 구축"], ["OPERATE", "실행"], ["MEASURE", "측정"], ["IMPROVE", "개선"]]} label="기획부터 개선까지의 compact loop" />
        <div className={invader.performanceClosing}><p className={styles.bodyCopy} data-reading-focus>Product Planning부터 Content, Operation, Performance Tracking까지 하나의 흐름으로 연결했습니다.</p><p className={styles.bodyCopy} data-reading-focus>결과를 다시 다음 기획에 반영하며, 무료강의를 일회성 운영이 아니라 반복적으로 개선할 수 있는 Product Funnel로 관리했습니다.</p></div>
      </footer>
    </div>
  );
}

function PerformanceBlock({ label, description, title, children }: { label: string; description: string; title: ReactNode; children: ReactNode }) {
  return <section className={invader.performanceBlock}><div><span className={styles.eyebrow}>{label}</span><small>{description}</small></div><h3>{title}</h3>{children}</section>;
}

function DiagramSummary({ children }: { children: ReactNode }) {
  return <div className={invader.diagramSummary} data-reading-focus>{children}</div>;
}

function LoopDiagram({ items, centerTitle, centerCopy }: { items: readonly (readonly [string, string])[]; centerTitle: string; centerCopy: string }) {
  return <div className={invader.loopDiagram}><div className={invader.loopCenter}><strong>{centerTitle}</strong><span>{centerCopy}</span></div>{items.map(([title, copy], index) => <div className={invader.loopNode} data-position={index + 1} key={title}><strong>{title}</strong><span>{copy}</span></div>)}</div>;
}

function MetricEvidence({ src, width, height, alt, label, crop }: { src: string; width: number; height: number; alt: string; label: string; crop: "fires" | "rina" }) {
  return <figure data-crop={crop}><strong className={invader.metricEvidenceLabel}>{label}</strong><div className={invader.metricEvidenceImage}><div className={invader.metricHeaderCrop}><Image src={src} width={width} height={height} alt={alt} sizes="(max-width: 760px) 276vw, 138vw" /></div><div className={invader.metricRowCrop}><Image src={src} width={width} height={height} alt="" sizes="(max-width: 760px) 276vw, 138vw" /></div></div><figcaption>실제 회차별 Funnel 기록</figcaption></figure>;
}
