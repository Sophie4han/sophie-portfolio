"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./chooni-motion.module.css";

const ASSET_ROOT = "/images/pixel/chooni/prologue-greeting";
const LOOP_DURATION_MS = 4_880;

type VisualState =
  | "neutral"
  | "blink-half"
  | "blink-closed"
  | "smile"
  | "arm-raise"
  | "wave-outward"
  | "wave-inward"
  | "neutral-return"
  | "waiting";

type DirectState = "neutral" | "blink-half" | "blink-closed" | "smile" | "wave-outward";

const timeline: ReadonlyArray<{ state: VisualState; end: number }> = [
  { state: "neutral", end: 900 },
  { state: "blink-half", end: 970 },
  { state: "blink-closed", end: 1_060 },
  { state: "blink-half", end: 1_130 },
  { state: "neutral", end: 1_630 },
  { state: "smile", end: 2_280 },
  { state: "arm-raise", end: 2_500 },
  { state: "wave-outward", end: 2_660 },
  { state: "wave-inward", end: 2_820 },
  { state: "wave-outward", end: 2_980 },
  { state: "wave-inward", end: 3_140 },
  { state: "neutral-return", end: 3_380 },
  { state: "waiting", end: LOOP_DURATION_MS },
];

const directControls: ReadonlyArray<{ label: string; state: DirectState }> = [
  { label: "Neutral", state: "neutral" },
  { label: "Half Blink", state: "blink-half" },
  { label: "Closed Blink", state: "blink-closed" },
  { label: "Smile", state: "smile" },
  { label: "Wave", state: "wave-outward" },
];

function stateAt(elapsed: number): VisualState {
  return timeline.find(({ end }) => elapsed < end)?.state ?? "neutral";
}

function CharacterStage({ scale, state }: { scale: 1 | 2 | 4; state: VisualState }) {
  const isHalfBlink = state === "blink-half";
  const isClosedBlink = state === "blink-closed";
  const isSmile = ["smile", "arm-raise", "wave-outward", "wave-inward"].includes(state);
  const isWave = ["arm-raise", "wave-outward", "wave-inward"].includes(state);

  return (
    <section className={styles.preview} aria-label={`${scale}x preview`}>
      <div className={styles.previewHeading}>
        <h2>{scale}x</h2>
        <span>{128 * scale}×{128 * scale}px target</span>
      </div>
      <div className={styles.stageViewport} style={{ "--stage-size": `${128 * scale}px` } as React.CSSProperties}>
        <div
          className={styles.stage}
          data-layer-contract="body-rig-base arm-right-neutral arm-right-wave"
        >
          <Image className={`${styles.layer} ${styles.bodyBase}`} data-layer="body-rig-base" src={`${ASSET_ROOT}/body-base.png`} alt="" fill sizes="512px" unoptimized priority />
          {isHalfBlink && <Image className={`${styles.layer} ${styles.eyeVariant}`} src={`${ASSET_ROOT}/face-blink-half.png`} alt="" fill sizes="512px" unoptimized />}
          {isClosedBlink && <Image className={`${styles.layer} ${styles.eyeVariant}`} src={`${ASSET_ROOT}/face-blink-closed.png`} alt="" fill sizes="512px" unoptimized />}
          {isSmile && <Image className={`${styles.layer} ${styles.mouthVariant}`} src={`${ASSET_ROOT}/face-smile.png`} alt="" fill sizes="512px" unoptimized />}
          {isWave && (
            <Image
              className={`${styles.layer} ${styles.armVariant}`}
              data-layer="arm-right-wave"
              src={`${ASSET_ROOT}/arm-right-wave.png`}
              alt=""
              fill
              sizes="512px"
              unoptimized
            />
          )}
          <span className={styles.groundLine} aria-hidden="true" />
        </div>
      </div>
      <p className={styles.baselineLabel}>ground anchor y=119px</p>
    </section>
  );
}

export function ChooniMotionTest() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [manualState, setManualState] = useState<DirectState | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const originRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!isPlaying || reducedMotion || manualState) return;

    originRef.current = performance.now() - elapsedRef.current;
    const timer = window.setInterval(() => {
      const origin = originRef.current ?? performance.now();
      const nextElapsed = (performance.now() - origin) % LOOP_DURATION_MS;
      elapsedRef.current = nextElapsed;
      setElapsed(nextElapsed);
    }, 20);

    return () => window.clearInterval(timer);
  }, [isPlaying, manualState, reducedMotion]);

  const activeState: VisualState = reducedMotion
    ? "neutral"
    : manualState ?? stateAt(elapsed);

  const togglePlayback = () => {
    setManualState(null);
    setIsPlaying((current) => !current);
  };

  const restart = () => {
    originRef.current = performance.now();
    elapsedRef.current = 0;
    setElapsed(0);
    setManualState(null);
    setIsPlaying(!reducedMotion);
  };

  const selectState = (state: DirectState) => {
    setManualState(state);
    setIsPlaying(false);
  };

  return (
    <div className={styles.testArea}>
      <section className={styles.controls} aria-labelledby="motion-controls-title">
        <div className={styles.statusRow} aria-live="polite">
          <div>
            <span>Current state</span>
            <strong>{activeState}</strong>
          </div>
          <div>
            <span>Elapsed</span>
            <strong>{Math.round(elapsed)}ms</strong>
          </div>
        </div>
        <h2 id="motion-controls-title" className={styles.visuallyHidden}>Motion controls</h2>
        <div className={styles.controlGroup}>
          <button type="button" onClick={togglePlayback} aria-pressed={isPlaying && !reducedMotion}>
            {isPlaying && !reducedMotion ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={restart}>Restart</button>
        </div>
        <div className={styles.controlGroup} aria-label="Select a state directly">
          {directControls.map(({ label, state }) => (
            <button
              key={state}
              type="button"
              onClick={() => selectState(state)}
              aria-pressed={!reducedMotion && manualState === state}
            >
              {label}
            </button>
          ))}
        </div>
        {reducedMotion && (
          <p className={styles.notice}>Reduced motion: automatic playback and rotation are disabled; body-base is shown.</p>
        )}
      </section>

      <div className={styles.previewGrid}>
        <CharacterStage scale={1} state={activeState} />
        <CharacterStage scale={2} state={activeState} />
        <CharacterStage scale={4} state={activeState} />
      </div>

      <aside className={styles.coordinates} aria-label="Composite coordinates">
        <strong>Composite regions</strong>
        <code>eyes: x=30–98, y=27–50</code>
        <code>mouth: x=38–90, y=46–67</code>
        <code>wave: full-image static replacement pending arm-only PNG</code>
      </aside>
    </div>
  );
}
