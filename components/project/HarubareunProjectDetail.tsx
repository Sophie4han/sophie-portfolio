"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { TransitionRuntimeState } from "@/types/transition";
import styles from "./harubareun-project-detail.module.css";

const chapters = [
  ["context", "Context"], ["decision", "Key Decision"], ["making", "Making it Real"],
  ["commerce", "Commerce"], ["launch", "Launch"], ["result", "Result"], ["reflection", "Reflection"],
] as const;
interface HarubareunProjectDetailProps {
  transition?: TransitionRuntimeState;
  onBackToWorld?: () => void;
  onBackToFocus?: () => void;
}

function Chapter({ id, label, title, children }: { id: string; label: string; title: string; children: ReactNode }) {
  return <section id={id} className={styles.chapter} data-chapter aria-labelledby={`${id}-heading`}>
    <header className={styles.chapterHeading}><span className={styles.eyebrow}>{label}</span><h2 id={`${id}-heading`}>{title}</h2></header>
    {children}
  </section>;
}

export function HarubareunProjectDetail({ onBackToWorld, onBackToFocus }: HarubareunProjectDetailProps = {}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState("context");
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sections = [...node.querySelectorAll<HTMLElement>("[data-chapter]")];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.setAttribute("data-seen", "true");
        setActive(entry.target.id);
      }
    }, { rootMargin: "-12% 0px -35% 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
    if (!media.matches) node.dataset.reveal = "true";
    const change = () => { node.dataset.reveal = String(!media.matches); };
    media.addEventListener("change", change);
    return () => { observer.disconnect(); media.removeEventListener("change", change); };
  }, []);
  return <main ref={root} data-embedded={Boolean(onBackToWorld || onBackToFocus)} className={styles.detailScene} aria-labelledby="harubareun-detail-title">
    <nav className={styles.topNav} aria-label="Project navigation"><Link href="/">MOVE ON <span>↗</span></Link><Link href="/#work">← Selected Work</Link>{onBackToFocus && <button onClick={onBackToFocus}>Project overview</button>}{onBackToWorld && <button onClick={onBackToWorld}>World</button>}</nav>
    <header className={styles.hero}>
      <span className={styles.eyebrow}>HARUBAREUN / INVADER SCHOOL · NEW BUSINESS TF</span>
      <h1 id="harubareun-detail-title">From product questions<br />to <em>market-ready.</em></h1>
      <p className={styles.lead}>어떤 제품을, 누구에게, 어떤 이유로 팔 것인가.</p>
      <p>인베이더스쿨에서 기획과 운영 업무를 하던 중, 소수 인원으로 꾸려진 신사업 TF에 합류하게 됐습니다. 건강식품 사업을 처음부터 만들어가는 팀이었고, HARUBAREUN이라는 이름을 정하는 것부터 제품과 브랜드 방향을 잡는 일까지 함께했습니다.</p>
      <p>이후 제품 후보를 실제 판매 가능한 상품으로 구체화하고, 제조사와 생산 일정을 맞추며 판매 채널 세팅까지 이어갔습니다.</p>
      <dl className={styles.facts}><div><dt>PERIOD</dt><dd>2026.06–08</dd></div><div><dt>MY ROLE</dt><dd>Product Planning · Brand Naming<br />Brand Architecture · Commerce</dd></div><div><dt>SCOPE</dt><dd>New Business TF · Health &amp; Wellness<br />4개 제품 · 4개 D2C 자사몰<br />SmartStore · Coupang</dd></div></dl>
      <div className={styles.heroProducts}>{summaryProducts.map(product => <figure key={product.name}><Image src={product.image} alt={product.alt} width={3024} height={4032} sizes="(max-width: 700px) 44vw, 22vw" /><figcaption>{product.name}</figcaption></figure>)}</div>
    </header>
    <nav className={styles.process} aria-label="Case study process">{chapters.map(([id,label],index)=><a key={id} href={`#${id}`} aria-current={active===id?"step":undefined}><small>{String(index+1).padStart(2,"0")}</small>{label}</a>)}</nav>
    <div className={styles.content}>
      <Chapter id="context" label="01 / CONTEXT" title="제품 후보는 있었지만, 고객이 살 이유는 아직 정리되지 않았습니다.">
        <p>시작점은 로고나 패키지 시안이 아니었습니다. 각 후보가 누구에게 필요한지, 이미 있는 선택지와 무엇이 다른지부터 정리해야 했습니다.</p>
        <p>같은 건강식품이어도 원료와 타깃, 제품을 찾는 상황은 달랐습니다. 네 제품에 같은 메시지를 반복하기보다, 고객이 선택할 이유를 각각 정하는 데서 시작했습니다.</p>
        <div className={styles.questions}><div><span>WHO</span><h3>누구를 위한 제품인가</h3><p>타깃의 관심사와 사용 상황</p></div><div><span>WHY</span><h3>왜 이 제품이어야 하는가</h3><p>원료의 특성과 구매 이유</p></div><div><span>HOW</span><h3>어떻게 선택하게 할 것인가</h3><p>제품명부터 실제 구매환경까지</p></div></div>
      </Chapter>
      <Chapter id="decision" label="02 / KEY DECISION" title="하나의 브랜드보다, 제품별 시장성을 먼저 검증하는 구조로.">
        <StrategyDetail />
        <ProductDetail />
      </Chapter>
      <Chapter id="making" label="03 / MAKING IT REAL" title="기획한 제품을 실제로 만들기까지.">
        <p>제품 방향을 정한 뒤 제조사와 계속 소통하면서 실제 제작과 생산 일정까지 함께 챙겼습니다.</p>
        <ol className={styles.makingFlow}><li><span>01 / DEFINE</span><h3>제품 방향 구체화</h3><p>타깃 · 핵심 가치 · 원료 근거 · 제품별 메시지</p></li><li><span>02 / COORDINATE</span><h3>제조사 커뮤니케이션</h3><p>제조사와 제품 제작 관련 소통</p></li><li><span>03 / SCHEDULE</span><h3>생산 일정 조율</h3><p>실제 제품이 만들어지는 일정 조율</p></li></ol>
        <p>제품명과 패키지에서 전달한 내용이 상세페이지와 판매환경에서도 이어지도록 구성했습니다. 아래 사진은 기존 자료에 남아 있는 최종 생산 패키지입니다.</p>
        <div className={styles.packageGrid}>{summaryProducts.map(product=><figure key={product.name}><Image src={product.image} alt={product.alt} width={3024} height={4032} sizes="(max-width: 700px) 90vw, 40vw" /><figcaption>{product.name} / FINAL PACKAGE</figcaption></figure>)}</div>
        <p className={styles.note}>※ 제조사 협의·일정 자료는 미포함이며, 아래에는 최종 패키지 결과물만 담았습니다.</p>
      </Chapter>
      <Chapter id="commerce" label="04 / COMMERCE" title="제품을 설명하는 데서, 구매할 수 있는 환경까지.">
        <p>제품별 D2C 자사몰을 구축하고, SmartStore·Coupang 채널 경험을 함께 쌓았습니다. ※ SmartStore·Coupang 세팅 경험은 포함하되, 현재 보유한 화면 자료는 자사몰·카카오 연동 기준입니다.</p>
        <CommerceDetail />
      </Chapter>
      <Chapter id="launch" label="05 / LAUNCH" title="출시 일정에 맞춰, 고객을 만날 순서를 준비했습니다.">
        <p>마케팅 파트너와 초기 유입 채널, 소재 제작 역할, 비용 구조를 검토했습니다. 아래는 협의와 계획의 기록이며, 광고 집행 성과를 뜻하지 않습니다.</p>
        <GoToMarketDetail />
      </Chapter>
      <Chapter id="result" label="06 / RESULT" title="4개 제품과 판매환경으로 남은 결과.">
        <p>제품마다 다른 구매 이유를 정하고, 이를 패키지·상세페이지·자사몰로 구현했습니다. 확인 가능한 결과는 4개 제품의 기획·제작 산출물과 4개 D2C 판매환경입니다. 매출·전환 데이터는 보유하지 않아 결과에서 제외했습니다.</p>
        <FinalOverviewDetail />
        <figure className={styles.brandEvidence}><Image src="/images/projects/harubareun/summary/harubareun-brand-identity.jpg" alt="HARUBAREUN 브랜드 아이덴티티를 적용한 외관 목업" width={3000} height={4000} sizes="(max-width: 700px) 90vw, 700px" /><figcaption>BRAND IDENTITY / 외관 적용 목업</figcaption></figure>
      </Chapter>
      <Chapter id="reflection" label="07 / REFLECTION" title="상품기획은 판매환경에 닿을 때까지 이어졌습니다.">
        <p>처음 정한 브랜드 구조를 유지하는 것보다, 달라진 사업 방향에 맞춰 다시 판단하는 일이 중요했습니다. 제품별로 시장성을 확인하려는 사업 방식에 맞춰 브랜드 구조도 바꿨습니다.</p>
        <p>원료의 특성을 정리하는 일과 고객에게 설명하는 일은 달랐습니다. 원료 정보와 완제품의 효능을 구분하면서, 확인할 수 있는 내용을 구매 이유로 풀어내는 기준을 배웠습니다.</p>
        <p>제품 기획, 제조사 소통, 콘텐츠, 판매환경을 함께 다루면서 앞 단계의 결정이 뒤 단계에 어떤 영향을 주는지 경험했습니다. 앞으로도 기획안을 만드는 데서 끝내지 않고, 실제로 팔 수 있는 상태까지 챙기는 쪽으로 일하고 싶습니다.</p>
      </Chapter>
    </div>
    <footer className={styles.marqueeFooter} aria-label="Thanks for reading!">
      <span className={styles.visuallyHidden}>Thanks for reading!</span>
      <div className={styles.marqueeTrack} aria-hidden="true">
        {[0, 1].map(group => <div className={styles.marqueeGroup} key={group}>
          {[0, 1, 2, 3].map(item => <span key={item}>Thanks for <em>reading!</em><b>♥</b></span>)}
        </div>)}
      </div>
    </footer>
  </main>;
}

function StrategyDetail() {
    return (
        <section className={styles.strategyDetail} aria-labelledby="strategy-detail-title">
            <div className={styles.strategyHeading}>
                <span className={styles.eyebrow}>01</span>
                <h3 id="strategy-detail-title">전략과 판단</h3>
            </div>
            <span className={styles.strategyLabel}>PROJECT CONTEXT</span>
            <p className={`${styles.strategyContext} ${styles.bodyCopy} ${styles.readableOnVisual}`} data-reading-focus>
                이미 후보로 정해진 제품을 그대로 내놓기보다, 누구에게 어떤 이유로 팔지부터 다시 정리했습니다. 이후 제품별 메시지와 브랜드, 판매환경까지 하나씩 맞춰갔습니다.
            </p>
            <div className={styles.strategyQuestion} data-reading-focus>
                어떤 제품을 사업화하고,<br />무엇을 다르게 만들며,<br />그 차이를 고객에게 어떻게 전달할 것인가
            </div>
            <div className={styles.decisionBlock}>
                <div data-reading-focus>
                    <span className={styles.eyebrow}>KEY DECISION 01</span>
                    <h3>Business Model 변화에 맞춰 Brand Architecture를 변경</h3>
                    <p className={`${styles.decisionContext} ${styles.bodyCopy} ${styles.readableOnVisual}`}>
                        초기에는 HARUBAREUN을 중심으로 Master Brand 기반 확장 구조를 설계했습니다.
                        이후 사업전략이 SKU별 시장성을 검증하고 성과에 따라 선택적으로 확장하는 방식으로 변경되면서 기존 Brand Architecture를 재검토했습니다.
                    </p>
                </div>

                <section className={styles.architectureStage} aria-labelledby="architecture-before-title" data-reading-focus>
                    <span className={styles.architectureLabel}>BEFORE</span>
                    <h3 id="architecture-before-title">ONE MASTER BRAND <span>→</span> MULTIPLE SUB-PRODUCTS</h3>
                    <div className={styles.brandHierarchy} aria-label="HARUBAREUN에서 Na:Daum과 네 개의 하위 제품으로 이어지는 계층 구조">
                        <div className={styles.hierarchyNode}>HARUBAREUN</div>
                        <span className={styles.hierarchyConnector} aria-hidden="true">↓</span>
                        <div className={styles.hierarchyNode}>Na:Daum</div>
                        <span className={styles.hierarchyConnector} aria-hidden="true">↓</span>
                        <div className={styles.subProductRow}>
                            <span>가벼:움</span>
                            <span>고움</span>
                            <span>채:움</span>
                            <span>비:움</span>
                        </div>
                    </div>
                </section>

                <div className={styles.businessModelShift} data-reading-focus>
                    <span>BUSINESS MODEL SHIFT</span>
                    <strong>SKU별 시장성 검증 <b>→</b> 성과에 따른 선택적 확장</strong>
                </div>

                <section className={styles.architectureStage} aria-labelledby="architecture-after-title" data-reading-focus>
                    <span className={styles.architectureLabel}>AFTER</span>
                    <h3 id="architecture-after-title">INDEPENDENT PRODUCT BRANDS</h3>
                    <div className={styles.independentBrands}>
                        <div><strong>SORI BLACK</strong><span>서리태</span></div>
                        <div><strong>BABI CUT</strong><span>알파CD</span></div>
                        <div><strong>LEMONDE OLI</strong><span>레몬 + 올리브잎</span></div>
                        <div><strong>RECELLVINE</strong><span>NMN 리포좀</span></div>
                    </div>
                </section>

                <p className={styles.decisionStatement} data-reading-focus>
                    “브랜드 구조를 고수하기보다 변화한 Business Model에 맞춰 Product Architecture를 재구성했습니다.”
                </p>
            </div>
        </section>
    );
}

function ProductDetail() {
    return (
        <section className={styles.productDetail} aria-labelledby="product-detail-title">
            <div className={styles.productHeading} data-reading-focus>
                <span className={styles.eyebrow}>PRODUCT DEFINITION</span>
                <h3 id="product-detail-title">Evidence를 Customer Value로 전환</h3>
            </div>
            <p className={styles.productQuestion} data-reading-focus>
                “제품이 가진 근거를, 고객이 선택할 이유로 어떻게 바꿀 것인가”
            </p>

            <section className={styles.corePrincipleSection} aria-labelledby="core-principle-title" data-reading-focus>
                <span className={styles.eyebrow}>CORE PRINCIPLE</span>
                <h3 id="core-principle-title" className={styles.visuallyHidden}>Evidence에서 Commerce Communication으로 전환하는 원칙</h3>
                <ol className={styles.principleFlow} aria-label="Evidence에서 Commerce Communication으로 이어지는 흐름">
                    {[
                        "Evidence",
                        "USP",
                        "Customer Benefit",
                        "Commerce Communication",
                    ].map((step, index) => (
                        <li key={step}>
                            <span>{step}</span>
                            {index < 3 && <b aria-hidden="true">↓</b>}
                        </li>
                    ))}
                </ol>
                <p className={styles.corePrinciple}>Evidence → USP → Customer Language</p>
            </section>

            <ProductEvidenceCase
                number="01"
                name="RECELLVINE"
                imageSrc="/images/projects/harubareun/product-definition/recellvine-usp.png"
                imageWidth={2174}
                imageHeight={1288}
                imageAlt="RECELLVINE 제품 정보, 원료 구성, 효능과 USP가 정리된 실제 기획 자료"
                evidence={[
                    "NMN 70% 리포좀",
                    "비타민 B군(B6·B12·B3·B5), 레몬과즙, 비타민 C, 자일리톨",
                ]}
                usp={[
                    "리포좀 기술로 감싼 NMN",
                    "흡수 전 위산에 분해되기 쉬운 NMN의 약점을 리포좀 공법으로 보완",
                    "효능 단정보다 기술 설명을 중심으로 표현 리스크를 줄이는 방향",
                ]}
            />

            <ProductEvidenceCase
                number="02"
                name="SEORI BLACK"
                imageSrc="/images/projects/harubareun/product-definition/seori-black-usp.png"
                imageWidth={2224}
                imageHeight={1280}
                imageAlt="SEORI BLACK 제품 정보, 원료 구성, 효능과 USP가 정리된 실제 기획 자료"
                evidence={[
                    "볶은발효서리태분말 35% · 검정콩추출분말 10%",
                    "L-시스테인염산염 · 초저분자 피쉬콜라겐 펩타이드 · 밀크칼슘",
                ]}
                usp={[
                    "발효 후 검정콩 성분과 항산화 활성 증가에 주목",
                    "두피 혈액 순환과 모발 강화 관점으로 검정콩추출분말을 구성",
                    "모발 구성 원료와 영양 전달·합성을 돕는 부원료를 함께 설계",
                ]}
            />

            <section className={styles.namingSection} aria-labelledby="naming-concept-title" data-reading-focus>
                <span className={styles.eyebrow}>NAMING &amp; CONCEPT</span>
                <h3 id="naming-concept-title" className={styles.visuallyHidden}>BABI CUT과 LEMONDE OLI 네이밍 및 콘셉트</h3>
                <div className={styles.namingGrid}>
                    <article>
                        <h3>BABI CUT</h3>
                        <span>Alpha-CD · Diet</span>
                        <p className={`${styles.bodyCopy} ${styles.readableOnVisual}`}>날씬한 이미지를 연상시키는 ‘Barbie’와 ‘밥을 Cut한다’는 직관적인 의미를 결합해, 다이어트 제품의 성격이 빠르게 인지되는 이름으로 설계했습니다.</p>
                    </article>
                    <article>
                        <h3>LEMONDE OLI</h3>
                        <span>Lemon · Olive Leaf</span>
                        <p className={`${styles.bodyCopy} ${styles.readableOnVisual}`}>핵심 원료인 Lemon + Olive를 기반으로 하되, 지중해의 밝고 건강한 라이프스타일이 연상되는 어감으로 조합해 원료와 브랜드 무드를 함께 전달하도록 설계했습니다.</p>
                    </article>
                </div>
            </section>

            <section className={styles.communicationRule} aria-labelledby="communication-rule-title" data-reading-focus>
                <span className={styles.eyebrow}>COMMUNICATION RULE</span>
                <h3 id="communication-rule-title">Specification과 효능을 구분해, 확인 가능한 근거를 고객의 언어로 전환</h3>
                <p className={`${styles.bodyCopy} ${styles.readableOnVisual}`}>원료 Specification과 완제품 효능을 구분하고, 일반식품의 표현 가능 범위 안에서 확인 가능한 근거를 Customer Benefit과 Commerce Message로 전환했습니다.</p>
            </section>
        </section>
    );
}

function ProductEvidenceCase({
    number,
    name,
    imageSrc,
    imageWidth,
    imageHeight,
    imageAlt,
    evidence,
    usp,
}: {
    number: string;
    name: string;
    imageSrc: string;
    imageWidth: number;
    imageHeight: number;
    imageAlt: string;
    evidence: string[];
    usp: string[];
}) {
    return (
        <article className={styles.productCase} data-reading-focus>
            <header className={styles.productCaseHeading}>
                <span className={styles.eyebrow}>PRODUCT CASE {number}</span>
                <h3>{name}</h3>
            </header>

            <figure className={styles.sourceEvidence}>
                <figcaption>ORIGINAL PLANNING / USP DOCUMENT</figcaption>
                <Image src={imageSrc} alt={imageAlt} width={imageWidth} height={imageHeight} sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1199px) 55vw, 700px" />
            </figure>

            <div className={styles.caseAnalysis}>
                <div>
                    <span>EVIDENCE</span>
                    <ul>{evidence.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                    <span>USP DIRECTION</span>
                    <ul>{usp.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
            </div>

            <figure className={styles.uspDetail}>
                <figcaption>USP DETAIL / SAME SOURCE</figcaption>
                <div className={styles.uspCrop}>
                    <Image className={styles.uspCropImage} src={imageSrc} alt={`${name} 기획 자료의 USP 핵심 영역 확대`} width={imageWidth} height={imageHeight} sizes="(max-width: 760px) calc(100vw - 44px), 1200px" loading="eager" />
                </div>
            </figure>
        </article>
    );
}

const storefronts = [
    {
        name: "LEMONDE OLI",
        positioning: "Mediterranean Daily Routine",
        image: "/images/projects/harubareun/commerce/lemonde-oli-storefront.png",
        width: 2880,
        height: 7048,
    },
    {
        name: "RECELLVINE",
        positioning: "NMN · Daily Aging Care",
        image: "/images/projects/harubareun/commerce/recellvine-storefront.png",
        width: 2880,
        height: 7046,
    },
    {
        name: "BABI CUT",
        positioning: "Alpha-CD · Diet Routine",
        image: "/images/projects/harubareun/commerce/babi-cut-storefront.png",
        width: 2880,
        height: 8585,
    },
    {
        name: "SORI BLACK",
        positioning: "Black Soybean · Hair Routine",
        image: "/images/projects/harubareun/commerce/sori-black-storefront.png",
        width: 2880,
        height: 5896,
    },
] as const;

function CommerceDetail() {
    return (
        <section className={styles.commerceDetail} aria-labelledby="commerce-detail-title">

            <div className={styles.commerceHeading} data-reading-focus>
                <span className={styles.eyebrow}>COMMERCE EXECUTION</span>
                <h3 id="commerce-detail-title">판매환경 구축</h3>
            </div>
            <p className={`${styles.commerceIntro} ${styles.bodyCopy} ${styles.readableOnVisual}`} data-reading-focus>
                제품별 포지셔닝을 실제 구매 경험으로 연결하기 위해
                4개 D2C 자사몰과 Commerce Infrastructure를 구축했습니다.
            </p>

            <section className={styles.storefrontSection} aria-labelledby="storefront-title" data-reading-focus>
                <div className={styles.commerceSectionHeading}>
                    <span className={styles.eyebrow}>01 / D2C STOREFRONT</span>
                    <h3 id="storefront-title">4 PRODUCTS · 4 D2C STOREFRONTS</h3>
                </div>
                <div className={styles.storefrontGrid} tabIndex={0} role="region" aria-label="4개 자사몰 화면, 좌우로 스크롤">
                    {storefronts.map((storefront) => (
                        <figure className={styles.storefrontEvidence} key={storefront.name}>
                            <div className={styles.storefrontCrop}>
                                <Image
                                    src={storefront.image}
                                    alt={`${storefront.name} D2C 자사몰의 Hero와 주요 제품 및 USP 영역`}
                                    width={storefront.width}
                                    height={storefront.height}
                                    sizes="(max-width: 760px) 50vw, 25vw"
                                    loading="eager"
                                />
                            </div>
                            <figcaption>
                                <strong>{storefront.name}</strong>
                                <span>{storefront.positioning}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
                <p className={`${styles.storefrontStatement} ${styles.bodyCopy} ${styles.readableOnVisual}`}>
                    제품별 Positioning과 Visual Direction을
                    실제 구매 가능한 D2C Storefront까지 연결했습니다.
                </p>
            </section>

            <section className={styles.infrastructureSection} aria-labelledby="infrastructure-title" data-reading-focus>
                <div className={styles.commerceSectionHeading}>
                    <span className={styles.eyebrow}>02 / COMMERCE INFRASTRUCTURE</span>
                    <h3 id="infrastructure-title" className={styles.visuallyHidden}>Commerce Infrastructure 구축 Evidence</h3>
                </div>
                <div className={styles.infrastructureGrid}>
                    <article>
                        <div className={`${styles.infrastructureMedia} ${styles.loginMedia}`}>
                            <Image
                                src="/images/projects/harubareun/commerce/kakao-social-login.png"
                                alt="카카오 1초 로그인 버튼이 적용된 모바일 자사몰 로그인 화면"
                                width={766}
                                height={1272}
                                sizes="(max-width: 760px) calc(100vw - 44px), 440px"
                                loading="eager"
                            />
                        </div>
                        <span className={styles.evidenceRole}>KAKAO SOCIAL LOGIN</span>
                        <h3>Developer Collaboration</h3>
                        <p className={`${styles.bodyCopy} ${styles.readableOnVisual}`}>Kakao Developers 설정 및 개발 협업을 통해 자사몰 간편 로그인 환경을 구축했습니다.</p>
                    </article>
                    <article>
                        <div className={`${styles.infrastructureMedia} ${styles.channelMedia}`}>
                            <Image
                                src="/images/projects/harubareun/commerce/cafe24-kakao-channel.png"
                                alt="카카오톡 채널 @바비컷의 비즈니스 인증 및 정상 연결 상태가 표시된 Cafe24 관리자 화면"
                                width={2870}
                                height={1226}
                                sizes="(max-width: 760px) calc(100vw - 44px), 440px"
                                loading="eager"
                            />
                        </div>
                        <span className={styles.evidenceRole}>KAKAO CHANNEL · ALIMTALK</span>
                        <h3>Cafe24 Integration</h3>
                        <p className={`${styles.bodyCopy} ${styles.readableOnVisual}`}>Cafe24와 Kakao Channel을 연결하고 구매 플로우 기반 메시지 발송 환경을 설정했습니다.</p>
                    </article>
                </div>
            </section>

            <section className={styles.commerceNextStep} aria-labelledby="commerce-next-step-title" data-reading-focus>
                <span className={styles.eyebrow}>03 / NEXT STEP</span>
                <h3 id="commerce-next-step-title">PLANNED</h3>
                <p>외부 CRM 솔루션을 활용한<br />고객 여정별 메시지 자동화 확장 검토</p>
            </section>
        </section>
    );
}

function GoToMarketDetail() {
    return (
        <section className={styles.goToMarketDetail} aria-labelledby="go-to-market-title">

            <header className={styles.goToMarketHeading} data-reading-focus>
                <span className={styles.eyebrow}>GO-TO-MARKET</span>
                <h3 id="go-to-market-title">제품 출시 이후,<br />고객에게 도달하는 방법까지 설계</h3>
            </header>
            <p className={`${styles.goToMarketIntro} ${styles.bodyCopy} ${styles.readableOnVisual}`} data-reading-focus>
                제품별 타깃과 판매 구조를 기반으로 초기 고객 유입을 만들기 위한
                마케팅 채널과 운영 방향을 검토했습니다.
            </p>

            <section className={styles.goToMarketSection} aria-labelledby="go-to-market-strategy" data-reading-focus>
                <span className={styles.eyebrow}>STRATEGY</span>
                <h3 id="go-to-market-strategy" className={styles.visuallyHidden}>초기 고객 유입 채널 전략</h3>
                <p className={`${styles.goToMarketBody} ${styles.bodyCopy} ${styles.readableOnVisual}`}>
                    초기 유입과 Creative Test를 위한 핵심 채널로 Meta를 설정하고,
                    블로그 시딩을 통한 검색 노출 확보, 인플루언서 시딩을 통한 제품 경험 확산,
                    YouTube PPL을 통한 장기적인 콘텐츠 노출을 연결하는 방향으로
                    채널별 역할을 구분했습니다.
                </p>
                <figure className={styles.strategyEvidence}>
                    <div>
                        <Image
                            src="/images/projects/harubareun/go-to-market/marketing-strategy.png"
                            alt="Meta 광고, YouTube PPL, 블로그 및 인플루언서 시딩의 역할을 정리한 마케팅 채널 전략 회의 기록"
                            width={954}
                            height={1232}
                            sizes="(max-width: 760px) calc(100vw - 44px), 1200px"
                        />
                    </div>
                    <figcaption>MARKETING CHANNEL STRATEGY / MEETING EVIDENCE</figcaption>
                </figure>
            </section>

            <section className={styles.goToMarketSection} aria-labelledby="partner-alignment-title" data-reading-focus>
                <span className={styles.eyebrow}>PARTNER ALIGNMENT</span>
                <h3 id="partner-alignment-title" className={styles.visuallyHidden}>외부 마케팅 파트너 협의</h3>
                <div className={`${styles.partnerCopy} ${styles.bodyCopy} ${styles.readableOnVisual}`}>
                    <p>이후 외부 마케팅 파트너와의 미팅을 통해 Meta 중심의 퍼포먼스 운영 구조와 바이럴·시딩 전략, 소재 제작 역할과 비용 구조를 구체적으로 검토했습니다.</p>
                    <p>초기 Meta 집행 이후에는 성과와 지표에 따라 Google·GFA 등으로 매체를 확장하는 방향까지 논의했습니다.</p>
                </div>
                <div className={styles.partnerEvidenceGrid}>
                    <figure>
                        <div><Image src="/images/projects/harubareun/go-to-market/partner-media-strategy.png" alt="Meta 우선 집행 후 성과에 따라 Google과 GFA로 확장하는 운영 매체 전략" width={982} height={156} sizes="(max-width: 760px) calc(100vw - 44px), 600px" /></div>
                        <figcaption>OPERATING MEDIA STRATEGY</figcaption>
                    </figure>
                    <figure>
                        <div><Image src="/images/projects/harubareun/go-to-market/partner-next-actions.png" alt="외부 마케팅 파트너와 자사의 향후 일정 및 Action Item" width={786} height={422} sizes="(max-width: 760px) calc(100vw - 44px), 600px" /></div>
                        <figcaption>NEXT ACTION ALIGNMENT</figcaption>
                    </figure>
                </div>
            </section>

            <section className={styles.executionPlan} aria-labelledby="execution-plan-title" data-reading-focus>
                <span className={styles.eyebrow}>EXECUTION PLAN</span>
                <h3 id="execution-plan-title" className={styles.visuallyHidden}>Go-to-Market 실행 순서</h3>
                <ol aria-label="Meta에서 바이럴 및 시딩을 거쳐 채널 확장으로 이어지는 실행 계획">
                    <li>META</li>
                    <li>VIRAL / SEEDING</li>
                    <li>CHANNEL EXPANSION</li>
                </ol>
                <p className={`${styles.bodyCopy} ${styles.readableOnVisual}`}>채널 전략과 실행 구조를 구체화하고 외부 파트너 협의까지 진행했으며, Meta 광고 · Influencer / Blog Seeding · YouTube PPL은 제품 출시 일정에 맞춰 순차적으로 이행할 예정이었습니다.</p>
            </section>

            <blockquote className={styles.goToMarketPrinciple} data-reading-focus>
                <span className={styles.eyebrow}>GO-TO-MARKET PRINCIPLE</span>
                <p>“제품을 출시하는 것에서 끝내지 않고,<br />초기 유입부터 검색·콘텐츠 확산까지 이어지는<br />시장 진입 구조를 설계했습니다.”</p>
            </blockquote>
        </section>
    );
}

const finalProducts = [
    {
        number: "01",
        name: "SORI BLACK",
        koreanName: "서리블랙",
        descriptor: "PREMIUM BLACK SOYBEAN FORMULA",
        image: "/images/projects/harubareun/final-overview/sori-black.png",
        width: 1565,
        height: 1005,
        alt: "검은콩 원료와 서리블랙 제품 패키지를 함께 연출한 대표 이미지",
        paragraphs: [
            <>서리태라는 익숙한 원료를 단순한 전통 식품이 아닌 <strong>프리미엄 데일리 케어 제품</strong>으로 재해석했습니다.</>,
            <>블랙을 중심으로 절제된 패키지와 원료 비주얼을 구축하고, 기존 서리태 제품에서 흔히 보이는 전통적 이미지를 줄여 <strong>원료의 신뢰감과 현대적인 프리미엄 인상</strong>이 함께 전달되도록 차별화했습니다.</>,
        ],
    },
    {
        number: "02",
        name: "LEMONDE OLI",
        koreanName: "레몽드올리",
        descriptor: "LEMON × OLIVE DAILY FORMULA",
        image: "/images/projects/harubareun/final-overview/lemonde-oli.png",
        width: 1536,
        height: 1024,
        alt: "레몬과 올리브 원료 사이에 배치된 레몽드올리 제품 대표 이미지",
        paragraphs: [
            <>레몬과 올리브라는 서로 다른 두 원료의 조합을 제품의 가장 직관적인 브랜드 자산으로 설정했습니다.</>,
            <>옐로와 딥그린의 강한 컬러 대비와 풍부한 원료 이미지를 활용해 건강식품 특유의 기능 중심 표현에서 벗어나 <strong>신선하고 감각적인 Mediterranean mood</strong>로 제품 경험을 차별화했습니다.</>,
        ],
    },
    {
        number: "03",
        name: "BABI CUT",
        koreanName: "바비컷",
        descriptor: "DAILY DIET ROUTINE",
        image: "/images/projects/harubareun/final-overview/babi-cut.png",
        width: 1073,
        height: 1466,
        alt: "식사와 운동 루틴 속에 배치된 바비컷 제품 대표 이미지",
        paragraphs: [
            <>다이어트를 극단적인 제한이 아니라 <strong>일상에서 지속할 수 있는 하나의 루틴</strong>으로 정의했습니다.</>,
            <>운동, 식사, 수분 섭취 등 실제 소비자의 생활 장면 안에 제품을 배치해 기능만 강조하는 기존 다이어트 제품과 거리를 두고, <strong>가볍고 친근한 여성 라이프스타일 브랜드</strong>로 차별화했습니다.</>,
        ],
    },
    {
        number: "04",
        name: "RECELLVINE",
        koreanName: "리셀바인",
        descriptor: "NMN DAILY FORMULA",
        image: "/images/projects/harubareun/final-overview/recellvine.png",
        width: 1214,
        height: 1295,
        alt: "화이트와 아쿠아 색상의 정제된 공간에 배치된 리셀바인 제품 대표 이미지",
        paragraphs: [
            <>NMN이라는 다소 어렵고 기술적인 소재를 소비자가 부담 없이 접근할 수 있는 <strong>클린 데일리 케어</strong>로 풀어냈습니다.</>,
            <>화이트와 아쿠아 컬러, 투명한 소재와 정제된 공간감을 활용해 과도한 의학적·실험실 이미지를 피하면서도 <strong>성분의 전문성과 현대적인 신뢰감</strong>이 유지되도록 차별화했습니다.</>,
        ],
    },
] as const;

const summaryProducts = ([
    ["RECELLVINE", "recellvine"],
    ["BABI CUT", "babi-cut"],
    ["LEMONDE OLI", "lemonde-oli"],
    ["SORI BLACK", "sori-black"],
] as const).map(([name, fileName]) => {
    const product = finalProducts.find((item) => item.name === name);
    const storefront = storefronts.find((item) => item.name === name);
    if (!product || !storefront) throw new Error(`Missing HARUBAREUN product evidence: ${name}`);
    return {
        name,
        image: `/images/projects/harubareun/summary/${fileName}.jpeg`,
        alt: `${name} 최종 생산 패키지`,
        positioning: storefront.positioning,
        customerValue: product.paragraphs[0],
        communication: product.paragraphs[1],
    };
});

function FinalOverviewDetail() {
    return (
        <section className={styles.finalOverview} aria-labelledby="final-overview-title">
            <header className={styles.finalOverviewHeading} data-reading-focus>
                <span className={styles.eyebrow}>FINAL OVERVIEW</span>
                <h3 id="final-overview-title">하나의 기준으로 묶고,<br />제품마다 다른 이유를 설계했습니다.</h3>
                <p className={`${styles.bodyCopy} ${styles.readableOnVisual}`}>동일한 카테고리 안에서도 타깃과 제품 특성에 따라 포지셔닝, 비주얼 언어, 커뮤니케이션 방향을 각각 다르게 설계했습니다.</p>
            </header>

            <div className={styles.finalProductList}>
                {finalProducts.map((product, index) => (
                    <article className={styles.finalProduct} data-reverse={index % 2 === 1} data-reading-focus key={product.name}>
                        <figure className={styles.finalProductImage}>
                            <Image src={product.image} alt={product.alt} width={product.width} height={product.height} sizes="(max-width: 760px) calc(100vw - 44px), 760px" />
                        </figure>
                        <div className={styles.finalProductCopy}>
                            <span className={styles.eyebrow}>{product.number}</span>
                            <h3>{product.name} <small>/ {product.koreanName}</small></h3>
                            <div className={styles.finalProductDescriptor}>{product.descriptor}</div>
                            <div className={`${styles.finalProductParagraphs} ${styles.readableOnVisual}`}>
                                {product.paragraphs.map((paragraph, paragraphIndex) => (
                                    <p className={styles.bodyCopy} key={paragraphIndex}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
