import Image from "next/image";
import shared from "./harubareun-project-detail.module.css";
import tech from "./fitmate-technical-section.module.css";

type Step = { name: string; detail?: string };

function Flow({ steps, label, className = "" }: { steps: Step[]; label: string; className?: string }) {
  return <ol className={`${tech.flow} ${className}`} aria-label={label}>{steps.map((step) => <li key={step.name}><strong data-reading-focus>{step.name}</strong>{step.detail && <span data-reading-focus>{step.detail}</span>}</li>)}</ol>;
}

function Block({ label, title, ownership, children }: { label: string; title: string; ownership?: "MY CONTRIBUTION" | "TEAM PRODUCT SYSTEM" | "TEAM PRODUCT ARCHITECTURE"; children: React.ReactNode }) {
  return <section className={tech.block}>
    <div className={tech.blockTop}><span data-reading-focus>{label}</span>{ownership && <strong className={ownership === "MY CONTRIBUTION" ? tech.mine : tech.team} data-reading-focus>{ownership}</strong>}</div>
    <h3 data-reading-focus>{title}</h3>
    {children}
  </section>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className={`${shared.bodyCopy} ${tech.body}`} data-reading-focus>{children}</p>;
}

function Evidence({ src, alt, width, height, caption, className = "" }: { src: string; alt: string; width: number; height: number; caption?: string; className?: string }) {
  return <figure className={`${tech.evidence} ${className}`}><Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1100px) 90vw, 64vw" />{caption && <figcaption data-reading-focus>{caption}</figcaption>}</figure>;
}

export function DesignTechnicalSection() {
  return <div className={tech.study}>
    <header className={tech.intro}>
      <p className={shared.eyebrow} data-reading-focus>02 / DESIGN SYSTEM &amp; TECHNICAL FLOW</p>
      <h1 id="fitmate-detail-title" data-reading-focus>보이는 경험과,<br />그 경험을 작동시키는 구조까지.</h1>
      <div className={tech.introBody}>
        <Body>화면의 일관성을 위한 디자인 규칙을 정리하고, 사용자의 행동이 상태와 데이터 변화로 이어지는 구조까지 함께 고려했습니다.</Body>
        <Body>디자인과 개발을 분리된 단계로 보기보다, 하나의 Product Experience를 만드는 시스템으로 접근했습니다.</Body>
      </div>
    </header>

    <section className={tech.major} aria-labelledby="fitmate-design-system-title">
      <span className={tech.kicker} data-reading-focus>A / DESIGN SYSTEM</span>
      <h2 id="fitmate-design-system-title" data-reading-focus>게임처럼 직관적이되,<br />상태의 차이는 명확하게.</h2>
      <Body>FitMate는 운동 경험을 가볍고 재미있게 전달하기 위해 Dark UI와 Pixel Identity를 기반으로 구성했습니다.</Body>
      <Body>동시에 운동 상태, 협력과 대결, 보상과 선택 상태를 사용자가 빠르게 구분할 수 있도록 컬러, 타이포그래피, 인터랙션 컴포넌트에 역할을 부여했습니다.</Body>

      <Block label="02-01 / UI COMPONENT SYSTEM" title="반복되는 화면 요소를 하나의 인터랙션 언어로 정리했습니다.">
        <Evidence className={tech.componentEvidence} src="/images/projects/fitmate/design-system/components.png" alt="FitMate 입력 필드, 목표, 진행률, 탐색, 알림, 기록, 보상, 버튼 및 로그인 컴포넌트 시스템" width={8680} height={8840} />
        <Body>반복되는 인터페이스를 공통 규칙으로 정리해 운동 상태와 사용자 행동이 화면마다 일관되게 인지되도록 구성했습니다.</Body>
      </Block>

      <Block label="02-02 / COLOR & TYPOGRAPHY" title="색과 글자의 역할을 경험의 목적에 맞춰 분리했습니다.">
        <div className={tech.designEvidence}>
          <section><h4 data-reading-focus>COLOR AS STATE,<br />NOT DECORATION.</h4><Body>컬러를 장식 요소가 아니라 사용자의 상태와 행동을 구분하는 신호로 사용했습니다.</Body>
            <Evidence src="/images/projects/fitmate/design-system/colors.png" alt="FitMate 라임, 퍼플, 그레이 색상 시스템 원본" width={4704} height={1588} />
            <dl className={tech.colorRoles}><div><dt data-reading-focus>DARK</dt><dd data-reading-focus>Game Canvas / Contrast</dd></div><div><dt data-reading-focus>PURPLE</dt><dd data-reading-focus>Brand / Cooperation / Primary State</dd></div><div><dt data-reading-focus>LIME</dt><dd data-reading-focus>Competition / Reward / Active Feedback</dd></div></dl>
          </section>
          <section><h4 data-reading-focus>GAME IDENTITY<br /><em>+</em> FUNCTIONAL READABILITY</h4><Body>게임 아이덴티티가 필요한 영역과 빠른 정보 인지가 필요한 영역을 분리해 DungGeunMo와 Pretendard를 역할에 따라 사용했습니다.</Body>
            <Evidence src="/images/projects/fitmate/design-system/typography.png" alt="FitMate Pretendard와 DungGeunMo 타이포그래피 규칙 원본" width={6452} height={4260} />
            <dl className={tech.typeRoles}><div><dt data-reading-focus>DungGeunMo</dt><dd data-reading-focus>Exercise State · Numbers · Reward · Game Feedback</dd></div><div><dt data-reading-focus>Pretendard</dt><dd data-reading-focus>Functional UI · Supporting Information · Input / Setting · Body Copy</dd></div></dl>
          </section>
        </div>
      </Block>
    </section>

    <section className={tech.major} aria-labelledby="fitmate-technical-planning-title">
      <span className={tech.kicker} data-reading-focus>B / TECHNICAL PLANNING</span>
      <h2 id="fitmate-technical-planning-title" data-reading-focus>기술을 기능 목록으로 보지 않고,<br />사용자 경험을 작동시키는 구조로 설계했습니다.</h2>
      <Body>FitMate는 두 명의 사용자가 하나의 운동 경험을 공유하는 서비스이기 때문에 화면 전환만으로 기능을 정의할 수 없었습니다.</Body>
      <Body>사용자의 행동이 인증 상태, 메이트 관계, 운동 데이터, 실시간 세션과 UI 피드백에 어떻게 영향을 주는지 기준으로 기능을 구체화했습니다.</Body>
      <Flow className={tech.principleFlow} label="사용자 행동에서 UI 반응까지" steps={[{ name: "USER ACTION" }, { name: "STATE" }, { name: "DATA" }, { name: "UI RESPONSE" }]} />

      <Block label="02-03 / ARCHITECTURE" ownership="TEAM PRODUCT ARCHITECTURE" title="실시간 상태와 데이터 흐름을 UI 로직과 분리해 관리했습니다.">
        <div className={tech.architecture} role="img" aria-label="UIKit과 SnapKit 화면, View Controller, MVVM과 RxSwift View Model, Service Data Layer와 CoreLocation CoreMotion 센서, Firebase Auth Firestore FCM으로 이어지는 팀 아키텍처">
          <div className={tech.archNode}><strong data-reading-focus>USER INTERFACE</strong><span data-reading-focus>UIKit · SnapKit</span><small data-reading-focus>화면 구성 · 사용자 Interaction</small></div>
          <div className={tech.archNode}><strong data-reading-focus>VIEW / VIEW CONTROLLER</strong></div>
          <div className={`${tech.archNode} ${tech.archCore}`}><strong data-reading-focus>VIEW MODEL</strong><span data-reading-focus>MVVM · RxSwift</span><small data-reading-focus>UI 상태와 Business Logic 분리 · Reactive Data Binding</small></div>
          <div className={tech.archSplit}><div className={tech.archNode}><strong data-reading-focus>SERVICE / DATA LAYER</strong><span data-reading-focus>Matching · Realtime State · Record Persistence</span></div><div className={tech.archNode}><strong data-reading-focus>DEVICE SENSOR</strong><span data-reading-focus>CoreLocation · CoreMotion</span><small data-reading-focus>운동 데이터 감지</small></div></div>
          <div className={tech.archNode}><strong data-reading-focus>FIREBASE SERVICES</strong><span data-reading-focus>Auth · Firestore · FCM</span><small data-reading-focus>인증 · 상태 저장 · 상태 변화 전달</small></div>
        </div>
        <p className={tech.statement} data-reading-focus>SEPARATE THE VIEW.<br />CONNECT THE STATE.</p>
        <Body>MVVM과 RxSwift를 통해 화면과 상태 로직의 책임을 분리하고, Firebase와 Device Sensor에서 발생하는 변화를 UI에 반응형으로 전달하는 구조를 사용했습니다.</Body>
      </Block>

      <Block label="02-04 / ENTRY FLOW" ownership="MY CONTRIBUTION" title="로그인은 하나의 화면이 아니라, 최초 사용자 상태를 결정하는 흐름이었습니다.">
        <Flow className={tech.verticalFlow} label="인증과 온보딩 상태 흐름" steps={[{ name: "SOCIAL LOGIN", detail: "Kakao · Apple · Google" }, { name: "FIREBASE AUTH" }, { name: "AUTH STATE" }, { name: "USER DATA", detail: "Firestore" }, { name: "ONBOARDING STATE", detail: "Nickname · Terms" }, { name: "MAIN ENTRY" }]} />
        <p className={tech.relationship} data-reading-focus>AUTH → USER STATE → NEXT SCREEN</p>
        <Body>인증 성공 여부뿐 아니라 닉네임과 약관 완료 상태까지 다음 진입 조건과 연결해 신규 사용자와 기존 사용자의 Flow를 구분했습니다.</Body>
      </Block>

      <Block label="02-05 / MATE CONNECTION" ownership="MY CONTRIBUTION" title="메이트 연결 여부가 다음 사용자 행동을 결정하도록 설계했습니다.">
        <Flow className={tech.verticalFlow} label="초대 코드에서 메이트 상태까지" steps={[{ name: "INVITE CODE" }, { name: "SHARE / INPUT" }, { name: "FIRESTORE MATCH" }, { name: "MATE STATE" }]} />
        <div className={tech.branch}><div><strong data-reading-focus>NO MATE</strong><span data-reading-focus>INVITE ACTION</span></div><div><strong data-reading-focus>CONNECTED</strong><span data-reading-focus>EXERCISE ENTRY</span></div></div>
        <p className={tech.relationship} data-reading-focus>STATE → UI → NEXT ACTION</p>
        <Body>메이트 연결 여부를 단순 프로필 정보로 두지 않고, 메인 화면 구성과 운동 진입 가능 여부를 결정하는 Product State로 활용했습니다.</Body>
      </Block>

      <Block label="02-06 / REAL-TIME EXERCISE" ownership="TEAM PRODUCT SYSTEM" title="두 사용자의 운동 데이터를 하나의 세션 경험으로 연결했습니다.">
        <div className={tech.realtime}>
          <div><strong data-reading-focus>USER A DEVICE</strong><span data-reading-focus>CoreLocation / CoreMotion</span><span data-reading-focus>↓ EXERCISE DATA</span><span data-reading-focus>↓ VIEW MODEL</span></div>
          <div className={tech.realtimeCore}><strong data-reading-focus>FIRESTORE</strong><span data-reading-focus>MATCH / SESSION DATA</span><span data-reading-focus>↕ REAL-TIME LISTENER ↕</span></div>
          <div><strong data-reading-focus>MATE DEVICE</strong><span data-reading-focus>PROGRESS / STATUS UI</span></div>
        </div>
        <p className={tech.relationship} data-reading-focus>SENSOR → DATA → SYNC → FEEDBACK</p>
        <Body>걷기·러닝·자전거와 같은 위치 기반 운동과 줄넘기와 같은 움직임 기반 운동 데이터를 감지하고, Firebase를 통해 상대방 상태와 동기화해 실시간 운동 진행 UI에 반영하는 구조입니다.</Body>
      </Block>

      <Block label="02-07 / SESSION STATE" ownership="TEAM PRODUCT SYSTEM" title="정상 Flow뿐 아니라, 운동이 중단되는 순간까지 상태로 정의했습니다.">
        <div className={tech.session}><strong data-reading-focus>ACTIVE SESSION</strong><div className={tech.branch}><div><strong data-reading-focus>PAUSE</strong><span data-reading-focus>SESSION STATE</span></div><div><strong data-reading-focus>QUIT</strong><span data-reading-focus>QUIT STATE</span></div></div><Flow className={tech.verticalFlow} label="중단 상태 동기화" steps={[{ name: "FIRESTORE UPDATE" }, { name: "MATE LISTENER" }, { name: "SYNC UI RESPONSE" }, { name: "PAUSE / END / RETURN" }]} /></div>
        <p className={tech.edgeCases} data-reading-focus>BACKGROUND · DISCONNECT · FORCE QUIT · SESSION END · INVALID STATE</p>
        <Body>두 사용자가 동시에 참여하는 서비스에서는 한 사용자의 중단이 상대방의 세션에도 영향을 줍니다. 따라서 일시정지, 종료, 연결 해제와 같은 예외 상황을 단순 Alert가 아니라 공유 세션의 State Change로 다루었습니다.</Body>
        <p className={tech.statement} data-reading-focus>EDGE CASE IS<br />PART OF THE PRODUCT FLOW.</p>
      </Block>

      <Block label="02-08 / DATA STRUCTURE" ownership="TEAM PRODUCT SYSTEM" title="화면보다 먼저, 어떤 상태를 저장하고 연결할지 정의했습니다.">
        <div className={tech.dataModel} aria-label="Firestore의 개념적 Product State 관계">
          {[{ name: "USER", parts: "Profile · Mate State · Avatar State · Reward / Coin" }, { name: "MATCH / SESSION", parts: "Participants · Exercise Type · Exercise State · Progress · Session Status" }, { name: "EXERCISE RECORD", parts: "Result · Date · Exercise Data · Reward" }, { name: "SHOP / AVATAR", parts: "Unlock · Purchase · Selected State" }].map((item) => <div key={item.name}><strong data-reading-focus>{item.name}</strong><span data-reading-focus>{item.parts}</span></div>)}
        </div>
        <p className={tech.conceptLabel} data-reading-focus>CONCEPT DATA MODEL · 실제 collection / field schema가 아닌 Product State 관계</p>
        <Body>User, Mate, Session, Exercise Record, Reward가 각각 독립된 화면 정보가 아니라 서로 연결되는 Product Data라는 관점으로 구조화했습니다.</Body>
      </Block>

      <Block label="02-09 / REWARD LOOP" ownership="MY CONTRIBUTION" title="운동 결과를 제품 안에서 다시 사용할 수 있는 상태로 연결했습니다.">
        <Flow className={tech.verticalFlow} label="운동 결과에서 아바타 선택 상태까지" steps={[{ name: "EXERCISE COMPLETE" }, { name: "REWARD CALCULATION" }, { name: "COIN / REWARD" }, { name: "SHOP" }, { name: "PURCHASE" }, { name: "AVATAR STATE" }, { name: "SELECT / EQUIP" }, { name: "PERSIST DATA" }]} />
        <div className={`${tech.branch} ${tech.rewardOutputs}`}><div><strong data-reading-focus>MAIN</strong></div><div><strong data-reading-focus>MYPAGE</strong></div><div><strong data-reading-focus>EXERCISE</strong></div></div>
        <p className={tech.relationship} data-reading-focus>UI UPDATE</p>
        <Body>운동 완료 이후 획득한 보상이 상점과 아바타 선택 경험으로 이어지고, 변경된 상태가 메인·마이페이지·운동 화면에 일관되게 반영되도록 연결했습니다.</Body>
      </Block>
    </section>

    <section className={`${tech.major} ${tech.footer}`} aria-labelledby="fitmate-tech-stack-title">
      <div><span className={tech.kicker} data-reading-focus>C / TECH STACK</span><h2 id="fitmate-tech-stack-title" data-reading-focus>기술 자체보다, 각 기술이 어떤 사용자 경험을 가능하게 하는지에 집중했습니다.</h2>
        <p className={tech.stack} data-reading-focus>Swift · UIKit · SnapKit · MVVM · RxSwift · Firebase Auth · Firestore · FCM · CoreLocation · CoreMotion · Lottie · GitHub</p>
        <Body>Architecture, Database, Sensor, UI Framework를 각각 독립적인 기술 선택으로 보기보다 실시간 운동 경험을 구현하기 위한 하나의 시스템으로 연결했습니다.</Body>
      </div>
      <Evidence className={tech.readmeEvidence} src="/images/projects/fitmate/design-system/github-readme.png" alt="FitMate GitHub README의 핵심 기능 및 기술 스택 표" width={1298} height={900} caption="PROJECT README · Core Feature · Tech Stack · Architecture" />
    </section>
  </div>;
}
