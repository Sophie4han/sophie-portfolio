"use client";

import { useState } from "react";
import { WorldScene } from "@/components/world/WorldScene";
import type { SceneState, WorldProgressV1 } from "@/types/game";
import type { SceneEvent } from "@/types/scene";
import type { TransitionRuntimeState } from "@/types/transition";

// Isolated visual fixture. Never feeds SceneManager or persists journey progress.
const previewProgress: WorldProgressV1 = {
  version: 1,
  introCompleted: true,
  completedProjectIds: ["harubareun", "project-02"],
  updatedAt: "",
};

const previewTransition: TransitionRuntimeState = {
  id: "none",
  phase: "idle",
  mode: "scene",
  durationMs: 0,
  reducedMotion: true,
  gateVisibility: "hidden",
};

export function FitMateIslandPreview() {
  const [focused, setFocused] = useState(true);
  const scene: SceneState = {
    sceneId: focused ? "island-focus" : "world-overview",
    phase: "active",
    cameraPreset: focused ? "UNDERSTAND_FOCUS" : "OVERVIEW",
    focusedIslandId: focused ? "fitmate" : null,
    requestedChooniIntent: "world-idle",
    transitionId: null,
    pendingScene: null,
  };

  function dispatch(event: SceneEvent) {
    if (event.type === "BACK_TO_WORLD") setFocused(false);
    if (event.type === "SELECT_ISLAND" && event.projectId === "fitmate") {
      setFocused(true);
    }
  }

  return (
    <>
      <WorldScene
        scene={scene}
        worldProgress={previewProgress}
        transition={previewTransition}
        dispatch={dispatch}
      />
      <span style={{ position: "fixed", left: 16, bottom: 12, zIndex: 40, color: "#172b30", fontSize: 11 }}>
        DEV · FitMate framing only · ENTER PROJECT is inactive
      </span>
    </>
  );
}
