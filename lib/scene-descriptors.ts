import type {
  CameraPreset,
  ChooniIntent,
  ProjectId,
  SceneId,
} from "../types/game";
import type { SceneEventType } from "../types/scene";

export interface SceneDescriptor {
  id: SceneId;
  cameraPreset: CameraPreset;
  chooniIntent: ChooniIntent | null;
  allowedEvents: readonly SceneEventType[];
}

export const PROJECT_CAMERA_PRESETS: Readonly<Record<ProjectId, CameraPreset>> = {
  harubareun: "BUILD_FOCUS",
  "project-02": "ITERATE_FOCUS",
  fitmate: "UNDERSTAND_FOCUS",
};

export const SCENE_DESCRIPTORS: Readonly<Record<SceneId, SceneDescriptor>> = {
  boot: descriptor("boot", "OVERVIEW", null, ["BOOT_READY"]),
  "intro-greeting": descriptor("intro-greeting", "OVERVIEW", "greet", ["INTRO_ACCEPTED"]),
  "intro-follow": descriptor("intro-follow", "OVERVIEW", "lead-forward", ["FOLLOW_COMPLETE"]),
  "intro-gate": descriptor("intro-gate", "OVERVIEW", "look-at-gate", ["ENTER_WORLD"]),
  "enter-world": descriptor("enter-world", "OVERVIEW", "enter-portal", ["WORLD_ENTRY_COMPLETE"]),
  "world-overview": descriptor("world-overview", "OVERVIEW", "world-idle", ["SELECT_ISLAND"]),
  "island-focus": descriptor("island-focus", "OVERVIEW", "point-project", ["BACK_TO_WORLD", "ENTER_ISLAND"]),
  "island-entry": descriptor("island-entry", "OVERVIEW", "introduce-project", ["BACK_TO_WORLD", "START_CASE_STUDY"]),
  "case-study-transition": descriptor("case-study-transition", "OVERVIEW", "enter-project-world", []),
  "case-study-world": descriptor("case-study-world", "OVERVIEW", "guide-content", []),
  "final-checkpoint": descriptor("final-checkpoint", "OVERVIEW", "arrive-at-checkpoint", []),
  "project-clear": descriptor("project-clear", "OVERVIEW", "celebrate", []),
  "badge-acquired": descriptor("badge-acquired", "OVERVIEW", "present-badge", []),
  "world-return": descriptor("world-return", "OVERVIEW", "return-to-world", []),
  "next-island-unlock": descriptor("next-island-unlock", "OVERVIEW", "point-next", []),
  "world-complete": descriptor("world-complete", "WORLD_COMPLETE", "journey-complete", []),
  ending: descriptor("ending", "WORLD_COMPLETE", "ending-guide", []),
};

function descriptor(
  id: SceneId,
  cameraPreset: CameraPreset,
  chooniIntent: ChooniIntent | null,
  allowedEvents: readonly SceneEventType[],
): SceneDescriptor {
  return { id, cameraPreset, chooniIntent, allowedEvents };
}
