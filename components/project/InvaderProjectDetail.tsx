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
          <section className={`${styles.strategyDetail} ${section.id === "value" ? invader.planningDetail : ""}`} aria-labelledby="invader-detail-title">
            <button type="button" className={styles.summaryReturn} onClick={() => selectSection(null)}>← PROJECT SUMMARY</button>
            <div className={styles.strategyHeading}>
              <span className={styles.eyebrow}>{section.number}</span>
              <h1 id="invader-detail-title">{section.title}</h1>
            </div>
            <h2 className={section.id === "value" ? `${styles.productLead} ${invader.valueTitle}` : section.id === "experience" ? `${styles.productLead} ${invader.experienceTitle}` : styles.productLead}>{section.summary}</h2>
            {section.id === "value" && <ProductValueBody />}
            {section.id === "experience" && <PurchaseExperienceBody />}
            {section.id === "signal" && <FunnelSignalBody />}
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
    <div className={invader.experienceNarrative}>
      <section aria-labelledby="invader-rina-title">
        <h3 id="invader-rina-title" className={invader.experienceCaseTitle}>리나쌤</h3>
        <p className={invader.experienceContext}>기존 N차 Product였지만 부동산 시장과 고객수요가 이전과 달라진 상황이었다.</p>
        <ol className={invader.experienceSteps} role="list" aria-label="구매 경험 개선 과정">
          <li><h4>Detail Page</h4><p><span aria-hidden="true">→</span> 전면 교체</p></li>
          <li><h4>CRM</h4><p><span aria-hidden="true">→</span> 고객 유입 흐름에 맞춰 Timeline 조정</p></li>
          <li><h4>Live Sales</h4><p><span aria-hidden="true">→</span> 실시간 고객 반응에 따라 Closing Sequence 변경</p></li>
        </ol>
      </section>

      <section className={invader.experienceLoop} aria-labelledby="invader-working-loop-title">
        <h3 id="invader-working-loop-title" className={styles.eyebrow}>WORKING LOOP</h3>
        <ol className={invader.valueFlow} role="list" aria-label="Working Loop">
          <li>Observe</li>
          <li>Identify</li>
          <li>Intervene</li>
          <li>Evaluate</li>
        </ol>
      </section>

      <p className={invader.experienceConclusion}>시장환경 자체를 통제하기보다<br />고객이 Product를 이해하고 구매결정을 내리는 과정에서<br />통제 가능한 요소를 개선했다.</p>
    </div>
  );
}

function FunnelSignalBody() {
  return (
    <div className={invader.signalNarrative}>
      <section className={invader.signalSection} aria-labelledby="invader-signal-fires-title">
        <h3 id="invader-signal-fires-title">FIRES</h3>
        <p>상세페이지에서 높은 이탈 흐름을 확인했다.</p>
        <p>단순 Creative 문제가 아니라 전형적인 강의 판매방식에 대한 고객의 거부 가능성을 Hypothesis로 설정했다.</p>
        <ol className={invader.valueFlow} role="list" aria-label="Product Language 변경">
          <li>수강생 인증</li>
          <li>컨설팅 후기</li>
        </ol>
      </section>

      <section className={invader.signalSection} aria-labelledby="invader-iteration-title">
        <h3 id="invader-iteration-title">Iteration</h3>
        <ol className={invader.valueFlow} role="list" aria-label="Iteration">
          <li>Funnel Signal</li>
          <li>Hypothesis</li>
          <li>Product Language</li>
          <li>Observe</li>
        </ol>
        <p>데이터를 결과로만 보는 것이 아니라 Product를 다시 판단하기 위한 Signal로 활용했습니다.</p>
      </section>

      <section className={invader.signalSection} aria-labelledby="invader-funnel-management-title">
        <h3 id="invader-funnel-management-title">Funnel Management</h3>
        <p>대표적으로 김준서 1기에서 공동 PM으로 Product Launch 및 Funnel 운영에 참여했다.</p>
        <ol className={invader.signalFunnel} role="list" aria-label="김준서 1기 고객 Funnel">
          <li><strong>2,166</strong><span>Applicants</span></li>
          <li><strong>1,760</strong><span>Live Entrants</span></li>
          <li><strong>441</strong><span>Peak Viewers</span></li>
          <li><strong>50</strong><span>Purchasers</span></li>
        </ol>
        <p className={invader.signalConversion}><strong>11.3%</strong><span>Viewer → Purchase Conversion</span></p>
        <p>※ 공동 담당 PM 성과이며 개인 단독 성과로 표현하지 않는다.</p>
      </section>

      <section className={invader.signalSection} aria-labelledby="invader-lifecycle-title">
        <h3 id="invader-lifecycle-title">Product Lifecycle</h3>
        <ol className={invader.signalLifecycle} role="list" aria-label="Product Lifecycle">
          <li>Source Expert</li>
          <li>Productize</li>
          <li>Launch</li>
          <li>Measure</li>
          <li>Iterate</li>
          <li>Continue / Improve / Drop</li>
        </ol>
        <p>상품의 최종 지속 여부는 회사 차원의 사업적 판단이었다.</p>
        <p>담당 PM으로 Product Performance와 운영 데이터를 관리하며 지속·개선 판단에 필요한 실무를 수행했다.</p>
      </section>

      <section className={invader.signalSection} aria-labelledby="invader-outcome-title">
        <h3 id="invader-outcome-title">Outcome</h3>
        <ul className={invader.signalOutcomes}>
          <li>신규 강사 Expertise → Product Value 구조화</li>
          <li>기존 Product Repositioning</li>
          <li>상세페이지 / CRM / Live Sales Optimization</li>
          <li>End-to-End Customer Funnel Management</li>
          <li>대표 프로젝트 2,166명 신청 / 50명 결제 / Viewer Conversion 11.3%</li>
        </ul>
        <p>※ 공동 담당 PM 성과이며 개인 단독 성과로 표현하지 않는다.</p>
      </section>

      <section className={invader.signalLearning} aria-labelledby="invader-learning-title">
        <h3 id="invader-learning-title" className={styles.eyebrow}>LEARNING</h3>
        <p>Product는 출시하는 순간 완성되는 것이 아니라, 고객이 어디에서 반응하고 이탈하는지를 관찰하고 통제 가능한 요소를 수정하면서 계속 다시 정의된다는 것을 배웠습니다.</p>
      </section>
    </div>
  );
}
