"use client";

import Image from "next/image";
import { useState } from "react";
import { INVADER_PROJECT, type InvaderSectionId } from "@/lib/invader-project";
import type { TransitionRuntimeState } from "@/types/transition";
import styles from "./harubareun-project-detail.module.css";
import navigation from "./project-detail-navigation.module.css";
import invader from "./invader-project-detail.module.css";

interface InvaderProjectDetailProps {
  transition: TransitionRuntimeState;
  onBackToFocus: () => void;
  onBackToWorld: () => void;
}

export function InvaderProjectDetail({ transition, onBackToFocus, onBackToWorld }: InvaderProjectDetailProps) {
  const [activeSection, setActiveSection] = useState<InvaderSectionId | null>(null);
  const section = INVADER_PROJECT.sections.find((item) => item.id === activeSection);
  const disabled = transition.phase !== "idle";

  return (
    <main className={styles.detailScene} data-transition-phase={transition.phase} aria-labelledby="invader-detail-title">
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
          <section className={styles.strategyDetail} aria-labelledby="invader-detail-title">
            <button type="button" className={styles.summaryReturn} onClick={() => setActiveSection(null)}>← PROJECT SUMMARY</button>
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
          <>
            <div className={styles.eyebrow}>02 / ITERATE</div>
            <h1 id="invader-detail-title">{INVADER_PROJECT.name}</h1>
            <p className={styles.lead}>{INVADER_PROJECT.lead}</p>
            <p className={styles.introduction}>{INVADER_PROJECT.introduction}</p>
            <dl className={styles.projectFacts}>
              {INVADER_PROJECT.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
            <nav className={styles.exploration} aria-label="INVADER detailed sections">
              <div className={styles.explorationHeader}>EXPLORE THE PROJECT</div>
              <div className={styles.sectionList}>
                {INVADER_PROJECT.sections.map((item) => (
                  <button type="button" key={item.id} className={styles.sectionItem} onClick={() => setActiveSection(item.id)}>
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

function ProductValueBody() {
  return (
    <div className={invader.valueNarrative}>
      <section className={invader.valueChapter} aria-labelledby="invader-fires-title">
        <h3 id="invader-fires-title">FIRES</h3>
        <p>일반적인 수익형 강의 메시지보다<br />실제 사업 및 펀딩 경험을 Proof of Expertise로 활용했다.</p>
        <ol className={invader.valueFlow} role="list" aria-label="FIRES Product Value 전환 과정">
          <li>Actual Experience</li>
          <li>Proof</li>
          <li>Product Value</li>
        </ol>
      </section>

      <section className={invader.valueChapter} aria-labelledby="invader-tools-title">
        <h3 id="invader-tools-title">유부녀들</h3>
        <p>강사가 실제 업무에서 사용하던 프로그램/도구를 발견하고<br />고객이 이해할 수 있는 기능과 Benefit으로 재구성했다.</p>
        <ol className={invader.valueFlow} role="list" aria-label="유부녀들 Value Proposition 전환 과정">
          <li>Expert Knowledge / Tool</li>
          <li>Customer Language</li>
          <li>Value Proposition</li>
        </ol>
      </section>

      <section className={invader.valuePrinciple} aria-labelledby="invader-principle-title">
        <h3 id="invader-principle-title" className={styles.eyebrow}>PRINCIPLE</h3>
        <p>강의 주제를 과장하기보다<br />강사가 실제로 가진 자산과 경험에서 Product의 차별점을 찾았습니다.</p>
      </section>
    </div>
  );
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
