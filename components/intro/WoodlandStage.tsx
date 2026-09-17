import Image, { getImageProps } from "next/image";
import { lazy, Suspense, useEffect, type CSSProperties } from "react";
import { PROLOGUE_ANCHOR_STYLE } from "@/lib/prologue-visual";
import { CHOONI_MOTION } from "@/lib/chooni-motion";
import type { ChooniIntent } from "@/types/game";
import type { TransitionRuntimeState } from "@/types/transition";
import type { ProloguePhase } from "./IntroScene";
import styles from "./intro-scene.module.css";

const Chooni3D = lazy(() => import("@/components/character/Chooni3D").then((module) => ({ default: module.Chooni3D })));

const ACTOR_STAGE = {
  "intro-greeting": "greeting",
  "intro-follow": "happy",
  "intro-gate": "portal-reaction",
  "enter-world": "departure",
} as const;

const GATE_IMAGE = {
  src: "/images/pixel/prologue/woodland-gate-v03.png", alt: "",
  width: 1254, height: 1254, sizes: "(max-width: 760px) 220px, 22vw",
};
const { props: gatePreload } = getImageProps(GATE_IMAGE);

export function WoodlandStage({ sceneId, intent, transition, onChooniEntranceComplete }: {
  sceneId: ProloguePhase;
  intent: ChooniIntent | null;
  transition: TransitionRuntimeState;
  onChooniEntranceComplete: () => void;
}) {
  // Warm the responsive candidate during Greeting without mounting a visible gate.
  useEffect(() => {
    const image = new window.Image();
    image.sizes = gatePreload.sizes ?? "";
    image.srcset = gatePreload.srcSet ?? "";
    image.src = gatePreload.src;
    void image.decode().catch(() => { /* The visible image retains native loading fallback. */ });
  }, []);

  return (
    <div className={styles.stageViewport}>
      <link rel="preload" as="image" imageSrcSet={gatePreload.srcSet} imageSizes={gatePreload.sizes} />
      <div className={styles.woodlandPlane} style={PROLOGUE_ANCHOR_STYLE}>
        <Image
          src="/images/pixel/prologue/woodland-clearing-v03.png"
          alt="" width={1536} height={1024} preload
          sizes="(max-width: 760px) 960px, (max-height: 640px) max(100vw, 960px), max(100vw, 150dvh)"
          className={styles.woodlandBackground}
        />
        {transition.gateVisibility !== "hidden" && (
          <div className={styles.gate} data-gate-visibility={transition.gateVisibility} aria-hidden="true">
            <span className={styles.gateAtmosphere} />
            <span className={styles.gateContact} />
            <Image {...GATE_IMAGE} alt="" loading="eager" decoding="sync" className={styles.gateStone} />
          </div>
        )}
        <div className={styles.actor} data-actor-stage={ACTOR_STAGE[sceneId]}
          style={{ "--departure-ms": `${CHOONI_MOTION.departureMs}ms` } as CSSProperties}
          data-chooni-intent={intent ?? "none"} data-ground-anchor="feet">
          <span className={styles.actorShadow} aria-hidden="true" />
          <Suspense fallback={null}>
            <Chooni3D motion={ACTOR_STAGE[sceneId]} reducedMotion={transition.reducedMotion}
              className={styles.chooniSlot}
              onEntranceComplete={onChooniEntranceComplete} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
