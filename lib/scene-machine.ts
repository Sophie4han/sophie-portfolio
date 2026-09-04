import { resolveProjectProgression } from "./project-progression";
import {
  PROJECT_CAMERA_PRESETS,
  SCENE_DESCRIPTORS,
} from "./scene-descriptors";
import type {
  CameraPreset,
  ChooniIntent,
  PendingSceneState,
  ProjectId,
  SceneId,
  SceneState,
  WorldProgressV1,
} from "../types/game";
import type {
  SceneEvent,
  SceneMachineState,
  SceneManagerEvent,
  TransitionRejectionReason,
} from "../types/scene";
import { resolveTransitionId } from "./transition-descriptors";

export const INITIAL_WORLD_PROGRESS: WorldProgressV1 = {
  version: 1,
  introCompleted: false,
  completedProjectIds: [],
  updatedAt: "",
};

export const INITIAL_SCENE_MACHINE_STATE: SceneMachineState = {
  scene: createSceneState("boot"),
  worldProgress: INITIAL_WORLD_PROGRESS,
  lastRejectedEvent: null,
};

export function sceneMachineReducer(
  state: SceneMachineState,
  event: SceneManagerEvent,
): SceneMachineState {
  if (event.type === "COMMIT_TRANSITION") return commitTransition(state, event.type);
  if (event.type === "SETTLE_SCENE") return settleScene(state, event.type);

  if (state.scene.phase !== "active") {
    return reject(state, event.type, "scene-not-active");
  }

  const descriptor = SCENE_DESCRIPTORS[state.scene.sceneId];
  if (!descriptor.allowedEvents.includes(event.type)) {
    return reject(state, event.type, "event-not-allowed");
  }

  return transitionForEvent(state, event);
}

function transitionForEvent(
  state: SceneMachineState,
  event: SceneEvent,
): SceneMachineState {
  switch (event.type) {
    case "BOOT_READY":
      return beginTransition(state, "intro-greeting");
    case "INTRO_ACCEPTED":
      return beginTransition(state, "intro-follow");
    case "FOLLOW_COMPLETE":
      return beginTransition(state, "intro-gate");
    case "ENTER_WORLD":
      return beginTransition(state, "enter-world");
    case "WORLD_ENTRY_COMPLETE":
      return beginTransition(state, "world-overview", {
        worldProgress: { ...state.worldProgress, introCompleted: true },
      });
    case "SELECT_ISLAND":
      return selectIsland(state, event.projectId);
    case "BACK_TO_WORLD":
      return beginTransition(state, "world-overview", { focusedIslandId: null });
    case "ENTER_ISLAND":
      if (!state.scene.focusedIslandId) {
        return reject(state, event.type, "missing-focused-island");
      }
      return beginTransition(state, "island-entry", {
        focusedIslandId: state.scene.focusedIslandId,
        cameraPreset: PROJECT_CAMERA_PRESETS[state.scene.focusedIslandId],
      });
    case "START_CASE_STUDY":
      if (!state.scene.focusedIslandId) {
        return reject(state, event.type, "missing-focused-island");
      }
      return beginTransition(state, "case-study-transition", {
        focusedIslandId: state.scene.focusedIslandId,
        cameraPreset: PROJECT_CAMERA_PRESETS[state.scene.focusedIslandId],
      });
  }
}

function selectIsland(
  state: SceneMachineState,
  projectId: ProjectId,
): SceneMachineState {
  const progression = resolveProjectProgression(
    state.worldProgress.completedProjectIds,
  );
  const status = progression.statuses[projectId];

  if (status === "locked") {
    return reject(state, "SELECT_ISLAND", "project-locked");
  }

  return beginTransition(state, "island-focus", {
    focusedIslandId: projectId,
    cameraPreset: PROJECT_CAMERA_PRESETS[projectId],
  });
}

interface TransitionOverrides {
  focusedIslandId?: ProjectId | null;
  cameraPreset?: CameraPreset;
  chooniIntent?: ChooniIntent | null;
  worldProgress?: WorldProgressV1;
}

function beginTransition(
  state: SceneMachineState,
  nextSceneId: SceneId,
  overrides: TransitionOverrides = {},
): SceneMachineState {
  const nextDescriptor = SCENE_DESCRIPTORS[nextSceneId];
  const pendingScene: PendingSceneState = {
    sceneId: nextSceneId,
    focusedIslandId:
      overrides.focusedIslandId === undefined
        ? state.scene.focusedIslandId
        : overrides.focusedIslandId,
    cameraPreset: overrides.cameraPreset ?? nextDescriptor.cameraPreset,
    requestedChooniIntent:
      overrides.chooniIntent === undefined
        ? nextDescriptor.chooniIntent
        : overrides.chooniIntent,
  };

  return {
    scene: {
      ...state.scene,
      phase: "exiting",
      transitionId: resolveTransitionId(state.scene.sceneId, nextSceneId),
      pendingScene,
    },
    worldProgress: overrides.worldProgress ?? state.worldProgress,
    lastRejectedEvent: null,
  };
}

function commitTransition(
  state: SceneMachineState,
  eventType: SceneManagerEvent["type"],
): SceneMachineState {
  const pending = state.scene.pendingScene;
  if (!pending && (state.scene.phase === "entering" || state.scene.phase === "active")) {
    return state;
  }
  if (state.scene.phase !== "exiting" || !pending) {
    return reject(state, eventType, "no-pending-transition");
  }

  return {
    ...state,
    scene: {
      sceneId: pending.sceneId,
      phase: "entering",
      focusedIslandId: pending.focusedIslandId,
      cameraPreset: pending.cameraPreset,
      requestedChooniIntent: pending.requestedChooniIntent,
      transitionId: state.scene.transitionId,
      pendingScene: null,
    },
    lastRejectedEvent: null,
  };
}

function settleScene(
  state: SceneMachineState,
  eventType: SceneManagerEvent["type"],
): SceneMachineState {
  if (state.scene.phase === "active") return state;
  if (state.scene.phase !== "entering") {
    return reject(state, eventType, "event-not-allowed");
  }

  return {
    ...state,
    scene: {
      ...state.scene,
      phase: "active",
      transitionId: null,
    },
    lastRejectedEvent: null,
  };
}

function createSceneState(sceneId: SceneId): SceneState {
  const descriptor = SCENE_DESCRIPTORS[sceneId];
  return {
    sceneId,
    phase: "active",
    focusedIslandId: null,
    cameraPreset: descriptor.cameraPreset,
    requestedChooniIntent: descriptor.chooniIntent,
    transitionId: null,
    pendingScene: null,
  };
}

function reject(
  state: SceneMachineState,
  eventType: SceneManagerEvent["type"],
  reason: TransitionRejectionReason,
): SceneMachineState {
  return {
    ...state,
    lastRejectedEvent: { eventType, reason },
  };
}
