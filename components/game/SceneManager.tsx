"use client";

import { useEffect, useReducer } from "react";
import { SceneDebugPanel } from "@/components/game/SceneDebugPanel";
import { SceneViewport } from "@/components/game/SceneViewport";
import {
  INITIAL_SCENE_MACHINE_STATE,
  sceneMachineReducer,
} from "@/lib/scene-machine";
import type { SceneEvent } from "@/types/scene";

export function SceneManager() {
  const [state, dispatch] = useReducer(
    sceneMachineReducer,
    INITIAL_SCENE_MACHINE_STATE,
  );
  const { scene } = state;

  useEffect(() => {
    if (scene.phase === "active" && scene.sceneId === "boot") {
      dispatch({ type: "BOOT_READY" });
    }
    if (scene.phase === "exiting") dispatch({ type: "COMMIT_TRANSITION" });
    if (scene.phase === "entering") dispatch({ type: "SETTLE_SCENE" });
  }, [scene.phase, scene.sceneId]);

  const dispatchSceneEvent = (event: SceneEvent) => dispatch(event);

  return (
    <>
      <SceneViewport scene={scene} dispatch={dispatchSceneEvent} />
      {process.env.NODE_ENV === "development" && (
        <SceneDebugPanel state={state} dispatch={dispatchSceneEvent} />
      )}
    </>
  );
}
