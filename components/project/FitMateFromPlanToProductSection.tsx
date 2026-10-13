import { FitMateChapter, FitMateFlow } from "./FitMateEditorial";
import s from "./fitmate-editorial.module.css";

export function FitMateMakeItWorkSection() {
  return <FitMateChapter id="fitmate-system" label="04 / MAKE IT WORK" title={<>화면을 설계한 뒤,<br />그 화면이 어떤 상태에서 어떻게 달라지는지까지 내려갔습니다.</>}>
    <p>“메이트와 함께 운동하고 싶다”는 요구를 바로 화면으로 옮기지 않았습니다.</p>
    <p>메이트가 없는 상태부터 연결, 운동 중, 일시정지, 완료까지 상황을 나누고, 각각 어떤 정보가 바뀌고 화면이 어떻게 달라져야 하는지 정리했습니다.</p>
    <FitMateFlow className={s.requirement} label="From Requirement to System" steps={[
      {title:"USER NEED",detail:"메이트와 함께 운동하고 싶다"},
      {title:"PRODUCT REQUIREMENT",detail:"메이트 연결 + 공동 운동"},
      {title:"UX FLOW",detail:"Invite → Match → Exercise → Result"},
      {title:"STATE",detail:"No Mate · Connected · Active · Paused · Completed"},
      {title:"DATA / SYSTEM",detail:"Auth · Firestore · Session · Sensor Data · Realtime Sync"},
      {title:"UI RESPONSE",detail:"Main State · Progress · Alert · Result · Reward"},
    ]} />
    <div className={s.stateSequence} data-sequence aria-label="메이트 연결부터 운동 완료까지의 상태">
      {[["NO MATE","초대 / 입력"],["CONNECTED","운동 진입"],["ACTIVE","실시간 진행"],["PAUSED","중단 상태 공유"],["COMPLETED","결과 / 보상"]].map(([state,response])=><div key={state} data-flow-step><span className={s.stateDot} aria-hidden="true" /><strong>{state}</strong><span>{response}</span></div>)}
    </div>
    <p className={s.note}>함께 운동하는 중 한 사람이 멈추거나 나가면 상대방 화면도 같이 바뀌어야 했습니다. 그래서 정상적인 운동 흐름뿐 아니라 일시정지, 종료, 연결 해제 같은 상황도 함께 확인했습니다.</p>
  </FitMateChapter>;
}

export function FitMateFromPlanToProductSection() {
  return <FitMateChapter id="fitmate-result" label="09 / RESULT & MY ROLE" title={<>From product intent<br />to <em>technical reality.</em></>}>
    <div className={s.resultAxes}>
      {[["PRODUCT THINKING","Problem · Core Flow · Priority · User State","서비스 구조, 핵심 흐름, 기능 우선순위와 화면 구성을 정리했습니다."],["TECHNICAL TRANSLATION","State · Data Flow · Edge Case · System","사용자가 원하는 기능을 화면으로만 정리하지 않고, 상태가 언제 바뀌는지와 어떤 예외가 생길지도 함께 봤습니다."],["EXECUTION","Build · Test · Issue · Iteration","Swift 구현에 참여하고, 확인된 문제를 UI·상태·로직 단위로 수정했습니다."]].map(([title,keywords,body])=><div key={title}><span className={s.label}>{title}</span><p>{body}</p><small>{keywords}</small></div>)}
    </div>
    <div className={s.ownershipKey}>
      <div><span className={s.mine}>MY CONTRIBUTION</span><h3>기획 · UX 방향 · iOS 구현</h3><p>서비스 구조와 핵심 사용자 흐름, 정보 구조와 화면 방향을 맡았습니다. 온보딩, 메이트 연결, 메인 경험, 상점과 아바타 상태, UI/UX 개선에 참여했습니다.</p></div>
      <div><span className={s.team}>TEAM PRODUCT</span><h3>함께 구현하고, 테스트하고, 출시</h3><p>실시간 운동과 공유 세션, 전체 아키텍처와 App Store 출시는 팀 제품의 결과입니다.</p><p className={s.note}>Visual Design — Collaborating Designer<br />Development — iOS Team</p></div>
    </div>
    <p className={s.note}>출시와 구현 결과를 중심으로 정리했습니다. 운동 지속률이나 사용자 성장 수치가 검증된 성과라는 의미는 아닙니다.</p>
  </FitMateChapter>;
}

export function FitMateReflectionSection() {
  return <FitMateChapter id="fitmate-reflection" label="WHAT I LEARNED" title={<>화면 사이의 상태가<br /><em>다음 행동을 만듭니다.</em></>}>
    <p>FitMate를 만들면서 화면 하나보다 화면 사이에서 일어나는 상태 변화가 제품 경험을 더 크게 좌우한다는 걸 배웠습니다.</p>
    <p>이후에는 기능을 기획할 때도 어떤 화면이 필요한지보다, 사용자가 무엇을 하고 그다음에 무엇이 바뀌어야 하는지를 먼저 보게 됐습니다.</p>
    <FitMateFlow label="다음 기획에서 먼저 확인하는 흐름" steps={[{title:"USER"},{title:"ACTION"},{title:"STATE"},{title:"DATA"},{title:"NEXT EXPERIENCE"}]} />
  </FitMateChapter>;
}
