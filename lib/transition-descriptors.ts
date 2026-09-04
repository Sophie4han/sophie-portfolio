import type { SceneId } from "../types/game";
import type {
  AutoSceneAdvance,
  GateVisibility,
  TransitionDescriptor,
  TransitionId,
} from "../types/transition";

export const TRANSITION_DESCRIPTORS: Readonly<Record<TransitionId, TransitionDescriptor>> = {
  none: descriptor("none", 0, 0, "scene"),
  "prologue-response": descriptor("prologue-response", 360, 80, "actor"),
  "gate-reveal": descriptor("gate-reveal", 560, 100, "environment"),
  "gate-entry": descriptor("gate-entry", 520, 100, "actor"),
  "world-enter": descriptor("world-enter", 680, 120, "overlay"),
  "scene-default": descriptor("scene-default", 240, 60, "scene"),
};

export const AUTO_SCENE_ADVANCES: Partial<Readonly<Record<SceneId, AutoSceneAdvance>>> = {
  "intro-follow": {
    sceneId: "intro-follow",
    event: { type: "FOLLOW_COMPLETE" },
    delayMs: 1_100,
    reducedMotionDelayMs: 120,
  },
  "intro-gate": {
    sceneId: "intro-gate",
    event: { type: "ENTER_WORLD" },
    delayMs: 760,
    reducedMotionDelayMs: 120,
  },
  "enter-world": {
    sceneId: "enter-world",
    event: { type: "WORLD_ENTRY_COMPLETE" },
    delayMs: 620,
    reducedMotionDelayMs: 120,
  },
};

const TRANSITION_BY_SCENE_PAIR: Readonly<Record<string, TransitionId>> = {
  "intro-greeting:intro-follow": "prologue-response",
  "intro-follow:intro-gate": "gate-reveal",
  "intro-gate:enter-world": "gate-entry",
  "enter-world:world-overview": "world-enter",
};

export function resolveTransitionId(from: SceneId, to: SceneId): TransitionId {
  return TRANSITION_BY_SCENE_PAIR[`${from}:${to}`] ?? "scene-default";
}

export function getTransitionDescriptor(id: unknown): TransitionDescriptor {
  if (typeof id !== "string" || !(id in TRANSITION_DESCRIPTORS)) {
    return TRANSITION_DESCRIPTORS.none;
  }
  return TRANSITION_DESCRIPTORS[id as TransitionId];
}

export function resolveGateVisibility(
  sceneId: SceneId,
  transitionId: TransitionId,
  phase: "idle" | "exiting" | "entering",
): GateVisibility {
  if (sceneId === "intro-greeting" || sceneId === "boot") return "hidden";
  if (sceneId === "intro-follow") {
    return transitionId === "gate-reveal" && phase === "exiting"
      ? "revealing"
      : "hidden";
  }
  return "revealed";
}

function descriptor(
  id: TransitionId,
  durationMs: number,
  reducedMotionDurationMs: number,
  mode: TransitionDescriptor["mode"],
): TransitionDescriptor {
  return { id, durationMs, reducedMotionDurationMs, mode };
}
