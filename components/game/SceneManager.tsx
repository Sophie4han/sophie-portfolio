"use client";

import { useEffect, useReducer } from "react";
import { resolveProjectProgression } from "@/lib/project-progression";
import { SCENE_DESCRIPTORS } from "@/lib/scene-descriptors";
import {
  INITIAL_SCENE_MACHINE_STATE,
  sceneMachineReducer,
} from "@/lib/scene-machine";
import type { ProjectId } from "@/types/game";
import type { SceneEvent } from "@/types/scene";

const PROJECT_LABELS: Readonly<Record<ProjectId, string>> = {
  harubareun: "BUILD · harubareun",
  "project-02": "ITERATE · project-02",
  fitmate: "UNDERSTAND · fitmate",
};

export function SceneManager() {
  const [state, dispatch] = useReducer(
    sceneMachineReducer,
    INITIAL_SCENE_MACHINE_STATE,
  );
  const { scene } = state;
  const progression = resolveProjectProgression(
    state.worldProgress.completedProjectIds,
  );
  const allowedEvents = SCENE_DESCRIPTORS[scene.sceneId].allowedEvents;

  useEffect(() => {
    if (scene.phase === "exiting") dispatch({ type: "COMMIT_TRANSITION" });
    if (scene.phase === "entering") dispatch({ type: "SETTLE_SCENE" });
    if (scene.phase === "active" && scene.sceneId === "enter-world") {
      dispatch({ type: "WORLD_ENTRY_COMPLETE" });
    }
  }, [scene.phase, scene.sceneId]);

  const dispatchSimpleEvent = (type: SceneEvent["type"]) => {
    if (type === "SELECT_ISLAND") return;
    dispatch({ type } as SceneEvent);
  };

  return (
    <section aria-labelledby="scene-manager-title">
      <h2 id="scene-manager-title" className="text-lg font-semibold">
        SceneManager
      </h2>
      <dl className="mt-4 grid gap-3 font-mono text-sm sm:grid-cols-2">
        <DebugValue label="Current scene" value={scene.sceneId} />
        <DebugValue label="Phase" value={scene.phase} />
        <DebugValue label="Camera" value={scene.cameraPreset} />
        <DebugValue label="Focused island" value={scene.focusedIslandId ?? "none"} />
        <DebugValue label="Chooni intent" value={scene.requestedChooniIntent ?? "none"} />
        <DebugValue label="Transition" value={scene.transitionId ?? "none"} />
      </dl>

      <div className="mt-6 flex flex-wrap gap-2" aria-label="Allowed scene events">
        {allowedEvents
          .filter((eventType) => eventType !== "WORLD_ENTRY_COMPLETE" && eventType !== "SELECT_ISLAND")
          .map((eventType) => (
            <button
              key={eventType}
              type="button"
              className="min-h-11 border border-zinc-500 px-3 py-2 font-mono text-sm"
              onClick={() => dispatchSimpleEvent(eventType)}
            >
              {eventType}
            </button>
          ))}
      </div>

      {allowedEvents.includes("SELECT_ISLAND") && (
        <fieldset className="mt-6 border-t border-zinc-300 pt-4">
          <legend className="font-mono text-sm">SELECT_ISLAND</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(PROJECT_LABELS) as ProjectId[]).map((projectId) => {
              const status = progression.statuses[projectId];
              return (
                <button
                  key={projectId}
                  type="button"
                  className="min-h-11 border border-zinc-500 px-3 py-2 text-left font-mono text-sm disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={status === "locked"}
                  onClick={() => dispatch({ type: "SELECT_ISLAND", projectId })}
                >
                  {PROJECT_LABELS[projectId]} · {status}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <p className="mt-4 min-h-6 font-mono text-xs text-red-700" aria-live="polite">
        {state.lastRejectedEvent
          ? `Rejected: ${state.lastRejectedEvent.eventType} (${state.lastRejectedEvent.reason})`
          : "No rejected event"}
      </p>
    </section>
  );
}

function DebugValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-zinc-500">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
