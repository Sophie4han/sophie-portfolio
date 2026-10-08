import { HomeHoverEffects } from "./HomeHoverEffects";
import { DelayedDown } from "./DelayedDown";
import { SelectedWork } from "./SelectedWork";
import { HomeAnchor } from "./HomeAnchor";
import styles from "./home.module.css";

function SerifWord({ children, raspberry = false }: { children: string; raspberry?: boolean }) {
  return <span className={`${styles.serifWord} ${raspberry ? styles.raspberry : ""}`}><span>{children}</span><svg className={styles.emphasis} viewBox="0 0 36 18" aria-hidden="true" focusable="false"><path d="M7.5 14.5Q6.3 11.3 3.2 7.8" strokeWidth="1.8" /><path d="M17.4 10.2C18 7.4 16.8 4.8 17.6 1.4" strokeWidth="2" /><path d="M28.3 14Q31.1 10.9 33.4 6.1" strokeWidth="1.65" /></svg></span>;
}

export function HomePage() {
  return <div className={styles.home}>
    <a className={styles.skip} href="#work">프로젝트로 바로 가기</a>
    <main>
      <section className={styles.hero} data-home-hero aria-labelledby="intro-title">
        <HomeHoverEffects />
        <svg data-welcome-badge className={styles.welcomeBadge} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
          <defs><path id="home-welcome-circle" d="M60 12a48 48 0 1 1 0 96a48 48 0 1 1 0-96" /></defs>
          <g className={styles.badgeRing}><text><textPath href="#home-welcome-circle" textLength="301.59" lengthAdjust="spacingAndGlyphs">Welcome to sophie&apos;s portfolio <tspan className={styles.badgeHeart}>♥︎</tspan> Welcome to sophie&apos;s portfolio <tspan className={styles.badgeHeart}>♥︎</tspan> Welcome to sophie&apos;s portfolio <tspan className={styles.badgeHeart}>♥︎</tspan> </textPath></text></g>
          <g className={styles.badgeFace}>
            <path className={styles.badgeEyeLeft} d="M46 45Q45.2 47 45.7 48.5" />
            <path className={styles.badgeEyeRight} d="M72 46Q72.7 47.6 72.2 49" />
            <path d="M40 65C43 77 51 81 59 80.5C69 81 77 73 80 63.5" />
          </g>
        </svg>
        <h1 id="intro-title" className={styles.headline}>
          <span className={styles.line}><span>I started<span className={styles.mobileBreak}><br /></span> with <SerifWord>design</SerifWord>,</span></span>
          <span className={styles.line}><span>then kept moving <span className={styles.toward} data-toward>toward</span></span></span>
          <span className={styles.line}><span>the <SerifWord raspberry>questions</SerifWord> behind it.</span></span>
        </h1>
        <div className={styles.copy} data-intro>
          <p>저는 정해진 길보다 납득할 수 있는 방향을 개척하고 선택해왔습니다. 디자인으로 시작했지만 화면을 만드는 일에 머무르기보다, 왜 만드는지, 누구에게 필요한지, 실제로 어떻게 움직이는지가 궁금해졌습니다.</p>
          <p>그렇게 검색 운영과 서비스 기획, 브랜드와 상품까지 경험을 넓혀왔습니다. 하나의 역할에 저를 맞추기보다, 필요한 문제를 발견하면 직접 배우고 부딪히며 해결합니다.</p>
        </div>
        <p className={styles.positioning} data-positioning><span>Product · Brand · Commerce</span><span>그 접점에서 다음 일을 찾고 있습니다.</span></p>
        <DelayedDown />
      </section>
      <SelectedWork />
      <section id="about" className={styles.about} aria-labelledby="about-title">
        <h2 className={styles.eyebrow} id="about-title">ABOUT</h2>
        <div><p className={styles.aboutLead}>결과 뒤의 선택을 이야기합니다.</p><p className={styles.aboutCopy}>각 프로젝트에서 어떤 문제를 발견하고, 무엇을 결정했는지.<br />작업의 맥락과 직접 맡은 역할을 케이스 스터디에 담았습니다.</p><HomeAnchor href="#work" className={styles.aboutLink}>Explore my work <span aria-hidden="true">↗</span></HomeAnchor></div>
      </section>
    </main>
    <footer id="contact" className={styles.footer}>
      <p className={styles.footerLogo}>MOVE ON<span aria-hidden="true">↗</span></p>
      <div className={styles.footerBottom}><div className={styles.contacts}><span>Email <small>[주소 확인 필요]</small></span><span>LinkedIn <small>[주소 확인 필요]</small></span><span>Instagram <small>[주소 확인 필요]</small></span></div><p>SEOUL · 2026</p></div>
    </footer>
  </div>;
}
