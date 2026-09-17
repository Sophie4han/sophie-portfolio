import shared from "./harubareun-project-detail.module.css";
import s from "./fitmate-from-plan-to-product.module.css";

const PRODUCT_CYCLE = [
  { title: "DEFINE", detail: "사용자 문제와 핵심 경험 정의", tone: "purple" },
  { title: "STRUCTURE", detail: "User Flow · State · Edge Case 설계", tone: "purple" },
  { title: "DESIGN", detail: "화면 구조 · Interaction · UX Direction", tone: "purple" },
  { title: "BUILD", detail: "Swift 기반 실제 기능 구현", tone: "neutral" },
  { title: "VALIDATE", detail: "UT · Internal Test · Issue 확인", tone: "lime" },
  { title: "IMPROVE", detail: "UI · State · Logic 개선", tone: "lime" },
] as const;

const ADVANTAGES = [
  { number: "01", label: "PRODUCT THINKING", title: <>사용자 행동부터<br />설계합니다.</>, body: <>화면을 먼저 만드는 대신 사용자가 왜 이 기능을 사용하고, 어떤 행동을 거쳐 다음 단계로 이동하는지를 기준으로 Core Flow를 정의했습니다.</>, keywords: "Problem · Core Flow · Priority · User State" },
  { number: "02", label: "TECHNICAL TRANSLATION", title: <>기획 의도를<br />State와 Data로 구체화합니다.</>, body: <>직접 구현에 참여하면서 하나의 요구사항이 인증 상태, 데이터 구조, 실시간 동기화, 예외 처리와 연결되는 방식을 경험했습니다.<br /><br />이를 통해 화면 명세뿐 아니라 개발팀이 구현 가능한 수준의 상태와 흐름으로 요구사항을 구체화할 수 있게 되었습니다.</>, keywords: "State · Data Flow · Edge Case · System" },
  { number: "03", label: "EXECUTION", title: <>정의한 경험을<br />실제 제품으로 확인합니다.</>, body: <>Swift 기반 iOS 구현에 직접 참여하고, 실제 사용 과정에서 발견된 문제를 UI · State · Logic 단위로 다시 개선했습니다.<br /><br />기획과 구현 사이에서 발생하는 차이를 직접 확인하고 조정한 경험이 있습니다.</>, keywords: "Build · Test · Issue · Iteration" },
] as const;

const REQUIREMENT = [
  { title: "USER NEED", detail: <>“메이트와 함께<br />운동하고 싶다”</> },
  { title: "PRODUCT REQUIREMENT", detail: "메이트 연결 + 공동 운동" },
  { title: "UX FLOW", detail: "Invite → Match → Exercise → Result" },
  { title: "STATE", detail: "No Mate · Connected · Active · Paused · Completed" },
  { title: "DATA / SYSTEM", detail: "Auth · Firestore · Session · Sensor Data · Realtime Sync" },
  { title: "UI RESPONSE", detail: "Main State · Progress · Alert · Result · Reward" },
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

export function FitMateFromPlanToProductSection() {
  return <div className={s.study}>
    <header className={s.intro}>
      <p className={s.label} data-reading-focus>04 / FROM PLAN TO PRODUCT</p>
      <h1 id="fitmate-detail-title" data-reading-focus>기획을 화면에서 끝내지 않고,<br />실제로 작동하는 제품까지 연결했습니다.</h1>
      <div className={s.introCopy}>
        <Body>FitMate에서는 서비스 구조와 사용자 흐름을 기획하고, 화면 경험을 구체화한 뒤 실제 iOS 구현에 참여했습니다.</Body>
        <Body>그 과정에서 하나의 기능은 UI 하나로 완성되는 것이 아니라, 사용자 행동, 상태, 데이터, 예외 상황, 그리고 다음 행동까지 함께 연결되어야 한다는 것을 경험했습니다.</Body>
      </div>
      <p className={s.openingStatement} data-reading-focus>FROM USER FLOW<br /><em>TO WORKING PRODUCT.</em></p>
    </header>

    <Chapter id="fitmate-product-approach" label="04-01 / MY PRODUCT APPROACH" title={<>사용자 경험을 정의하고,<br />구조로 번역하고,<br />직접 구현하며 검증했습니다.</>}>
      <ol className={s.cycle} aria-label="정의, 구조화, 디자인, 구현, 검증, 개선 후 다시 정의로 이어지는 제품 사이클">
        {PRODUCT_CYCLE.map((step) => <li className={s[step.tone]} key={step.title}>
          <strong data-reading-focus>{step.title}</strong><span data-reading-focus>{step.detail}</span>
        </li>)}
      </ol>
      <p className={s.cycleReturn} data-reading-focus>↺ IMPROVE → DEFINE / STRUCTURE</p>
      <p className={s.processStatement} data-reading-focus>PLAN <em>→</em> STRUCTURE <em>→</em> BUILD <em>→</em> VALIDATE <em>→</em> IMPROVE</p>
      <Body>아이디어를 문서로 전달하는 데서 끝내지 않고, 실제 구현 과정에서 발생하는 제약과 상태 변화를 확인한 뒤 다시 기획과 UX 개선에 반영했습니다.</Body>
    </Chapter>

    <Chapter id="fitmate-product-advantage" label="04-02 / MY ADVANTAGE" title={<>기획과 개발 사이를,<br />화면이 아닌 구조로 연결할 수 있습니다.</>}>
      <div className={s.advantageGrid}>
        {ADVANTAGES.map((item) => <article className={s.advantage} key={item.number}>
          <div className={s.advantageLabel}><span data-reading-focus>{item.number}</span><span data-reading-focus>{item.label}</span></div>
          <h3 data-reading-focus>{item.title}</h3>
          <p data-reading-focus>{item.body}</p>
          <small data-reading-focus>{item.keywords}</small>
        </article>)}
      </div>
    </Chapter>

    <Chapter id="fitmate-requirement-translation" label="04-03 / FROM REQUIREMENT TO SYSTEM" title={<>기능 요청을,<br />개발 가능한 구조로 구체화했습니다.</>}>
      <ol className={s.requirement} aria-label="사용자 요구에서 제품 요구사항, UX 흐름, 상태, 데이터 시스템, UI 반응까지">
        {REQUIREMENT.map((step, index) => <li key={step.title}>
          <span className={s.requirementIndex} data-reading-focus>{String(index + 1).padStart(2, "0")}</span>
          <strong data-reading-focus>{step.title}</strong>
          <span className={s.requirementDetail} data-reading-focus>{step.detail}</span>
        </li>)}
      </ol>
      <p className={s.sequenceStatement} data-reading-focus>USER NEED <em>→</em> REQUIREMENT <em>→</em> FLOW <em>→</em> STATE <em>→</em> DATA <em>→</em> UI</p>
      <Body>사용자의 요구를 바로 화면으로 옮기지 않고, 어떤 상태와 데이터가 필요한지까지 내려가며 기능을 구체화했습니다.</Body>
    </Chapter>

    <Chapter id="fitmate-planning-implementation" label="04-04 / PLANNING × IMPLEMENTATION" title={<>기획과 구현을<br />서로 다른 단계로 보지 않았습니다.</>}>
      <div className={s.overlap} aria-label="제품 기획과 구현이 Product Execution에서 겹치는 구조">
        <div className={`${s.overlapSide} ${s.overlapPlanning}`}>
          <h3 data-reading-focus>PRODUCT PLANNING</h3>
          <p data-reading-focus>Problem Definition<br />Core Flow<br />Feature Priority<br />UX Structure<br />User State</p>
        </div>
        <div className={s.overlapCore}>
          <h3 data-reading-focus>PRODUCT EXECUTION</h3>
          <p data-reading-focus>Feasibility<br />Technical Communication<br />State-driven UX<br />Fast Iteration</p>
        </div>
        <div className={`${s.overlapSide} ${s.overlapBuild}`}>
          <h3 data-reading-focus>IMPLEMENTATION</h3>
          <p data-reading-focus>Swift / UIKit<br />Firebase<br />UI State<br />Data Binding<br />Error Handling</p>
        </div>
      </div>
      <Body>기획 단계에서는 구현 가능성을 고려하고, 개발 단계에서는 원래의 사용자 경험이 왜 필요한지 놓치지 않도록 연결했습니다.</Body>
      <p className={s.largeStatement} data-reading-focus>BETWEEN<br />PRODUCT INTENT<br /><em>AND</em><br />TECHNICAL REALITY.</p>
    </Chapter>

    <Chapter id="fitmate-work-takeaway" label="04-05 / TAKEAWAY" title={<>화면 중심의 사고에서,<br />제품 시스템 중심의 사고로.</>}>
      <div className={s.beforeAfter}>
        <div><span className={s.label} data-reading-focus>BEFORE</span><strong data-reading-focus>SCREEN</strong><p data-reading-focus>“어떤 화면을<br />만들 것인가?”</p></div>
        <span className={s.changeArrow} aria-hidden="true">→</span>
        <div><span className={s.label} data-reading-focus>AFTER</span><strong data-reading-focus>PRODUCT SYSTEM</strong><p data-reading-focus>“사용자가 무엇을 하고,<br />어떤 상태가 바뀌며,<br />다음 행동까지 어떻게 이어지는가?”</p></div>
      </div>
      <ol className={s.workChain} aria-label="사용자, 행동, 상태, 데이터, 다음 경험의 관계">
        {["USER", "ACTION", "STATE", "DATA", "NEXT EXPERIENCE"].map((item) => <li key={item} data-reading-focus>{item}</li>)}
      </ol>
      <Body>FitMate를 통해 UI 자체보다 화면과 화면 사이에서 발생하는 상태 변화와 데이터 흐름이 제품 경험을 결정한다는 것을 배웠습니다.</Body>
      <Body>이후 기능을 기획할 때에도 User Flow · State · Data · Edge Case · Feedback을 함께 고려하는 방식으로 접근하게 되었습니다.</Body>
    </Chapter>

    <Chapter id="fitmate-role-summary" label="04-06 / MY ROLE" title={<>제품 경험을 설계하고,<br />구현과 개선까지 연결했습니다.</>}>
      <p className={s.roleStatement} data-reading-focus>PRODUCT PLANNING <em>+</em><br />UX/UI STRUCTURE &amp; DIRECTION <em>+</em><br />iOS DEVELOPMENT</p>
      <div className={s.roleGrid}>
        <div><h3 data-reading-focus>Product Planning</h3><p data-reading-focus>서비스 구조<br />Core Flow<br />화면 구성<br />Feature Priority</p></div>
        <div><h3 data-reading-focus>UX/UI Structure &amp; Direction</h3><p data-reading-focus>Information Structure<br />Interaction Flow<br />Screen Composition<br />Design Direction</p></div>
        <div><h3 data-reading-focus>iOS Development</h3><p data-reading-focus>Onboarding<br />Mate Connection<br />Main Experience<br />Shop<br />Avatar State<br />UI / UX Refinement</p></div>
      </div>
      <div className={s.collaboration}><span className={s.label} data-reading-focus>COLLABORATION</span><p data-reading-focus>Visual Design — Collaborating Designer<br />iOS Development — Team Collaboration</p></div>
    </Chapter>

    <section className={s.closing} aria-labelledby="fitmate-final-positioning">
      <span className={s.label} data-reading-focus>04-07 / FROM PLAN TO PRODUCT</span>
      <h2 id="fitmate-final-positioning" data-reading-focus>사용자 흐름을 설계하고,<br />시스템을 이해하며,<br />제품을 개선합니다.</h2>
      <p className={s.closingEnglish} data-reading-focus>I DESIGN THE FLOW,<br />UNDERSTAND THE SYSTEM,<br />AND IMPROVE THE PRODUCT.</p>
      <div className={s.closingCopy}>
        <Body>FitMate는 기획한 경험을 화면 구조로 구체화하고, 실제 구현을 통해 작동 방식을 확인하며, 사용자 피드백을 다시 개선으로 연결한 프로젝트였습니다.</Body>
        <Body>기획과 개발 사이를 오가며 아이디어가 실제 Product가 되기 위해 필요한 Flow, State, Data, Interaction을 함께 고려했습니다.</Body>
      </div>
      <p className={s.signature} data-reading-focus>PRODUCT THINKING <em>×</em> TECHNICAL UNDERSTANDING <em>×</em> EXECUTION</p>
    </section>
  </div>;
}
