import type { CSSProperties, ReactNode } from "react";
import type { TransitionRuntimeState } from "@/types/transition";
import styles from "./scene-transition.module.css";

interface SceneTransitionLayerProps {
  runtime: TransitionRuntimeState;
  children: ReactNode;
}

export function SceneTransitionLayer({ runtime, children }: SceneTransitionLayerProps) {
  return (
    <div
      className={styles.boundary}
      data-transition-id={runtime.id}
      data-transition-mode={runtime.mode}
      data-transition-phase={runtime.phase}
      style={{
        "--transition-duration": `${Math.ceil(runtime.durationMs / 2)}ms`,
      } as CSSProperties}
    >
      {children}
      <div className={styles.overlay} aria-hidden="true" />
    </div>
  );
}
