"use client";

import Image from "next/image";
import shared from "./harubareun-project-detail.module.css";
import s from "./fitmate-test-iteration.module.css";

type Step = { title: string; detail?: string; tone?: "purple" | "lime" };

const CORE_FLOWS = [
  {
    number: "01", label: "MATE CONNECTION", headline: ["연결 여부가", "다음 행동을 결정하도록."],
    body: "초대 코드 공유부터 입력, 연결 상태 확인, 메이트 등록 여부에 따른 다음 행동 분기까지의 흐름을 검증했습니다.",
    src: "/images/projects/fitmate/test-iteration/mate-connection.png", width: 2436, height: 2311,
    alt: "초대 코드 공유, 입력, 메이트 연결 상태에 따라 메인 화면과 운동 선택으로 이어지는 FitMate 화면 흐름",
    flow: "Invite → Match → Mate State → Main / Exercise",
  },
  {
    number: "02", label: "REAL-TIME EXERCISE", headline: ["두 사용자의 진행 상태를", "하나의 운동 경험으로."],
    body: "운동 시작 전 로딩, 협력/대결 모드 진입, 실시간 진행 UI와 상태 흐름이 끊기지 않도록 확인했습니다.",
    src: "/images/projects/fitmate/test-iteration/realtime-exercise.png", width: 1887, height: 2202,
    alt: "운동 로딩 이후 협력과 대결 모드의 실시간 진행 상태로 이어지는 FitMate 화면 흐름",
    flow: "Loading → Mode → Progress → Session State",
  },
  {
    number: "03", label: "REWARD & AVATAR", headline: ["운동 결과가", "다음 행동의 동기가 되도록."],
    body: "운동 결과와 보상 획득, 상점 진입, 구매, 아바타 반영까지 하나의 보상 루프로 이어지는 흐름을 검증했습니다.",
    src: "/images/projects/fitmate/test-iteration/reward-shop.png", width: 2881, height: 2427,
    alt: "운동 결과와 코인 보상에서 상점 진입, 아바타 구매와 화면 반영까지 이어지는 FitMate 화면 흐름",
    flow: "Result → Coin → Shop → Purchase → Avatar Update",
  },
  {
    number: "04", label: "HISTORY & MY PAGE", headline: ["운동 결과가", "기록과 성장으로 남도록."],
    body: "운동 결과가 기록 화면과 마이페이지의 누적 데이터로 연결되며, 반복 사용 동기를 만들 수 있는지 확인했습니다.",
    src: "/images/projects/fitmate/test-iteration/history-mypage.png", width: 1666, height: 1048,
    alt: "운동 기록 화면에서 마이페이지의 운동별 누적 통계로 이어지는 FitMate 화면 흐름",
    flow: "Exercise → Record → History → Accumulated Stats",
  },
] as const;

function Body({ children }: { children: React.ReactNode }) {
  return <p className={`${shared.bodyCopy} ${s.body}`} data-reading-focus>{children}</p>;
}

function Chapter({ id, label, title, children }: { id: string; label: string; title: React.ReactNode; children: React.ReactNode }) {
  return <section className={s.chapter} aria-labelledby={id}>
    <span className={s.label} data-reading-focus>{label}</span>
    <h2 id={id} data-reading-focus>{title}</h2>
    {children}
  </section>;
}

function Flow({ steps, label, vertical = false }: { steps: Step[]; label: string; vertical?: boolean }) {
  return <ol className={`${s.flow} ${vertical ? s.verticalFlow : ""}`} aria-label={label}>
    {steps.map(({ title, detail, tone }) => <li key={title} className={tone ? s[tone] : ""}>
      <strong data-reading-focus>{title}</strong>
      {detail && <span data-reading-focus>{detail}</span>}
    </li>)}
  </ol>;
}

function Statement({ children }: { children: React.ReactNode }) {
  return <p className={s.statement} data-reading-focus>{children}</p>;
}

export function FitMateTestIterationSection() {
  return <div className={s.study}>
    <header className={s.intro}>
      <p className={s.label} data-reading-focus>03 / TEST &amp; ITERATION</p>
      <h1 id="fitmate-detail-title" data-reading-focus>구현으로 끝내지 않고,<br />사용자의 반응을 다시 제품에 반영했습니다.</h1>
      <div className={s.introBody}>
        <Body>MVP 구현 이후 실제 사용 과정에서 발생하는 불편과 예외 상황을 확인하고, 사용자 테스트와 반복적인 자체 검증을 통해 개선 항목을 정리했습니다.</Body>
        <Body>발견된 문제를 단순 수정 요청으로 처리하기보다 어떤 사용자 행동에서 문제가 발생했는지, Core Flow를 얼마나 방해하는지, UI뿐 아니라 어떤 상태와 로직을 함께 수정해야 하는지를 기준으로 개선했습니다.</Body>
      </div>
    </header>

    <Chapter id="fitmate-iteration-loop" label="03-01 / ITERATION LOOP" title={<>한 번에 완성하려 하기보다,<br />검증 결과를 다음 버전의 판단 근거로 사용했습니다.</>}>
      <Flow label="Build, Test, Observe, Define, Improve, Validate, 다시 Build로 이어지는 반복 흐름" steps={[
        { title: "BUILD", detail: "MVP 구현" }, { title: "TEST", detail: "실제 Flow 검증" },
        { title: "OBSERVE", detail: "사용자 반응 / 오류 확인", tone: "purple" }, { title: "DEFINE", detail: "문제와 원인 구분", tone: "purple" },
        { title: "IMPROVE", detail: "UX · State · Logic 개선", tone: "lime" }, { title: "VALIDATE", detail: "다음 버전에서 재확인", tone: "lime" },
      ]} />
      <p className={s.loopReturn} data-reading-focus>↺ BUILD</p>
      <Statement>BUILD <em>→</em> TEST <em>→</em> LEARN <em>→</em> IMPROVE</Statement>
      <Body>실제 사용 과정에서 확인된 문제를 다음 기능과 버전의 개선 근거로 연결했습니다.</Body>
    </Chapter>

    <Chapter id="fitmate-validated-flow" label="03-02 / VALIDATED CORE FLOWS" title={<>화면 하나가 아니라,<br />사용자가 끝까지 이동하는 흐름을 검증했습니다.</>}>
      <Body>메이트 연결, 실시간 운동, 보상, 기록이라는 핵심 경험을 각각의 Flow로 나누고, 상태 변화에 따라 다음 행동과 화면이 올바르게 이어지는지를 중심으로 검증했습니다.</Body>
      <div className={s.coreFlowGrid}>
        {CORE_FLOWS.map((item) => <article className={s.coreFlowBlock} key={item.number}>
          <div className={s.coreFlowLabel}><span data-reading-focus>{item.number}</span><span data-reading-focus>{item.label}</span></div>
          <h3 data-reading-focus>{item.headline[0]}<br />{item.headline[1]}</h3>
          <p className={s.coreFlowBody} data-reading-focus>{item.body}</p>
          <figure className={s.coreFlowEvidence}>
            <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1100px) 45vw, 640px" loading="eager" unoptimized />
            <figcaption data-reading-focus>{item.flow}</figcaption>
          </figure>
        </article>)}
      </div>
      <Statement>WE VALIDATED THE STATE<br />BETWEEN SCREENS,<br />NOT ONLY THE SCREENS THEMSELVES.</Statement>
      <p className={s.subStatement} data-reading-focus>화면 단위가 아니라, 화면과 화면 사이의 상태 변화까지 검증했습니다.</p>
    </Chapter>

    <Chapter id="fitmate-issue-definition" label="03-03 / ISSUE DEFINITION" title={<>피드백을 바로 기능으로 바꾸지 않고,<br />제품 문제로 다시 정의했습니다.</>}>
      <Flow vertical label="피드백에서 관찰, 문제 정의, 우선순위, 개선, 재검증까지" steps={[
        { title: "USER FEEDBACK" }, { title: "OBSERVATION", detail: "어디에서 막혔는가?", tone: "purple" },
        { title: "ISSUE", detail: "왜 문제가 되는가?", tone: "purple" }, { title: "PRIORITY", detail: "Core Flow에 영향을 주는가?" },
        { title: "IMPROVEMENT", detail: "UI · State · Logic", tone: "lime" }, { title: "VALIDATION", detail: "실제 Flow에서 재확인", tone: "lime" },
      ]} />
      <Body>사용자의 의견 자체를 정답으로 받아들이기보다 반복되는 문제인지, 주요 행동을 방해하는지, 현재 제품 단계에서 해결할 가치가 있는지를 기준으로 개선 우선순위를 판단했습니다.</Body>
      <Statement>FEEDBACK IS INPUT,<br />NOT THE ANSWER.</Statement>
      <p className={s.subStatement} data-reading-focus>피드백은 답이 아니라, 제품 판단을 위한 입력값으로 사용했습니다.</p>
    </Chapter>

    <Chapter id="fitmate-improvement-focus" label="03-04 / WHAT WE IMPROVED" title={<>개선은 UI 수정에서 끝나지 않고,<br />상태와 로직까지 함께 이어졌습니다.</>}>
      <Body>검증 과정에서 확인된 이슈를 실제 개발 Task와 PR로 전환했습니다. 레이아웃과 문구 수정뿐 아니라 메이트 상태, 알림, 보상, 아바타 구매·선택·화면 간 동기화처럼 사용자 경험에 영향을 주는 상태와 로직을 함께 개선했습니다.</Body>
      <div className={s.axes}>
        {[
          ["01", "UX CLARITY", "사용자가 다음 행동과 화면의 의미를 빠르게 이해하도록"],
          ["02", "STATE CONSISTENCY", "동일한 사용자 상태가 메인·마이페이지·운동 화면에서 일관되게 반영되도록"],
          ["03", "ERROR HANDLING", "취소·오류·연결 상태 등 정상 Flow 밖에서도 사용자가 막히지 않도록"],
          ["04", "FEEDBACK LOOP", "사용자의 행동 결과가 UI와 다음 행동에 즉시 반영되도록"],
        ].map(([number, title, detail]) => <div key={number}><span data-reading-focus>{number}</span><strong data-reading-focus>{title}</strong><p data-reading-focus>{detail}</p></div>)}
      </div>
    </Chapter>

    <Chapter id="fitmate-implementation-evidence" label="03-05 / IMPLEMENTATION EVIDENCE" title={<>피드백을 문서에 남기는 데서 끝내지 않고,<br />실제 개선 작업으로 전환했습니다.</>}>
      <Body>UT와 자체 검증에서 확인한 이슈를 Feature · Bug Fix · Design · Refactor 단위의 작업으로 나누어 반영했습니다. 초기 UX 수정부터 알림, 메인 화면, 운동 Flow, 보상과 아바타 상태 동기화까지 제품 전반의 개선이 실제 PR로 이어졌습니다.</Body>
      <div className={s.prEvidence}>
        <figure>
          <div className={s.prHeading}><strong data-reading-focus>EARLY ITERATION</strong><span data-reading-focus>Main UX · Notification · Invitation · Layout · Error Fix</span></div>
          <Image src="/images/projects/fitmate/test-iteration/github-early.png" alt="FitMate 팀 Pull Request 목록: 레이아웃, 알림, 메인 화면, 초대 요청, 오류 수정 등 초기 개선 작업" width={1824} height={476} sizes="(max-width: 760px) 100vw, 1320px" loading="eager" unoptimized />
          <figcaption data-reading-focus>TEAM ITERATION LOG · Feature · Bug Fix · Design · Refactor · <a href="/images/projects/fitmate/test-iteration/github-early.png" target="_blank" rel="noopener noreferrer">원본 크기로 열기 ↗</a></figcaption>
        </figure>
        <figure>
          <div className={s.prHeading}><strong data-reading-focus>PRODUCT REFINEMENT</strong><span data-reading-focus>Reward · Shop · Avatar · UT Fix · State Sync</span></div>
          <Image src="/images/projects/fitmate/test-iteration/github-refinement.png" alt="FitMate 팀 Pull Request 목록: 코인 보상, 상점, 아바타 구매와 화면 간 상태 연동, UT 수정 작업" width={1848} height={704} sizes="(max-width: 760px) 100vw, 1320px" loading="eager" unoptimized />
          <figcaption data-reading-focus>TEAM ITERATION LOG · Feature · Bug Fix · Design · Refactor · <a href="/images/projects/fitmate/test-iteration/github-refinement.png" target="_blank" rel="noopener noreferrer">원본 크기로 열기 ↗</a></figcaption>
        </figure>
      </div>
      <div className={s.implementation}>
        <span className={s.label} data-reading-focus>03-06 / FROM ISSUE TO IMPLEMENTATION</span>
        <h3 data-reading-focus>제품 문제를,<br />실제 개발 작업 단위로 전환했습니다.</h3>
        <Flow vertical label="테스트에서 다음 검증까지 이어지는 개발 협업 흐름" steps={[
          { title: "UT / INTERNAL TEST" }, { title: "ISSUE DEFINITION" }, { title: "TASK / ISSUE" },
          { title: "IMPLEMENTATION" }, { title: "PULL REQUEST" }, { title: "REVIEW / MERGE" }, { title: "NEXT VALIDATION" },
        ]} />
        <Body>검증에서 확인된 문제를 추상적인 개선 의견으로 남겨두지 않고, Issue와 개발 Task로 구체화하고 구현·리뷰·Merge를 거쳐 다음 검증 가능한 상태로 연결했습니다.</Body>
      </div>
    </Chapter>

    <Chapter id="fitmate-version-progression" label="03-07 / VERSION PROGRESSION" title={<>하나의 릴리스가 끝이 아니라,<br />다음 개선 사이클의 시작이었습니다.</>}>
      <Flow label="MVP에서 2차 사용자 테스트까지 버전 진행" steps={[
        { title: "MVP", detail: "Core Flow Implementation" }, { title: "MVP FIX", detail: "Flow / UI / Logic Stabilization" },
        { title: "VER 1.1", detail: "Product Refinement" }, { title: "VER 1.1.1", detail: "Additional Fix" },
        { title: "USER TEST", detail: "Feedback Collection" }, { title: "NEXT VALIDATION", detail: "2nd UT" },
      ]} />
      <Body>MVP 이후 수정 사항을 버전 단위로 정리하고, 사용자 피드백을 다음 작업과 테스트 질문으로 연결하며 제품을 단계적으로 개선했습니다.</Body>
    </Chapter>

    <Chapter id="fitmate-iteration-principle" label="03-08 / PRODUCT ITERATION PRINCIPLE" title={<>모든 피드백을,<br />기능으로 만들지는 않았습니다.</>}>
      <Body>사용자 의견을 그대로 기능 요구사항으로 옮기기보다 반복되는 문제인지, Core Flow를 방해하는지, 현재 제품 단계에서 해결할 가치가 있는지를 기준으로 우선순위를 판단했습니다.</Body>
      <Flow vertical label="사용자 피드백의 우선순위 판단 기준" steps={[
        { title: "USER FEEDBACK" }, { title: "FREQUENCY", detail: "반복되는가?" },
        { title: "IMPACT", detail: "핵심 Flow를 방해하는가?" }, { title: "FEASIBILITY", detail: "현재 단계에서 해결 가능한가?" },
        { title: "PRIORITY", detail: "FIX / IMPROVE / LATER", tone: "lime" },
      ]} />
      <Statement>FEEDBACK IS INPUT,<br />NOT THE ANSWER.</Statement>
      <p className={s.subStatement} data-reading-focus>검증 → 판단 → 구현 → 재검증</p>
    </Chapter>
  </div>;
}
