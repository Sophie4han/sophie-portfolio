"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CAREER_CASES, type CareerCase } from "@/lib/experience";
import { RETURN_TO_WORK_KEY } from "@/components/project/ProjectNavigation";
import home from "@/components/home/home.module.css";
import s from "./experience.module.css";
import { HandwrittenIntro } from "./HandwrittenIntro";

const intro = [
  "디자인으로 시작했고 만들다 보니 이유가 궁금해졌고 고객을 만나며 반응을 보게 됐습니다.",
  "그리고 운영하면서 구조를 보기 시작했고, 지금은 제품을 기획하고 운영하는 쪽으로 다음 커리어를 이어가려 합니다."
];

function Diagram({ nodes, kind }: { nodes: readonly string[]; kind?: CareerCase["kind"] }) {
  return <ol className={s.diagram} data-diagram data-kind={kind ?? "flow"} aria-label={nodes.join(kind === "exchange" ? " ↔ " : " → ")}>
    {nodes.map((node,index)=><li key={node} style={{"--step":index} as CSSProperties}>
      <span className={s.node}>{node}</span>
      {kind === "branch" && index === 0 && <><small>Product Planning · Operation</small><em>scope expanded</em></>}
      {kind === "branch" && index === 2 && <small>Product · Brand · Commerce</small>}
    </li>)}
  </ol>;
}

function Career({ item }: { item: CareerCase }) {
  return <section id={item.id} className={s.case} data-career-case data-branch={item.kind === "branch" || undefined} aria-labelledby={`${item.id}-title`}>
    <header className={s.identity}><span className={s.number}>{item.number}</span><h2 id={`${item.id}-title`}>{item.company}</h2>{item.affiliation && <p className={s.affiliation}>{item.affiliation}</p>}<p className={s.role}>{item.role}</p><span className={s.category}>{item.category}</span></header>
    <div className={s.caseBody}><h3>{item.statement}</h3><div className={s.copy}>{item.paragraphs.map(p=><p key={p}>{p}</p>)}</div>
      <Diagram nodes={item.diagram} kind={item.kind} />
      {item.annotation && <p className={s.annotation}>{item.annotation}</p>}
      <ul className={s.keywords} aria-label="경험 키워드">{item.keywords.map(word=><li key={word}>{word}</li>)}</ul>
      {item.projectId && <Link className={s.caseLink} href={`/?project=${item.projectId}`}>View case study <span aria-hidden="true">↗</span><span className={s.srOnly}> — {item.projectId === "harubareun" ? "HARUBAREUN" : "INVADER SCHOOL"}</span></Link>}
    </div>
  </section>;
}

export function ExperiencePage() {
  const root = useRef<HTMLDivElement>(null);
  const [active,setActive] = useState<string | null>(null);
  useEffect(()=>{
    const node = root.current;
    if (!node) return;
    const cases = [...node.querySelectorAll<HTMLElement>("[data-career-case]")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = innerHeight * .5;
      const current = cases.find(el=>{ const rect=el.getBoundingClientRect(); return rect.top <= marker && rect.bottom > marker; });
      setActive(current?.id ?? null);
    };
    const schedule = () => { if(!frame) frame=requestAnimationFrame(update); };
    const reveal = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{ if(entry.isIntersecting) { entry.target.setAttribute("data-entered","true"); reveal.unobserve(entry.target); } });
    },{threshold:.2});
    node.querySelectorAll("[data-diagram]").forEach(el=>reveal.observe(el));
    const resize = new ResizeObserver(schedule);
    resize.observe(node);
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule);
    update();
    return ()=>{cancelAnimationFrame(frame);reveal.disconnect();resize.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);};
  },[]);
  return <div ref={root} className={s.page}>
    <Link className={s.back} href="/#work" onClick={()=>sessionStorage.setItem(RETURN_TO_WORK_KEY,"true")}><span aria-hidden="true">←</span><span className={s.backText}> Back to work</span><span className={s.srOnly}> HOME Selected Work</span></Link>
    <main>
      <section className={s.intro} aria-labelledby="experience-title">
        <h1 id="experience-title" className={s.srOnly}>Experience — 경력의 흐름</h1>
        <p className={s.caption}>started with design, then kept moving toward the questions behind it.</p>
        <HandwrittenIntro phrases={intro} className={s.phrases} />
      </section>
      <div className={s.journey}>
        <aside className={s.rail}>
          <nav aria-label="Career progression"><ol>{CAREER_CASES.map(item=><li key={item.id} data-current={active===item.id} data-branch={item.kind==="branch" || undefined}><Link href={`#${item.id}`} aria-current={active===item.id?"step":undefined} aria-label={`${item.company} — ${item.stage}`}><i aria-hidden="true" /><span>{item.stage}</span></Link></li>)}</ol></nav>
        </aside>
        <div>{CAREER_CASES.map(item=><Career key={item.id} item={item} />)}</div>
      </div>
      <section className={s.productBuild} aria-labelledby="product-build-title">
        <header className={s.identity}><span className={s.category}>PRODUCT BUILD</span><h2 id="product-build-title">FitMate</h2><p className={s.role}>별도의 iOS 팀 프로젝트</p></header>
        <div className={s.caseBody}><h3>Learning by building the product myself.</h3><div className={s.copy}><p>제품 구조를 더 깊이 이해하기 위해 기획과 UX에 그치지 않고 실제 iOS 구현과 사용자 테스트, 출시까지 경험했습니다.</p></div><Diagram nodes={["PLAN","STRUCTURE","BUILD","TEST","SHIP"]} /><Link href="/?project=fitmate" className={s.caseLink}>View case study <span aria-hidden="true">↗</span><span className={s.srOnly}> — FitMate</span></Link></div>
      </section>
      <section className={s.ending} aria-labelledby="positioning-title"><p>Where I am now</p><h2 id="positioning-title">Product <i>·</i> Brand <i>·</i> Commerce</h2><p>지금은 이 세 가지가 만나는 지점에서 다음 일을 찾고 있습니다.</p><Link href="/#work" className={s.caseLink} onClick={()=>sessionStorage.setItem(RETURN_TO_WORK_KEY,"true")}>Back to work <span aria-hidden="true">↗</span></Link></section>
    </main>
    <footer className={home.marqueeFooter} aria-label="Thanks for reading!"><span className={home.marqueeLabel}>Thanks for reading!</span><div className={home.marqueeTrack} aria-hidden="true">{[0,1].map(group=><div key={group} className={home.marqueeGroup}>{[0,1,2,3].map(i=><span key={i}>Thanks for <em>reading!</em><b>♥</b></span>)}</div>)}</div></footer>
  </div>;
}
