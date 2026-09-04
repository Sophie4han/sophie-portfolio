"use client";

import { useEffect, useReducer } from "react";
import { SceneDebugPanel } from "@/components/game/SceneDebugPanel";
import { SceneTransitionLayer } from "@/components/game/SceneTransitionLayer";
import { SceneViewport } from "@/components/game/SceneViewport";
import { useTransitionCoordinator } from "@/components/game/useTransitionCoordinator";
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
  const transition = useTransitionCoordinator(state, dispatch);

  useEffect(() => {
    if (scene.phase === "active" && scene.sceneId === "boot") {
      dispatch({ type: "BOOT_READY" });
    }
  }, [scene.phase, scene.sceneId]);

  const dispatchSceneEvent = (event: SceneEvent) => dispatch(event);

  return (
    <>
      <SceneTransitionLayer runtime={transition}>
        <SceneViewport
          scene={scene}
          transition={transition}
          dispatch={dispatchSceneEvent}
        />
      </SceneTransitionLayer>
      {process.env.NODE_ENV === "development" && (
        <SceneDebugPanel
          state={state}
          transition={transition}
          dispatch={dispatchSceneEvent}
        />
      )}
    </>
  );
}
