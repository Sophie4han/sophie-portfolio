"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { loadDetailSection, saveDetailSection } from "@/lib/scene-persistence";
import type { TransitionRuntimeState } from "@/types/transition";
import { ProjectDetailNavigation } from "./ProjectDetailNavigation";
import styles from "./harubareun-project-detail.module.css";

type SectionId = "strategy" | "product" | "launch";

const sections: Array<{
    id: SectionId;
    number: string;
    title: string;
    summary: string;
    contribution: "Led" | "Executed" | "Collaborated";
    detail: string;
}> = [
        {
            id: "strategy",
            number: "01",
            title: "전략과 판단",
            summary: "사업 기회와 브랜드 구조",
            contribution: "Led",
            detail: "시장성이 확인된 제품 후보를 차별화된 Consumer Product로 구체화하기 위한 사업 기회와 브랜드 구조를 정리했습니다.",
        },
        {
            id: "product",
            number: "02",
            title: "제품 구체화",
            summary: "Evidence에서 고객가치와 제품으로",
            contribution: "Executed",
            detail: "확인된 Evidence를 고객가치와 제품 방향으로 연결하고, 제품 전략으로 구체화했습니다.",
        },
        {
            id: "launch",
            number: "03",
            title: "출시 실행",
            summary: "제품 전략에서 실제 판매환경까지",
            contribution: "Collaborated",
            detail: "제품 전략부터 D2C 판매환경까지 연결해 Product에서 Sales-ready 단계로 실행했습니다.",
        },
];

const sectionIds = sections.map((section) => section.id);

interface HarubareunProjectDetailProps {
    transition: TransitionRuntimeState;
    onBackToWorld: () => void;
    onBackToFocus: () => void;
}

export function HarubareunProjectDetail({
    transition,
    onBackToWorld,
    onBackToFocus,
}: HarubareunProjectDetailProps) {
    const [activeSection, setActiveSection] = useState<SectionId | null>(() =>
        loadDetailSection("harubareun", sectionIds),
    );
    const detailSceneRef = useRef<HTMLElement>(null);
    const activeDetail = sections.find((section) => section.id === activeSection);
    const projectImages: string[] = [];

    const selectSection = (section: SectionId | null) => {
        setActiveSection(section);
        saveDetailSection("harubareun", section);
    };

    useEffect(() => {
        const scene = detailSceneRef.current;
        if (!scene) return;

        const readingBlocks = scene.querySelectorAll<HTMLElement>("[data-reading-focus]");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle(styles.isReading, entry.isIntersecting);
                });
            },
            { rootMargin: "-60% 0px -30% 0px", threshold: 0 },
        );

        readingBlocks.forEach((block) => observer.observe(block));
        return () => observer.disconnect();
    }, [activeSection]);

    return (
        <main
            ref={detailSceneRef}
            className={styles.detailScene}
            data-transition-phase={transition.phase}
            aria-labelledby="harubareun-detail-title"
        >
            <div className={styles.atmosphere} aria-hidden="true">
                <Image
                    src="/images/pixel/world/shared/world-background-floating-v02.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className={styles.atmosphereBackground}
                />
                <div className={styles.atmosphereIslandWrap}>
                    <Image
                        src="/images/pixel/world/islands/harubareun/island-harubareun-base.png"
                        alt=""
                        width={1920}
                        height={1080}
                        priority
                        sizes="min(72vw, 1080px)"
                        className={styles.atmosphereIsland}
                    />
                </div>
            </div>

            <div className={styles.islandHotspots} aria-label="Explore HARUBAREUN island sections">
                {sections.map((section) => (
                    <button
                        type="button"
                        key={section.id}
                        className={`${styles.islandHotspot} ${styles[`islandHotspot${section.number}`]}`}
                        data-active={activeSection === section.id}
                        aria-label={`${section.number} ${section.title}`}
                        onClick={() => selectSection(section.id)}
                    >
                        <span className={styles.hotspotLabel} aria-hidden="true">
                            <strong>{section.number}</strong>
                            <span>{section.title}</span>
                        </span>
                    </button>
                ))}
            </div>

            <ProjectDetailNavigation
                projectName="HARUBAREUN"
                disabled={transition.phase !== "idle"}
                onBackToFocus={onBackToFocus}
                onBackToWorld={onBackToWorld}
            />

            <div className={styles.detailContent}>
                {activeSection === "strategy" ? (
                    <StrategyDetail onBack={() => selectSection(null)} />
                ) : activeSection === "product" ? (
                    <ProductDetail onBack={() => selectSection(null)} />
                ) : activeSection === "launch" ? (
                    <LaunchDetail onBack={() => selectSection(null)} />
                ) : (
                    <>
                        <div className={styles.eyebrow}>01 / BUILD</div>
                        <h1 id="harubareun-detail-title">HARUBAREUN</h1>
                        <p className={styles.lead} data-reading-focus>From Product Opportunity to Launch-ready</p>
                        <p className={styles.introduction} data-reading-focus>
                            시장성이 확인된 제품 후보를 차별화된 Consumer Product로 구체화하고,
                            제품 전략부터 D2C 판매환경까지 구축했습니다.
                        </p>

                        <dl className={styles.projectFacts} data-reading-focus>
                            <div><dt>기간</dt><dd>2026.06–08</dd></div>
                            <div><dt>역할</dt><dd>New Business TF<br />Product Planning &amp; Commerce Execution</dd></div>
                            <div><dt>범위</dt><dd>4 Consumer Products<br />Product → Sales-ready</dd></div>
                        </dl>

                        <section className={styles.summaryEvidence} aria-label="HARUBAREUN project evidence">
                            <figure className={styles.brandIdentity}>
                                <figcaption className={styles.evidenceLabel}>BRAND IDENTITY</figcaption>
                                <div className={styles.brandIdentityFrame}>
                                    <Image
                                        src="/images/projects/harubareun/summary/harubareun-brand-identity.jpg"
                                        alt="HARUBAREUN 로고가 적용된 공간 외관 목업"
                                        width={3000}
                                        height={4000}
                                        sizes="(max-width: 760px) calc(100vw - 44px), min(1320px, calc(100vw - 96px))"
                                        className={styles.brandIdentityImage}
                                    />
                                </div>
                            </figure>

                            <section className={styles.finalProduction} aria-labelledby="final-production-title">
                                <div className={styles.productionHeading} data-reading-focus>
                                    <div>
                                        <h2 id="final-production-title" className={styles.evidenceLabel}>FINAL PRODUCTION</h2>
                                        <p className={styles.evidenceSubLabel}>4 CONSUMER PRODUCTS</p>
                                    </div>
                                    <p className={styles.productionCopy}>
                                        브랜드 전략과 제품별 포지셔닝을 실제 패키지와 판매 준비 단계까지 연결했습니다.
                                    </p>
                                </div>
                                <div className={styles.productEvidenceGrid}>
                                    {[
                                        ["recellvine", "Recellvine 최종 생산 패키지"],
                                        ["babi-cut", "BABI CUT 최종 생산 패키지"],
                                        ["lemonde-oli", "LEMONDE OLI 최종 생산 패키지"],
                                        ["sori-black", "SORI BLACK 최종 생산 패키지"],
                                    ].map(([fileName, alt]) => (
                                        <div className={styles.productEvidenceCard} key={fileName}>
                                            <Image
                                                className={fileName === "sori-black" ? styles.soriBlackImage : styles.productionImage}
                                                src={`/images/projects/harubareun/summary/${fileName}.jpeg`}
                                                alt={alt}
                                                width={3024}
                                                height={4032}
                                                sizes="(max-width: 760px) calc((100vw - 56px) / 2), calc((min(1320px, 100vw - 96px) - 36px) / 4)"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </section>

                        <SectionNavigation activeSection={activeSection} onSelect={selectSection} />

                        {activeDetail && (
                            <section className={styles.detailReveal} aria-live="polite" aria-labelledby={`detail-${activeDetail.id}`}>
                                <div className={styles.detailRevealHeading}>
                                    <span>{activeDetail.number}</span>
                                    <h2 id={`detail-${activeDetail.id}`}>{activeDetail.title}</h2>
                                </div>
                                <p>{activeDetail.detail}</p>
                                <span className={styles.contribution}>{activeDetail.contribution}</span>
                                {projectImages.length > 0 && (
                                    <div className={styles.evidenceGallery}>
                                        {projectImages.map((src) => <Image key={src} src={src} alt="" width={1600} height={900} />)}
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </div>

        </main>
    );
}

function SectionNavigation({
    activeSection,
    onSelect,
}: {
    activeSection: SectionId | null;
    onSelect: (section: SectionId) => void;
}) {
    return (
        <div className={styles.exploration} aria-label="HARUBAREUN detailed sections" data-reading-focus>
            <div className={styles.explorationHeader}>EXPLORE THE PROJECT</div>
            <div className={styles.sectionList}>
                {sections.map((section) => (
                    <button type="button" key={section.id} className={styles.sectionItem} data-active={activeSection === section.id} onClick={() => onSelect(section.id)}>
                        <span className={styles.sectionNumber}>{section.number}</span>
                        <span className={styles.sectionCopy}><strong>{section.title}</strong><span>{section.summary}</span></span>
                        <span className={styles.sectionArrow} aria-hidden="true">↗</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function StrategyDetail({ onBack }: { onBack: () => void }) {
    return (
        <section className={styles.strategyDetail} aria-labelledby="strategy-detail-title">
            <button type="button" className={styles.summaryReturn} onClick={onBack}>← PROJECT SUMMARY</button>
            <div className={styles.strategyHeading}>
                <span className={styles.eyebrow}>01</span>
                <h1 id="strategy-detail-title">전략과 판단</h1>
            </div>
            <span className={styles.strategyLabel}>PROJECT CONTEXT</span>
            <p className={styles.strategyContext} data-reading-focus>
                시장성이 확인된 제품 후보를 차별화된 Consumer Product로 구체화하고, 제품 전략부터 D2C 판매환경까지 구축했습니다.
            </p>
            <div className={styles.strategyQuestion} data-reading-focus>
                어떤 제품을 사업화하고,<br />무엇을 다르게 만들며,<br />그 차이를 고객에게 어떻게 전달할 것인가
            </div>
            <div className={styles.decisionBlock} data-reading-focus>
                <span className={styles.eyebrow}>KEY DECISION 01</span>
                <h2>Business Model 변화에 맞춰 Brand Architecture를 변경</h2>
                <div className={styles.beforeAfter}>
                    <div><span>Before</span><strong>One Master Brand</strong><b>→ Multiple Sub-products</b></div>
                    <div><span>After</span><strong>Independent Product Brand</strong><b>→ Independent D2C</b></div>
                </div>
                <p className={styles.decisionStatement}>브랜드 구조를 고수하기보다<br />변화한 Business Model에 맞춰<br />Product Architecture를 재구성했습니다.</p>
            </div>
        </section>
    );
}

function ProductDetail({ onBack }: { onBack: () => void }) {
    const evidenceImages: string[] = [];
    const productImages: string[] = [];

    return (
        <section className={styles.productDetail} aria-labelledby="product-detail-title">
            <button type="button" className={styles.summaryReturn} onClick={onBack}>← PROJECT SUMMARY</button>
            <div className={styles.productHeading}>
                <span className={styles.eyebrow}>02</span>
                <h1 id="product-detail-title">제품 구체화</h1>
            </div>
            <h2 className={styles.productLead} data-reading-focus>Evidence를 Customer Value로 전환</h2>
            <p className={styles.productIntro} data-reading-focus>
                제품의 원료정보를 단순 나열하지 않고,<br />
                Evidence → USP → Customer Benefit → Commerce Communication<br />
                구조로 재설계했다.
            </p>

            <div className={styles.productFlow}>
                <div className={styles.productFlowStep} data-reading-focus>
                    <span className={styles.eyebrow}>01</span>
                    <h3>Evidence</h3>
                    {evidenceImages.length > 0 && (
                        <div className={styles.evidenceImageArea}>
                            {evidenceImages.map((src) => <Image key={src} src={src} alt="" width={1600} height={900} />)}
                        </div>
                    )}
                </div>
                <div className={styles.flowConnector} aria-hidden="true">↓</div>
                <div className={styles.productFlowStep} data-reading-focus>
                    <span className={styles.eyebrow}>02</span>
                    <h3>USP / Customer Language</h3>
                    <p className={styles.productBody}>
                        원료 Specification과 완제품의 효능을 구분하고,<br />
                        일반식품의 표현 범위 안에서 사용할 수 있는 근거를<br />
                        고객이 이해할 수 있는 Product Message로 변환했다.
                    </p>
                    <p className={styles.corePrinciple}>Evidence → USP → Customer Language</p>
                    <div className={styles.productNames}>
                        <strong>RECELLVINE</strong>
                        <span>SORI BLACK</span>
                    </div>
                </div>
                <div className={styles.flowConnector} aria-hidden="true">↓</div>
                <div className={styles.productFlowStep} data-reading-focus>
                    <span className={styles.eyebrow}>03</span>
                    <h3>Product Output</h3>
                    {productImages.length > 0 && (
                        <div className={styles.evidenceImageArea}>
                            {productImages.map((src) => <Image key={src} src={src} alt="" width={1600} height={900} />)}
                        </div>
                    )}
                    <div className={styles.productPair}>
                        <span>RECELLVINE</span>
                        <span>SORI BLACK</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function LaunchDetail({ onBack }: { onBack: () => void }) {
    const steps: Array<{ number: string; title: string; ownership?: "LED" | "EXECUTED" | "COLLABORATED"; media: string[] }> = [
        { number: "01", title: "Product Opportunity", media: [] },
        { number: "02", title: "Differentiation / USP", media: [] },
        { number: "03", title: "Manufacturer", media: [] },
        { number: "04", title: "Brand / Package", media: [] },
        { number: "05", title: "Detail Page", media: [] },
        { number: "06", title: "D2C / Cafe24", media: [] },
        { number: "07", title: "CRM", media: [] },
        { number: "08", title: "Production", media: [] },
        { number: "09", title: "Seeding", media: [] },
        { number: "10", title: "Sales-ready", media: [] },
    ];

    return (
        <section className={styles.launchDetail} aria-labelledby="launch-detail-title">
            <button type="button" className={styles.summaryReturn} onClick={onBack}>← PROJECT SUMMARY</button>
            <div className={styles.launchHeading}>
                <span className={styles.eyebrow}>03</span>
                <h1 id="launch-detail-title">출시 실행</h1>
            </div>
            <h2 className={styles.launchLead} data-reading-focus>Product Strategy에서 실제 판매환경까지 연결</h2>
            <p className={styles.launchIntro} data-reading-focus>
                제품 전략을 문서로 끝내지 않고<br />
                고객이 실제로 제품을 발견하고 구매할 수 있는 환경까지 연결했습니다.
            </p>

            <ol className={styles.launchTimeline} role="list" aria-label="Product launch execution timeline">
                {steps.map((step) => (
                    <li className={styles.timelineStep} key={step.number} data-reading-focus>
                        <div className={styles.timelineMarker}>{step.number}</div>
                        <div className={styles.timelineContent}>
                            <h3>{step.title}</h3>
                            {step.ownership && <span className={styles.ownership}>{step.ownership}</span>}
                            {step.media.length > 0 && (
                                <div className={styles.timelineMedia}>
                                    {step.media.map((src) => <Image key={src} src={src} alt="" width={1600} height={900} />)}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ol>

            <section className={styles.launchOutcome} aria-labelledby="launch-outcome-title" data-reading-focus>
                <h2 id="launch-outcome-title" className={styles.eyebrow}>OUTCOME</h2>
                <strong>4 Consumer Products</strong>
                <strong>~3 Months</strong>
                <strong>Product → Sales-ready</strong>
                <p>약 3개월 동안 제품 차별화부터 브랜드·패키지,<br />커머스 콘텐츠, D2C/CRM 판매환경까지 구축했다.</p>
                <p>제품 실물 생산 및 시딩까지 진행됐으며<br />퇴사 시점에는 판매 개시를 앞둔 상태였다.</p>
            </section>
            <section className={styles.learningSlot} aria-labelledby="launch-learning-title" data-reading-focus>
                <h2 id="launch-learning-title" className={styles.eyebrow}>LEARNING</h2>
                <p>신사업에서는 처음 세운 구조를 고수하는 것보다 사업모델과 시장조건에 따라 빠르게 방향을 수정하고, 실제 고객이 제품을 선택할 수 있는 상태까지 구현하는 것이 중요하다는 것을 배웠습니다.</p>
            </section>
        </section>
    );
}
