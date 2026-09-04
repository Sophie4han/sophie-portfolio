"use client";

import { useEffect, useState, type Dispatch } from "react";
import {
  AUTO_SCENE_ADVANCES,
  getTransitionDescriptor,
  resolveGateVisibility,
} from "@/lib/transition-descriptors";
import type { SceneMachineState, SceneManagerEvent } from "@/types/scene";
import type { TransitionRuntimeState } from "@/types/transition";

export function useTransitionCoordinator(
  state: SceneMachineState,
  dispatch: Dispatch<SceneManagerEvent>,
): TransitionRuntimeState {
  const reducedMotion = usePrefersReducedMotion();
  const { scene } = state;
  const descriptor = getTransitionDescriptor(scene.transitionId);
  const phase = scene.phase === "active" || scene.phase === "idle"
    ? "idle"
    : scene.phase;
  const durationMs = reducedMotion
    ? descriptor.reducedMotionDurationMs
    : descriptor.durationMs;

  useEffect(() => {
    if (scene.phase !== "exiting" && scene.phase !== "entering") return;

    const lifecycleEvent: SceneManagerEvent = scene.phase === "exiting"
      ? { type: "COMMIT_TRANSITION" }
      : { type: "SETTLE_SCENE" };
    const timer = window.setTimeout(
      () => dispatch(lifecycleEvent),
      Math.ceil(durationMs / 2),
    );

    return () => window.clearTimeout(timer);
  }, [dispatch, durationMs, scene.phase, scene.transitionId]);

  useEffect(() => {
    if (scene.phase !== "active") return;
    const advance = AUTO_SCENE_ADVANCES[scene.sceneId];
    if (!advance) return;

    const timer = window.setTimeout(
      () => dispatch(advance.event),
      reducedMotion ? advance.reducedMotionDelayMs : advance.delayMs,
    );

    return () => window.clearTimeout(timer);
  }, [dispatch, reducedMotion, scene.phase, scene.sceneId]);

  return {
    id: descriptor.id,
    phase,
    mode: descriptor.mode,
    durationMs,
    reducedMotion,
    gateVisibility: resolveGateVisibility(scene.sceneId, descriptor.id, phase),
  };
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}
