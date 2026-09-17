"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import shared from "./harubareun-project-detail.module.css";
import s from "./harubareun-summary.module.css";

interface SummaryProduct {
  name: string;
  image: string;
  alt: string;
  positioning: string;
  customerValue: React.ReactNode;
  communication: React.ReactNode;
}

const MARKET_FLOW = [
  ["PRODUCT OPPORTUNITY", "시장성이 있는 제품 후보"],
  ["PRODUCT STRATEGY", "타깃 · 고객 문제 · 구매 이유"],
  ["POSITIONING", "제품별 차별화 방향 · 시장 언어 정의"],
  ["BRAND ARCHITECTURE", "브랜드 구조 · Naming · Message"],
  ["PRODUCT EXPERIENCE", "Package · Content · Detail Page"],
  ["COMMERCE", "Storefront · Purchase Environment"],
  ["LAUNCH READY", "실제 판매 가능한 Consumer Product"],
] as const;

function Body({ children }: { children: React.ReactNode }) {
  return <p className={`${shared.bodyCopy} ${s.body}`} data-reading-focus>{children}</p>;
}

function Chapter({ label, title, children, id }: { label: string; title: React.ReactNode; children: React.ReactNode; id: string }) {
  return <section className={s.chapter} aria-labelledby={id}>
    <span className={s.label} data-reading-focus>{label}</span>
    <h2 id={id} data-reading-focus>{title}</h2>
    {children}
  </section>;
}

function ProductCarousel({ products }: { products: SummaryProduct[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % products.length), 4000);
    return () => window.clearInterval(timer);
  }, [paused, products.length, reducedMotion]);

  const move = (direction: number) => setActive((index) => (index + direction + products.length) % products.length);
  const current = products[active];

  return <div className={s.carousel} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div className={s.carouselStage} role="region" aria-label="네 가지 Consumer Product" tabIndex={0}
      onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } if (event.key === "ArrowRight") { event.preventDefault(); move(1); } }}
      onPointerDown={(event) => { pointerStart.current = event.clientX; }}
      onPointerUp={(event) => { if (pointerStart.current !== null) { const delta = event.clientX - pointerStart.current; if (Math.abs(delta) > 45) move(delta > 0 ? -1 : 1); pointerStart.current = null; } }}
      onPointerCancel={() => { pointerStart.current = null; }}>
      {products.map((product, index) => {
        const forward = (index - active + products.length) % products.length;
        const place = forward === 0 ? "center" : forward === 1 ? "right" : forward === products.length - 1 ? "left" : "hidden";
        return <figure className={s.slide} data-place={place} aria-current={place === "center" ? "true" : undefined} aria-hidden={place === "hidden"} key={product.name}>
          <Image src={product.image} alt={product.alt} width={3024} height={4032} sizes="(max-width: 760px) 75vw, 33vw" draggable={false} />
          <figcaption>{product.name}</figcaption>
        </figure>;
      })}
    </div>
    <div className={s.carouselControls}>
      <button type="button" onClick={() => move(-1)} aria-label="이전 제품">←</button>
      <div className={s.pagination} aria-label="제품 선택">{products.map((product, index) => <button type="button" key={product.name} aria-label={`${product.name} 보기`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />)}</div>
      <button type="button" onClick={() => move(1)} aria-label="다음 제품">→</button>
    </div>
    <div className={s.productCopy} aria-live="off">
      <span className={s.label} data-reading-focus>{String(active + 1).padStart(2, "0")} / 04 CONSUMER PRODUCTS</span>
      <h3 data-reading-focus>{current.name}</h3>
      <dl>
        <div><dt data-reading-focus>POSITIONING</dt><dd data-reading-focus>{current.positioning}</dd></div>
        <div><dt data-reading-focus>CUSTOMER VALUE</dt><dd data-reading-focus>{current.customerValue}</dd></div>
        <div><dt data-reading-focus>COMMUNICATION DIRECTION</dt><dd data-reading-focus>{current.communication}</dd></div>
      </dl>
    </div>
  </div>;
}

export function HarubareunSummary({ products }: { products: SummaryProduct[] }) {
  return <div className={s.summary}>
    <header className={s.hero}>
      <span className={`${shared.eyebrow} ${s.label}`}>01 / BUILD</span>
      <h1 id="harubareun-detail-title" className={s.heroTitle}>HARUBAREUN</h1>
      <p className={s.lead}>From Product Opportunity to Launch-ready</p>
      <h2 className={s.mainStatement} data-reading-focus>시장성이 확인된 제품 후보를,<br />서로 다른 구매 이유를 가진<br />4개의 Consumer Product로 기획했습니다.</h2>
      <div className={s.heroBody}>
        <Body>제품 후보가 있다는 것만으로는 실제 사업이 되지 않습니다. 누구에게 필요한 제품인지, 이미 존재하는 선택지와 무엇이 다른지, 어떤 언어로 고객에게 설득할 것인지부터 다시 정의해야 했습니다.</Body>
        <Body>HARUBAREUN 프로젝트에서는 각 제품의 시장성과 특성을 바탕으로 타깃 고객 · 제품 가치 · 포지셔닝 · 브랜드 구조 · 판매 메시지를 구체화하고, 이를 패키지와 콘텐츠, 상세페이지, D2C Storefront까지 연결했습니다.</Body>
        <Body>단순히 제품을 디자인하는 것이 아니라, 제품이 시장에서 선택받기 위해 필요한 구조를 만들고 실제 판매 가능한 상태까지 구현하는 것을 목표로 진행했습니다.</Body>
      </div>
      <dl className={s.facts}>
        <div><dt data-reading-focus>PROJECT</dt><dd data-reading-focus>New Business<br />Health &amp; Wellness</dd><dd className={s.factMeta} data-reading-focus>2026.06–08</dd></div>
        <div><dt data-reading-focus>ROLE</dt><dd data-reading-focus>Product Planning<br />Brand Architecture<br />Commerce Planning &amp; Execution</dd></div>
        <div><dt data-reading-focus>SCOPE</dt><dd data-reading-focus>4 Consumer Products<br />Product Strategy → Sales-ready</dd></div>
        <div><dt data-reading-focus>KEY DECISION</dt><dd data-reading-focus>Master Brand<br />→ Independent Product Brands</dd></div>
        <div><dt data-reading-focus>OUTPUT</dt><dd data-reading-focus>4 Product Brands<br />D2C Storefront<br />Commerce Environment</dd></div>
      </dl>
      <Body>제품 기획부터 브랜드와 판매환경 구축까지 각 업무를 분리된 결과물이 아니라, 하나의 Product Launch Process로 연결해 실행했습니다.</Body>
    </header>

    <Chapter id="planning-question" label="THE PLANNING QUESTION" title={<>어떤 제품을 사업화하고,<br />무엇을 다르게 만들며,<br />그 차이를 고객에게 어떻게 전달할 것인가.</>}>
      <div className={s.chapterCopy}>
        <Body>프로젝트의 시작점은 로고나 패키지 시안이 아니었습니다. 각 후보 제품이 실제 시장에서 어떤 역할을 가질 수 있는지 검토하고, 제품마다 고객이 구매해야 할 이유가 무엇인지 정의하는 것이 먼저였습니다.</Body>
        <Body>같은 건강식품 카테고리 안에서도 원료와 기능만 다르게 보여주는 것으로는 충분하지 않았기 때문에, 제품별 타깃과 고객 기대, 사용 맥락에 따라 서로 다른 Product Proposition을 만드는 방향으로 접근했습니다.</Body>
      </div>
      <div className={s.questionColumns}>
        <div><strong data-reading-focus>WHO</strong><h3 data-reading-focus>누구를 위한 제품인가</h3><p data-reading-focus>타깃 고객의 관심사와 제품을 찾게 되는 상황을 정의합니다.</p></div>
        <div><strong data-reading-focus>WHY</strong><h3 data-reading-focus>왜 이 제품이어야 하는가</h3><p data-reading-focus>원료와 제품의 특성을 고객이 이해할 수 있는 구매 이유로 변환합니다.</p></div>
        <div><strong data-reading-focus>HOW</strong><h3 data-reading-focus>어떻게 선택하게 만들 것인가</h3><p data-reading-focus>제품명, 메시지, 비주얼, 상세페이지와 판매환경까지 하나의 경험으로 연결합니다.</p></div>
      </div>
      <p className={s.statement} data-reading-focus>PRODUCT PLANNING<br /><em>STARTS BEFORE DESIGN.</em></p>
      <Body>디자인은 결정의 시작점이 아니라, 앞서 정의한 제품 전략을 고객에게 전달하는 수단으로 사용했습니다.</Body>
    </Chapter>

    <Chapter id="opportunity-market" label="FROM OPPORTUNITY TO MARKET" title={<>제품 후보를 발견하는 것에서 끝내지 않고,<br />실제 시장에 진입할 수 있는 구조까지 설계했습니다.</>}>
      <ol className={s.marketFlow} aria-label="제품 기회부터 판매 가능한 제품까지 이어지는 전략 흐름">
        {MARKET_FLOW.map(([title, detail], index) => <li key={title}><span data-reading-focus>{String(index + 1).padStart(2, "0")}</span><strong data-reading-focus>{title}</strong><p data-reading-focus>{detail}</p></li>)}
      </ol>
      <div className={s.chapterCopy}><Body>각 단계를 독립적인 디자인 업무로 보지 않았습니다. 앞 단계에서 내린 판단이 다음 단계의 기준이 되도록 연결했습니다.</Body><Body>타깃과 구매 이유가 정해지면 제품의 Positioning이 결정되고, Positioning은 브랜드 언어와 비주얼의 기준이 되며, 다시 그 결과가 상세페이지와 Storefront에서 고객이 제품을 이해하고 구매하는 방식으로 이어지도록 설계했습니다.</Body></div>
      <p className={s.processStatement} data-reading-focus>OPPORTUNITY <em>→</em> STRATEGY <em>→</em> EXPERIENCE <em>→</em> MARKET</p>
    </Chapter>

    <Chapter id="strategic-decision" label="KEY STRATEGIC DECISION" title={<>하나의 브랜드를 확장하기보다,<br />제품별 시장성을 독립적으로 검증할 수 있는 구조를 선택했습니다.</>}>
      <div className={s.chapterCopy}><Body>초기에는 HARUBAREUN을 중심으로 여러 제품을 확장하는 Master Brand 구조를 고려했습니다. 하지만 프로젝트가 진행되면서 사업 방향이 “하나의 브랜드를 키우는 방식”에서 “SKU별 시장성을 먼저 검증하고 성과에 따라 선택적으로 확장하는 방식”으로 변화했습니다.</Body><Body>이에 따라 기존 브랜드 구조를 그대로 유지하기보다, 사업 모델에 맞춰 Brand Architecture 자체를 다시 설계했습니다.</Body></div>
      <div className={s.decisionDiagram}>
        <div><span data-reading-focus>BEFORE</span><strong data-reading-focus>HARUBAREUN<br />↓ MASTER BRAND<br />↓ MULTIPLE SUB-PRODUCTS</strong></div>
        <div><span data-reading-focus>BUSINESS MODEL SHIFT</span><strong data-reading-focus>SKU별 시장성 검증<br />→ 성과 기반 선택적 확장</strong></div>
        <div><span data-reading-focus>AFTER</span><strong data-reading-focus>SORI BLACK · BABI CUT<br />LEMONDE OLI · RECELLVINE</strong><small data-reading-focus>INDEPENDENT PRODUCT BRANDS</small></div>
      </div>
      <Body>브랜드 구조를 고정된 디자인 체계로 보지 않고, 현재의 사업 전략을 가장 잘 지원하는 Product Structure로 판단했습니다. 그 결과 각 제품은 동일한 브랜드 언어에 종속되지 않고, 제품별 타깃과 시장 특성에 맞는 포지셔닝과 커뮤니케이션을 구축할 수 있었습니다.</Body>
    </Chapter>

    <Chapter id="consumer-products" label="04 CONSUMER PRODUCTS" title={<>하나의 카테고리 안에서도,<br />제품마다 다른 구매 이유를 설계했습니다.</>}>
      <div className={s.chapterCopy}><Body>네 제품 모두 건강과 웰니스라는 큰 카테고리에 속하지만, 고객이 관심을 갖는 이유와 제품에서 기대하는 경험은 서로 달랐습니다.</Body><Body>따라서 하나의 디자인 시스템을 반복 적용하기보다, 제품의 원료 특성 · 타깃 · 구매 동기 · 브랜드 톤을 각각 정의하고 이를 제품별 Positioning으로 구체화했습니다.</Body></div>
      <ProductCarousel products={products} />
      <p className={s.fixedStatement} data-reading-focus>같은 카테고리에 속한 제품이라도,<br />“무엇을 파는가”보다<br />“고객이 왜 선택하는가”를 기준으로 제품을 구분했습니다.</p>
    </Chapter>

    <Chapter id="strategy-execution" label="STRATEGY INTO EXECUTION" title={<>전략을 문서에서 끝내지 않고,<br />실제 고객이 제품을 만나는 모든 접점으로 연결했습니다.</>}>
      <ol className={s.executionFlow} aria-label="상품기획에서 커머스 경험까지">
        <li><strong data-reading-focus>PRODUCT PLANNING</strong><span data-reading-focus>시장 기회 · 타깃 · 구매 이유 · 제품 방향</span></li>
        <li><strong data-reading-focus>BRAND SYSTEM</strong><span data-reading-focus>Architecture · Naming · Message · Visual Direction</span></li>
        <li><strong data-reading-focus>PRODUCT EXPERIENCE</strong><span data-reading-focus>Package · Content · Detail Page</span></li>
        <li><strong data-reading-focus>COMMERCE EXPERIENCE</strong><span data-reading-focus>D2C Storefront · Purchase Flow · Channel Setup</span></li>
      </ol>
      <div className={s.chapterCopy}><Body>전략 단계에서 정의한 내용이 실제 실행 과정에서 달라지지 않도록, 제품이 고객에게 노출되는 접점을 연속된 경험으로 관리했습니다.</Body><Body>제품명과 패키지에서 형성된 첫 인상이 상세페이지의 설득 구조로 이어지고, 다시 Storefront와 구매 환경까지 동일한 Product Proposition을 전달하도록 구성했습니다.</Body><Body>이 과정에서 Product Planning과 Commerce Execution을 함께 경험하며, 상품기획은 제품 자체를 정의하는 데서 끝나는 것이 아니라 실제 판매 환경까지 연결되어야 한다는 관점을 갖게 되었습니다.</Body></div>
      <p className={s.statement} data-reading-focus>I CONNECTED<br />PRODUCT DECISIONS<br /><em>TO MARKET EXECUTION.</em></p>
    </Chapter>

    <Chapter id="my-scope" label="MY SCOPE" title={<>제품을 정의하고,<br />고객에게 판매 가능한 형태까지 구체화했습니다.</>}>
      <div className={s.scopeGrid}>
        <div><span data-reading-focus>01 / PRODUCT PLANNING</span><p data-reading-focus>제품 후보와 사업 방향을 바탕으로 타깃, 핵심 가치, 차별화 방향과 제품별 Positioning을 구체화했습니다.</p></div>
        <div><span data-reading-focus>02 / BRAND ARCHITECTURE</span><p data-reading-focus>사업 모델에 맞춰 브랜드 구조를 재검토하고, 각 Product가 독립적으로 시장성을 검증할 수 있는 방향으로 구조를 정리했습니다.</p></div>
        <div><span data-reading-focus>03 / PRODUCT COMMUNICATION</span><p data-reading-focus>제품이 가진 특성을 고객이 이해할 수 있는 언어로 변환하고, 패키지와 상세페이지에서 전달해야 할 메시지의 방향을 설계했습니다.</p></div>
        <div><span data-reading-focus>04 / COMMERCE EXECUTION</span><p data-reading-focus>제품 전략을 실제 D2C 환경으로 연결하고, 상세페이지와 Storefront, 구매를 위한 Commerce Infrastructure 구축까지 실행했습니다.</p></div>
      </div>
    </Chapter>

    <Chapter id="strategy-experience" label="STRATEGY INTO EXPERIENCE" title={<>기획한 전략이,<br />고객이 직접 보는 경험으로 이어지도록 만들었습니다.</>}>
      <div className={s.chapterCopy}><Body>Brand Identity와 패키지, 콘텐츠는 독립적인 디자인 산출물이 아니라 제품 전략을 고객에게 전달하기 위한 접점으로 활용했습니다.</Body><Body>앞서 정의한 Positioning과 Product Message가 시각적 인상에서도 유지되도록 방향을 잡고, 이를 실제 판매 콘텐츠와 D2C 환경까지 확장했습니다.</Body></div>
      <figure className={s.brandEvidence}><Image src="/images/projects/harubareun/summary/harubareun-brand-identity.jpg" alt="HARUBAREUN 로고가 적용된 공간 외관 목업" width={3000} height={4000} sizes="(max-width: 760px) calc(100vw - 44px), min(1320px, calc(100vw - 96px))" /><figcaption data-reading-focus>BRAND IDENTITY / STRATEGY INTO EXPERIENCE</figcaption></figure>
    </Chapter>

    <section className={s.closing} aria-labelledby="summary-closing-title">
      <span className={s.label} data-reading-focus>SUMMARY CLOSING</span>
      <h2 id="summary-closing-title" data-reading-focus>I DIDN&apos;T START<br />WITH THE DESIGN.<br /><br />I STARTED WITH<br /><em>THE PRODUCT QUESTION.</em></h2>
      <p className={s.closingKorean} data-reading-focus>디자인보다 먼저,<br />어떤 제품을<br />누구에게<br />어떤 이유로 팔 것인지<br />정의했습니다.</p>
      <div className={s.chapterCopy}><Body>HARUBAREUN을 통해 제품을 만드는 과정에서 브랜드, 콘텐츠, Commerce가 서로 분리된 업무가 아니라는 것을 경험했습니다.</Body><Body>시장 기회를 제품 전략으로 바꾸고, 그 전략을 브랜드와 고객 경험으로 구체화하며, 다시 실제 판매 환경까지 연결하는 전체 과정을 수행했습니다.</Body><Body>이를 통해 아이디어를 정리하는 기획보다, 실제 시장에 도달할 수 있는 구조를 만드는 기획을 지향하게 되었습니다.</Body></div>
      <p className={s.processStatement} data-reading-focus>OPPORTUNITY <em>→</em> DECISION <em>→</em> PRODUCT <em>→</em> MARKET</p>
      <p className={s.signature} data-reading-focus>Product Planning · Brand Architecture · Commerce Execution</p>
    </section>
  </div>;
}
