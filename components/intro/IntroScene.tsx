"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CHOONI_MOTION } from "@/lib/chooni-motion";
import { TRANSITION_DESCRIPTORS } from "@/lib/transition-descriptors";
import type { ChooniIntent, SceneId } from "@/types/game";
import type { SceneEvent } from "@/types/scene";
import type { TransitionRuntimeState } from "@/types/transition";
import styles from "./intro-scene.module.css";
import { WoodlandStage } from "./WoodlandStage";

export type ProloguePhase =
  | "intro-greeting"
  | "intro-follow"
  | "intro-gate"
  | "enter-world";

interface IntroSceneProps {
  sceneId: ProloguePhase;
  chooniIntent: ChooniIntent | null;
  transition: TransitionRuntimeState;
  dispatch: (event: SceneEvent) => void;
}

export function isProloguePhase(sceneId: SceneId): sceneId is ProloguePhase {
  return sceneId === "intro-greeting"
    || sceneId === "intro-follow"
    || sceneId === "intro-gate"
    || sceneId === "enter-world";
}

export function IntroScene({ sceneId, chooniIntent, transition, dispatch }: IntroSceneProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const replyAcceptedRef = useRef(false);
  const [greetingCardVisible, setGreetingCardVisible] = useState(false);
  const revealTimerRef = useRef<number | null>(null);

  const handleChooniEntranceComplete = () => {
    if (revealTimerRef.current !== null) return;
    revealTimerRef.current = window.setTimeout(
      () => setGreetingCardVisible(true),
      transition.reducedMotion ? 0 : CHOONI_MOTION.speechDelayMs,
    );
  };

  useEffect(() => () => {
    if (revealTimerRef.current !== null) window.clearTimeout(revealTimerRef.current);
  }, []);

  useEffect(() => {
    if (sceneId === "intro-greeting" && greetingCardVisible) {
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [sceneId, greetingCardVisible]);

  const replyExiting = sceneId === "intro-greeting"
    && transition.id === "prologue-response"
    && transition.phase === "exiting";
  const replyExitMs = (transition.reducedMotion
    ? TRANSITION_DESCRIPTORS["prologue-response"].reducedMotionDurationMs
    : TRANSITION_DESCRIPTORS["prologue-response"].durationMs) / 2;

  const handleReply = () => {
    if (transition.phase !== "idle" || replyAcceptedRef.current) return;
    replyAcceptedRef.current = true;
    dispatch({ type: "INTRO_ACCEPTED" });
  };

  return (
    <main
      className={styles.scene}
      data-intro-scene={sceneId}
      data-transition-id={transition.id}
      data-transition-phase={transition.phase}
    >
      <WoodlandStage sceneId={sceneId} intent={chooniIntent} transition={transition}
        onChooniEntranceComplete={handleChooniEntranceComplete} />
      <header className={styles.sceneHud} aria-label="MOVE ON prologue">
        <strong>MOVE ON</strong>
        <span>PROLOGUE · WOODLAND GATEWAY</span>
      </header>

      <div className={styles.conversation}>
        {sceneId === "intro-greeting" && greetingCardVisible && <SpeechBubble
          replyExiting={replyExiting}
          style={{
            "--speech-reveal-ms": `${CHOONI_MOTION.speechRevealMs}ms`,
            "--speech-exit-ms": `${replyExitMs}ms`,
          } as CSSProperties}>
            <>
              <p className={styles.kicker}>CHOONI</p>
              <h1 ref={headingRef} tabIndex={-1}>안녕! 나는 춘이야!</h1>
              <p>포폴 보러 가볼까?</p>
              <ReplyChoices>
                <button type="button" aria-disabled={replyExiting} onClick={handleReply}>
                  그래 가자!
                </button>
              </ReplyChoices>
            </>
        </SpeechBubble>}
        {sceneId === "intro-follow" && <span className={styles.srOnly} role="status">춘이가 기뻐하고 있어요.</span>}
        {sceneId === "intro-gate" && <span className={styles.srOnly} role="status">춘이가 문을 바라보고 있어요.</span>}
        {sceneId === "enter-world" && <span className={styles.srOnly} role="status">춘이가 문으로 이동하고 있어요.</span>}
      </div>
    </main>
  );
}

function SpeechBubble({
  replyExiting,
  children,
  style,
}: {
  replyExiting: boolean;
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      className={styles.speechBubble}
      style={style}
      data-speaker="chooni"
      data-bubble-placement="intro-greeting"
      data-reply-exiting={replyExiting}
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
      <p className={styles.replyPrompt}>답장</p>
      {children}
    </div>
  );
}
