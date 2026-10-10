import { FitMateChapter, FitMateFlow } from "./FitMateEditorial";
import s from "./fitmate-editorial.module.css";

export function FitMateProblemSection() {
  return <FitMateChapter id="fitmate-problem" label="01 / THE PROBLEM" title={<>운동 기록은 남지만,<br />다시 운동할 이유는 남지 않았습니다.</>}>
    <p>기존의 운동 기록만으로는 사용자가 다시 앱을 열 이유를 만들기 어렵다고 봤습니다.</p>
    <p>우리는 운동 자체보다 ‘누군가와 함께하고 있다는 감각’이 지속에 영향을 줄 수 있다고 생각했고, 관계·공동 목표·피드백을 하나의 운동 경험으로 묶는 방향을 잡았습니다.</p>
    <ol className={s.definition} aria-label="문제, 가설, 제품 방향" data-sequence>
      <li data-flow-step><span className={s.label}>PROBLEM</span><h3>혼자 남기는 기록</h3><p>과정을 공유할 대상과 지속적인 동기가 부족하다.</p></li>
      <li data-flow-step><span className={s.label}>HYPOTHESIS</span><h3>관계 · 공동 목표 · 피드백</h3><p>운동 과정에 연결과 피드백을 더하면 다시 참여할 이유를 만들 수 있다.</p></li>
      <li data-flow-step><span className={s.label}>PRODUCT DIRECTION</span><h3>Mate-based<br /><em>fitness experience</em></h3><p>기록을 남기는 것에서 함께 운동하는 경험으로.</p></li>
    </ol>
  </FitMateChapter>;
}

export function FitMateCoreExperienceSection() {
  return <FitMateChapter id="fitmate-core" label="02 / CORE EXPERIENCE" title={<>연결을 기능 하나로 끝내지 않고,<br />다음 운동까지 돌아오는 경험으로 만들었습니다.</>}>
    <div className={s.coreLoop}>
      <div className={s.loopNote}><span className={s.label}>CORE PRODUCT LOOP</span><p className={s.statement}>Connection → Action → Feedback → Reward → <em>Re-engagement</em></p><p>메이트 연결부터 운동 기록과 보상까지, 다음 운동으로 이어지는 하나의 흐름을 설계했습니다.</p></div>
      <FitMateFlow className={s.coreSteps} label="연결에서 다음 운동까지" steps={[
        {title:"CONNECT",detail:"메이트 연결"},{title:"CHOOSE",detail:"종목 · 목표 · 모드 선택"},
        {title:"MOVE TOGETHER",detail:"협력 또는 대결"},{title:"FEEDBACK",detail:"실시간 진행 상태 확인"},
        {title:"RECORD",detail:"운동 결과와 기록"},{title:"REWARD",detail:"포인트 · 아바타 · 성장"},
        {title:"NEXT EXERCISE",detail:"다시 메이트와 운동하기"},
      ]} />
    </div>
  </FitMateChapter>;
}

export function FitMateMvpSection() {
  return <FitMateChapter id="fitmate-mvp" label="03 / DEFINE THE MVP" title={<>기능을 많이 만드는 것보다,<br />핵심 경험이 끝까지 완결되는 것을 먼저 봤습니다.</>}>
    <p>아이디어 단계에서는 메이트, 운동, 보상, 상점, 아바타 등 구현하고 싶은 기능이 많았습니다.</p>
    <p>하지만 첫 버전에서는 사용자가 ‘연결 → 운동 → 완료’까지 끊김 없이 경험할 수 있는 흐름을 먼저 만들기로 했습니다. 보상과 커스터마이징은 그 이후에 확장했습니다.</p>
    <div className={s.priorities} data-sequence>
      <div data-flow-step><span className={s.label}>CORE MVP / FIRST</span><h3>먼저, 끝까지<br /><em>완결되는 흐름.</em></h3>
        <FitMateFlow label="Core MVP" steps={[
          {title:"AUTHENTICATION",detail:"Social Login · Nickname · Terms"},{title:"MATE CONNECTION",detail:"Invite Code · Mate State"},
          {title:"MAIN EXPERIENCE",detail:"Mate / No Mate State"},{title:"EXERCISE SETUP",detail:"Sport · Mode · Goal"},
          {title:"REAL-TIME EXERCISE",detail:"Cooperate · Compete"},{title:"RESULT / HISTORY",detail:"완료와 기록 확인"},
        ]} />
      </div>
      <div data-flow-step><span className={s.label}>EXPANSION / NEXT</span><h3>그 다음,<br /><em>다시 돌아올 이유.</em></h3>
        <FitMateFlow label="핵심 경험 이후 확장" steps={[
          {title:"REWARD"},{title:"SHOP"},{title:"AVATAR"},{title:"ADDITIONAL EXERCISE"},{title:"UX REFINEMENT"},
        ]} /><p>핵심 경험을 구현한 뒤 보상과 커스터마이징, 운동 종목과 사용성을 확장했습니다.</p>
      </div>
    </div>
  </FitMateChapter>;
}
