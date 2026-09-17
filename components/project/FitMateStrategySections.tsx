import shared from "./harubareun-project-detail.module.css";
import fitmate from "./fitmate-strategy-sections.module.css";

type FlowStep = { title: string; detail?: string };

function Flow({ steps, label, className = "" }: { steps: FlowStep[]; label: string; className?: string }) {
  return <ol className={`${fitmate.flow} ${className}`} aria-label={label}>{steps.map(({ title, detail }) => <li key={title}><strong data-reading-focus>{title}</strong>{detail && <span data-reading-focus>{detail}</span>}</li>)}</ol>;
}

function Chapter({ number, label, title, children }: { number: string; label: string; title?: string; children: React.ReactNode }) {
  return <section className={fitmate.chapter}>
    <div className={fitmate.chapterTop}><span data-reading-focus>{number} / {label}</span></div>
    {title && <h2 data-reading-focus>{title}</h2>}
    {children}
  </section>;
}

function Intro({ number, label, title, paragraphs }: { number: string; label: string; title: string; paragraphs: string[] }) {
  return <header className={fitmate.intro}>
    <p className={shared.eyebrow} data-reading-focus>{number} / {label}</p>
    <h1 id="fitmate-detail-title" data-reading-focus>{title}</h1>
    <div className={fitmate.introCopy}>{paragraphs.map((paragraph) => <p className={shared.bodyCopy} data-reading-focus key={paragraph}>{paragraph}</p>)}</div>
  </header>;
}

export function ProductStrategySection() {
  return <div className={fitmate.study}>
    <Intro number="02" label="PRODUCT STRATEGY" title="기능을 먼저 쌓기보다, ‘함께 운동하게 만드는 핵심 경험’부터 정의했습니다." paragraphs={[
      "혼자 기록하는 운동 앱이 아니라, 누군가와 연결되어 함께 목표를 달성하는 경험을 제품의 중심에 두었습니다.",
      "사용자가 메이트를 연결하고, 운동 방식을 선택하고, 함께 목표를 수행한 뒤 기록과 보상을 확인하기까지의 흐름을 하나의 Core Product Loop로 설계했습니다.",
    ]} />

    <Chapter number="02-01" label="PRODUCT DEFINITION">
      <ol className={fitmate.definition} aria-label="Problem, Hypothesis, Product Direction">
        <li><span className={fitmate.nodeNumber} data-reading-focus>01 / PROBLEM</span><p data-reading-focus>혼자 하는 운동은<br />과정을 공유할 대상과<br />지속적인 동기가 부족하다.</p></li>
        <li><span className={fitmate.nodeNumber} data-reading-focus>02 / HYPOTHESIS</span><p data-reading-focus>운동 과정에<br /><em>관계 · 공동 목표 · 즉각적인 피드백</em>을 더하면<br />다시 참여할 이유를 만들 수 있다.</p></li>
        <li><span className={fitmate.nodeNumber} data-reading-focus>03 / PRODUCT DIRECTION</span><h3 data-reading-focus>Mate-based<br /><em>Fitness Experience</em></h3><p data-reading-focus>운동 기록을 남기는 것에서 끝나지 않고, 함께 운동하는 경험 자체를 제품의 중심으로 설계.</p></li>
      </ol>
    </Chapter>

    <Chapter number="02-02" label="CORE PRODUCT LOOP" title="연결을 기능 하나로 끝내지 않고, 다음 운동까지 이어지는 경험으로 설계했습니다.">
      <div className={fitmate.loopDiagram}>
        <p className={fitmate.loopCenter} data-reading-focus>FROM CONNECTION<br /><strong>TO RE-ENGAGEMENT</strong></p>
        <Flow className={fitmate.loopSteps} label="연결에서 다음 운동으로 돌아오는 핵심 제품 루프" steps={[
          { title: "CONNECT", detail: "메이트 연결" }, { title: "CHOOSE", detail: "종목 · 목표 · 모드 선택" },
          { title: "MOVE TOGETHER", detail: "협력 또는 대결" }, { title: "FEEDBACK", detail: "실시간 진행 상태 확인" },
          { title: "RECORD", detail: "운동 결과와 기록" }, { title: "REWARD", detail: "포인트 · 아바타 · 성장" },
          { title: "NEXT EXERCISE" },
        ]} />
        <div className={fitmate.loopReturn} aria-hidden="true"><span data-reading-focus>↶ RE-ENGAGE / BACK TO CONNECT</span></div>
      </div>
      <p className={fitmate.formula} data-reading-focus>Connection → Action → Feedback → Reward → Re-engagement</p>
    </Chapter>

    <Chapter number="02-03" label="MVP PRIORITIZATION" title="모든 기능을 한 번에 구현하지 않고, 핵심 운동 경험이 완결되는 흐름부터 만들었습니다.">
      <div className={fitmate.priorities}>
        <div><div className={fitmate.priorityHeading}><span data-reading-focus>CORE MVP</span><strong data-reading-focus>FIRST</strong></div>
          <Flow className={fitmate.verticalFlow} label="Core MVP 우선 구현 흐름" steps={[
            { title: "AUTHENTICATION", detail: "Social Login · Nickname · Terms" }, { title: "MATE CONNECTION", detail: "Invite Code · Mate State" },
            { title: "MAIN EXPERIENCE", detail: "Mate / No Mate State" }, { title: "EXERCISE SETUP", detail: "Sport · Mode · Goal" },
            { title: "REAL-TIME EXERCISE", detail: "Cooperate · Compete" }, { title: "RESULT / HISTORY" },
          ]} />
          <p className={`${shared.bodyCopy} ${fitmate.supporting}`} data-reading-focus>먼저 사용자가 ‘연결 → 운동 → 완료’까지 끊김 없이 경험할 수 있는 Core Flow를 우선했습니다.</p>
        </div>
        <div className={fitmate.expansion}><div className={fitmate.priorityHeading}><span data-reading-focus>EXPANSION</span><strong data-reading-focus>NEXT</strong></div>
          <Flow className={fitmate.verticalFlow} label="핵심 경험 이후 확장" steps={[
            { title: "REWARD" }, { title: "SHOP" }, { title: "AVATAR" }, { title: "ADDITIONAL EXERCISE" }, { title: "UX REFINEMENT" },
          ]} />
          <p className={`${shared.bodyCopy} ${fitmate.supporting}`} data-reading-focus>핵심 경험을 구현한 이후 보상과 커스터마이징, 운동 종목 및 사용성을 확장하며 제품 경험을 단계적으로 고도화했습니다.</p>
        </div>
      </div>
    </Chapter>

    <div className={fitmate.closing}><span data-reading-focus>PRODUCT PRINCIPLE</span><strong data-reading-focus>Core Flow First.<br />Expansion After Validation.</strong><p className={shared.bodyCopy} data-reading-focus>기능의 개수보다 사용자의 핵심 행동이 끝까지 완결되는지를 우선했습니다.</p></div>
  </div>;
}
