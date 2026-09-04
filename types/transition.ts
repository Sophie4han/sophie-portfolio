import type { SceneId } from "./game";
import type { SceneEvent } from "./scene";

export type TransitionId =
  | "none"
  | "prologue-response"
  | "gate-reveal"
  | "gate-entry"
  | "world-enter"
  | "scene-default";

export type TransitionMode = "scene" | "actor" | "environment" | "overlay";
export type TransitionPhase = "idle" | "exiting" | "entering";
export type GateVisibility = "hidden" | "revealing" | "revealed";

export interface TransitionDescriptor {
  id: TransitionId;
  durationMs: number;
  reducedMotionDurationMs: number;
  mode: TransitionMode;
}

export interface AutoSceneAdvance {
  sceneId: SceneId;
  event: SceneEvent;
  delayMs: number;
  reducedMotionDelayMs: number;
}

export interface TransitionRuntimeState {
  id: TransitionId;
  phase: TransitionPhase;
  mode: TransitionMode;
  durationMs: number;
  reducedMotion: boolean;
  gateVisibility: GateVisibility;
}
