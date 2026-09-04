"use client";

import { useEffect, useRef, useState } from "react";
import type { ChooniIntent, SceneId } from "@/types/game";
import type { SceneEvent } from "@/types/scene";
import styles from "./intro-scene.module.css";

type ProloguePhase =
  | "intro-greeting"
  | "intro-follow"
  | "intro-gate"
  | "enter-world";

type PrologueActorStage =
  | "front-facing"
  | "turn-and-walk-to-gate"
  | "approach-gate"
  | "enter-gate";

const ACTOR_STAGE_BY_PHASE: Readonly<Record<ProloguePhase, PrologueActorStage>> = {
  "intro-greeting": "front-facing",
  "intro-follow": "turn-and-walk-to-gate",
  "intro-gate": "approach-gate",
  "enter-world": "enter-gate",
};

interface IntroSceneProps {
  sceneId: ProloguePhase;
  chooniIntent: ChooniIntent | null;
  dispatch: (event: SceneEvent) => void;
}

const PHASE_DURATION_MS: Readonly<Record<Exclude<ProloguePhase, "intro-greeting">, number>> = {
  "intro-follow": 1_600,
  "intro-gate": 900,
  "enter-world": 800,
};
const REDUCED_MOTION_PHASE_DURATION_MS = 160;

export function isProloguePhase(sceneId: SceneId): sceneId is ProloguePhase {
  return sceneId === "intro-greeting"
    || sceneId === "intro-follow"
    || sceneId === "intro-gate"
    || sceneId === "enter-world";
}

export function IntroScene({ sceneId, chooniIntent, dispatch }: IntroSceneProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [fastPathNoticeVisible, setFastPathNoticeVisible] = useState(false);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [sceneId]);

  useEffect(() => {
    if (sceneId === "intro-greeting") return;

    const event: SceneEvent = sceneId === "intro-follow"
      ? { type: "FOLLOW_COMPLETE" }
      : sceneId === "intro-gate"
        ? { type: "ENTER_WORLD" }
        : { type: "WORLD_ENTRY_COMPLETE" };

    const timer = window.setTimeout(
      () => dispatch(event),
      prefersReducedMotion
        ? REDUCED_MOTION_PHASE_DURATION_MS
        : PHASE_DURATION_MS[sceneId],
    );

    return () => window.clearTimeout(timer);
  }, [dispatch, prefersReducedMotion, sceneId]);

  return (
    <main className={styles.scene} data-intro-scene={sceneId}>
      <SceneEnvironment sceneId={sceneId} />

      <div className={styles.actor}>
        <ChooniStage intent={chooniIntent} sceneId={sceneId} />
      </div>

      <div className={styles.conversation}>
        <SpeechBubble sceneId={sceneId}>
          {sceneId === "intro-greeting" && (
            <>
              <p className={styles.kicker}>CHOONI</p>
              <h1 ref={headingRef} tabIndex={-1}>Hi! 👋 I’m Chooni, your little guide.</h1>
              <p>Want me to show you around?</p>
              <ReplyChoices>
                <button type="button" onClick={() => dispatch({ type: "INTRO_ACCEPTED" })}>
                  Sounds good!
                </button>
                <button
                  type="button"
                  className={styles.secondaryReply}
                  data-future-href="/projects"
                  onClick={() => setFastPathNoticeVisible(true)}
                >
                  I’ll explore myself
                </button>
              </ReplyChoices>
              {fastPathNoticeVisible && (
                <p className={styles.fastPathNotice} role="status">
                  The project index will open here once the approved `/projects` route is implemented.
                </p>
              )}
            </>
          )}

          {sceneId === "intro-follow" && (
            <>
              <p className={styles.kicker}>CHOONI</p>
              <h1 ref={headingRef} tabIndex={-1}>Great! Follow me.</h1>
              <p className={styles.status} role="status">Chooni is leading the way…</p>
            </>
          )}

          {sceneId === "intro-gate" && (
            <>
              <p className={styles.kicker}>THE GATE APPEARS</p>
              <h1 ref={headingRef} tabIndex={-1}>This way.</h1>
              <p className={styles.status} role="status">Chooni is approaching the gate…</p>
            </>
          )}

          {sceneId === "enter-world" && (
            <>
              <p className={styles.kicker}>ENTERING MOVE ON</p>
              <h1 ref={headingRef} tabIndex={-1}>Let’s move on.</h1>
              <p className={styles.status} role="status">Chooni is opening the way to the next world…</p>
            </>
          )}
        </SpeechBubble>
      </div>
    </main>
  );
}

function SpeechBubble({
  sceneId,
  children,
}: {
  sceneId: ProloguePhase;
  children: React.ReactNode;
}) {
  return (
    <section
      className={styles.speechBubble}
      data-speaker="chooni"
      data-bubble-placement={sceneId}
      aria-label="Chooni says"
    >
      {children}
      <span className={styles.bubbleTail} aria-hidden="true" />
    </section>
  );
}

function ReplyChoices({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.replies} aria-label="Choose your reply">
      <p className={styles.replyPrompt}>Your reply</p>
      {children}
    </div>
  );
}

function ChooniStage({
  intent,
  sceneId,
}: {
  intent: ChooniIntent | null;
  sceneId: ProloguePhase;
}) {
  return (
    <div
      className={styles.chooniStage}
      data-chooni-intent={intent ?? "none"}
      data-actor-stage={ACTOR_STAGE_BY_PHASE[sceneId]}
      data-scene-placement={sceneId}
      role="img"
      aria-label={`Chooni, the guide. Character artwork pending. Current action: ${ACTOR_STAGE_BY_PHASE[sceneId]}.`}
    >
      <div className={styles.chooniPlaceholder} aria-hidden="true">
        <span>CHOONI</span>
        <small>actor boundary</small>
      </div>
    </div>
  );
}

function SceneEnvironment({ sceneId }: { sceneId: ProloguePhase }) {
  return (
    <div className={styles.environment} aria-hidden="true">
      <span className={styles.horizon} />
      <span className={styles.path} />
      {(sceneId === "intro-follow" || sceneId === "intro-gate" || sceneId === "enter-world") && (
        <span className={styles.gate}>
          <strong>MOVE ON</strong>
          <small>World gate</small>
        </span>
      )}
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
