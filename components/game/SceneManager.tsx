"use client";

import { useEffect, useLayoutEffect, useReducer, useSyncExternalStore } from "react";
import { SceneDebugPanel } from "@/components/game/SceneDebugPanel";
import { SceneTransitionLayer } from "@/components/game/SceneTransitionLayer";
import { SceneViewport } from "@/components/game/SceneViewport";
import { useTransitionCoordinator } from "@/components/game/useTransitionCoordinator";
import {
  INITIAL_SCENE_MACHINE_STATE,
  sceneMachineReducer,
} from "@/lib/scene-machine";
import { loadJourneySnapshot, saveSceneSnapshot } from "@/lib/scene-persistence";
import { resetNavigationScroll } from "@/lib/navigation-scroll";
import type { SceneEvent, SceneMachineState } from "@/types/scene";

const subscribeToHydration = () => () => undefined;
const getHydratedSnapshot = () => true;
const getServerSnapshot = () => false;

function createInitialState(initialState: SceneMachineState): SceneMachineState {
  const snapshot = loadJourneySnapshot();
  if (!snapshot) return initialState;

  return sceneMachineReducer(initialState, {
    type: "RESTORE_SESSION",
    sceneId: snapshot.sceneId,
    projectId: snapshot.projectId,
  });
}

export function SceneManager() {
  const [state, dispatch] = useReducer(
    sceneMachineReducer,
    INITIAL_SCENE_MACHINE_STATE,
    createInitialState,
  );
  const hydrationComplete = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerSnapshot,
  );
  const { scene } = state;
  const transition = useTransitionCoordinator(state, dispatch);

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    resetNavigationScroll(document.querySelector("main"));

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (scene.phase === "entering") {
      resetNavigationScroll(document.querySelector("main"));
    }
  }, [scene.phase, scene.sceneId]);

  useEffect(() => {
    if (hydrationComplete && scene.phase === "active" && scene.sceneId === "boot") {
      dispatch({ type: "BOOT_READY" });
    }
  }, [hydrationComplete, scene.phase, scene.sceneId]);

  useEffect(() => {
    if (hydrationComplete && scene.phase === "active") {
      saveSceneSnapshot(scene.sceneId, scene.focusedIslandId);
    }
  }, [hydrationComplete, scene.focusedIslandId, scene.phase, scene.sceneId]);

  const dispatchSceneEvent = (event: SceneEvent) => dispatch(event);

  if (!hydrationComplete) {
    return <main aria-hidden="true" style={{ minHeight: "100dvh", background: "#10272b" }} />;
  }

  return (
    <>
      <SceneTransitionLayer runtime={transition}>
        <SceneViewport
          scene={scene}
          worldProgress={state.worldProgress}
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
