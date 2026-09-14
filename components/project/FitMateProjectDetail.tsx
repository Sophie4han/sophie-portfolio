"use client";

import Image from "next/image";
import { useState } from "react";
import { FITMATE_PROJECT, type FitMateSectionId } from "@/lib/fitmate-project";
import type { TransitionRuntimeState } from "@/types/transition";
import styles from "./harubareun-project-detail.module.css";
import navigation from "./project-detail-navigation.module.css";
import fitmate from "./fitmate-project-detail.module.css";

interface FitMateProjectDetailProps {
  transition: TransitionRuntimeState;
  onBackToFocus: () => void;
  onBackToWorld: () => void;
}

export function FitMateProjectDetail({ transition, onBackToFocus, onBackToWorld }: FitMateProjectDetailProps) {
  const [activeSection, setActiveSection] = useState<FitMateSectionId | null>(null);
  const section = FITMATE_PROJECT.sections.find((item) => item.id === activeSection);
  const disabled = transition.phase !== "idle";

  return (
    <main className={styles.detailScene} data-transition-phase={transition.phase} aria-labelledby="fitmate-detail-title">
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
          <section className={styles.strategyDetail} aria-labelledby="fitmate-detail-title">
            <button type="button" className={styles.summaryReturn} onClick={() => setActiveSection(null)}>← PROJECT SUMMARY</button>
            <div className={styles.strategyHeading}>
              <span className={styles.eyebrow}>{section.number}</span>
              <h1 id="fitmate-detail-title">{section.title}</h1>
            </div>
            <h2 className={styles.productLead}>{section.summary}</h2>
            {section.id === "contribution" && <ContributionBody />}
            {section.id === "validation" && <ValidationBody />}
            {section.id === "foundation" && <FoundationBody />}
          </section>
        ) : (
          <>
            <div className={styles.eyebrow}>03 / UNDERSTAND</div>
            <h1 id="fitmate-detail-title">{FITMATE_PROJECT.name}</h1>
            <p className={styles.lead}>{FITMATE_PROJECT.lead}</p>
            <p className={fitmate.projectType}>{FITMATE_PROJECT.projectType}</p>
            <p className={`${styles.introduction} ${fitmate.summaryCopy}`}>{FITMATE_PROJECT.introduction}</p>
            <nav className={styles.exploration} aria-label="FitMate detailed sections">
              <div className={styles.explorationHeader}>EXPLORE THE PROJECT</div>
              <div className={styles.sectionList}>
                {FITMATE_PROJECT.sections.map((item) => (
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

function FoundationBody() {
  return (
    <div className={fitmate.contributionBody}>
      <section aria-labelledby="fitmate-foundation-title">
        <h3 id="fitmate-foundation-title" className={fitmate.sectionTitle}>Technical Foundation</h3>
        <dl className={fitmate.technicalStack}>
          <div><dt>Swift / UIKit</dt><dd>Client Product Implementation</dd></div>
          <div><dt>Firebase</dt><dd>Authentication / Data / Realtime Experience</dd></div>
          <div><dt>MVVM</dt><dd>View / Product Logic Structure</dd></div>
          <div><dt>RxSwift</dt><dd>State / Event Handling</dd></div>
          <div><dt>Git / GitHub</dt><dd>Collaborative Development</dd></div>
        </dl>
      </section>

      <section className={fitmate.foundationChapter} aria-labelledby="fitmate-relevance-title">
        <h3 id="fitmate-relevance-title">PM Relevance</h3>
        <p className={fitmate.relevanceStatement}>직접 구현하면서 하나의 Product Requirement가 UI뿐 아니라 데이터 구조, 상태관리, 예외처리와 연결된다는 것을 경험했습니다.</p>
      </section>

      <section className={fitmate.foundationChapter} aria-labelledby="fitmate-outcome-title">
        <h3 id="fitmate-outcome-title">Outcome</h3>
        <ul className={fitmate.foundationOutcomes}>
          <li>Working iOS Product</li>
          <li>App Store Release</li>
          <li>User Testing &amp; Iteration</li>
        </ul>
      </section>

      <section className={fitmate.foundationChapter} aria-labelledby="fitmate-learning-title">
        <h3 id="fitmate-learning-title">Learning</h3>
        <p>좋은 아이디어를 정의하는 것과 실제로 작동하는 Product를 만드는 것은 다르다는 것을 배웠습니다.</p>
        <p>사용자 경험 하나를 구현하기 위해 데이터 구조, 상태관리, 예외상황과 기술적 제약을 함께 고려해야 했습니다.</p>
        <p>이 경험은 이후 Product를 기획할 때 사용자 경험과 구현 가능성을 함께 고려하는 Technical Foundation이 되었습니다.</p>
      </section>
    </div>
  );
}

function ValidationBody() {
  return (
    <div className={fitmate.contributionBody}>
      <section className={fitmate.validationStage} aria-labelledby="fitmate-testing-title">
        <span className={styles.eyebrow}>USER TESTING</span>
        <h3 id="fitmate-testing-title">직접 구현한 경험을 사용자와 검증</h3>
        <p>직접 구현한 뒤 담당영역인 Login / Invitation / Main / Shop을 중심으로 UT 질문을 설계했다.</p>
        <div className={fitmate.validationFinding}>
          <h4>Validated</h4>
          <p>함께 운동하는 경험 · 공동 목표 · 실시간 진행상태 · 캐릭터 요소</p>
        </div>
      </section>

      <section className={fitmate.validationStage} aria-labelledby="fitmate-problems-title">
        <span className={styles.eyebrow}>OBSERVE → IDENTIFY</span>
        <h3 id="fitmate-problems-title">실제 사용과정에서 발견한 개선 기회</h3>
        <p>User Testing을 통해 초대코드의 마찰부터 운동 방식과 캐릭터 상호작용, 오류·화면 이동의 피드백까지 개선기회를 발견했다.</p>
        <ul className={fitmate.observations}>
          <li><span>Invite Code Friction</span><span>초대코드 사용의 마찰</span></li>
          <li><span>Solo Mode Needs</span><span>혼자 사용하는 모드에 대한 필요</span></li>
          <li><span>Exercise Variety</span><span>운동의 다양성</span></li>
          <li><span>Character Interaction</span><span>캐릭터와의 상호작용</span></li>
          <li><span>Error / Navigation Feedback</span><span>오류와 화면 이동의 피드백</span></li>
        </ul>
      </section>

      <section className={fitmate.validationStage} aria-labelledby="fitmate-iteration-title">
        <span className={styles.eyebrow}>ITERATION</span>
        <h3 id="fitmate-iteration-title">UT 결과를 실제 개선으로 연결</h3>
        <p>UT 결과를 이후 Bug Fix, UI/UX 개선 및 Feature Update로 연결했다.</p>
        <ol className={fitmate.implementationFlow} role="list" aria-label="테스트와 개선 과정">
          <li>Build</li><li>User Test</li><li>Observe</li><li>Identify</li><li>Improve</li><li>Release</li>
        </ol>
      </section>
    </div>
  );
}

function ContributionBody() {
  return (
    <div className={fitmate.contributionBody}>
      <section aria-labelledby="fitmate-contribution-title">
        <h3 id="fitmate-contribution-title" className={fitmate.sectionTitle}>My Contribution</h3>
        <section className={fitmate.phase} aria-labelledby="fitmate-mvp-title">
          <h4 id="fitmate-mvp-title">MVP</h4>
          <div className={fitmate.scope}>
            <h5>Authentication</h5>
            <ul><li>Login / Signup</li><li>Firebase Authentication</li><li>Kakao Login</li></ul>
          </div>
          <div className={fitmate.scope}>
            <h5>Entry / Main</h5>
            <ul><li>Main UI</li><li>User Entry Experience</li></ul>
          </div>
        </section>
        <section className={fitmate.phase} aria-labelledby="fitmate-user-flow-title">
          <h4 id="fitmate-user-flow-title">User Flow</h4>
          <div className={fitmate.scope}>
            <h5>Mate Invitation</h5>
            <ul><li>Invite Code</li><li>Input / Share</li><li>Error Flow</li><li>Navigation</li></ul>
          </div>
        </section>
        <section className={fitmate.phase} aria-labelledby="fitmate-later-title">
          <h4 id="fitmate-later-title">Later Iteration</h4>
          <div className={fitmate.scope}>
            <h5>Shop &amp; Data</h5>
            <ul><li>Shop</li><li>Avatar-related Data</li></ul>
          </div>
        </section>
      </section>

      <section className={fitmate.productThinking} aria-labelledby="fitmate-thinking-title">
        <span className={styles.eyebrow}>PRODUCT THINKING</span>
        <h3 id="fitmate-thinking-title">Feature가 아니라 User Flow로 구현</h3>
        <p>정상 동작뿐 아니라</p>
        <ul className={fitmate.edgeCases}>
          <li>잘못된 초대코드</li><li>기존 회원 로그인</li><li>약관</li><li>코드 복사 Feedback</li><li>Navigation</li><li>Loading</li><li>상태 변화</li>
        </ul>
        <p>등 실제 사용과정의 Edge Case를 정의하고 테스트했다.</p>
        <ol className={fitmate.implementationFlow} role="list" aria-label="User Flow 구현 과정">
          <li>Feature</li><li>User Flow</li><li>Edge Case</li><li>Implementation</li>
        </ol>
      </section>
    </div>
  );
}
