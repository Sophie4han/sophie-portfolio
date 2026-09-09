"use client";

import { useEffect, useRef, useState } from "react";
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
  const [fastPathNoticeVisible, setFastPathNoticeVisible] = useState(false);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [sceneId]);

  return (
    <main
      className={styles.scene}
      data-intro-scene={sceneId}
      data-transition-id={transition.id}
      data-transition-phase={transition.phase}
    >
      <WoodlandStage sceneId={sceneId} intent={chooniIntent} transition={transition} />
      <header className={styles.sceneHud} aria-label="MOVE ON prologue">
        <strong>MOVE ON</strong>
        <span>PROLOGUE · WOODLAND GATEWAY</span>
      </header>

      <div className={styles.conversation}>
        <SpeechBubble sceneId={sceneId}>
          {sceneId === "intro-greeting" && (
            <>
              <p className={styles.kicker}>CHOONI</p>
              <h1 ref={headingRef} tabIndex={-1}>Hi! 👋 I’m Chooni, your little guide.</h1>
              <p>Want me to show you around?</p>
              <ReplyChoices>
                <button type="button" disabled={transition.phase !== "idle"} onClick={() => dispatch({ type: "INTRO_ACCEPTED" })}>
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
