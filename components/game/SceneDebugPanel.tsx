import { resolveProjectProgression } from "@/lib/project-progression";
import { SCENE_DESCRIPTORS } from "@/lib/scene-descriptors";
import type { ProjectId } from "@/types/game";
import type { SceneEvent, SceneMachineState } from "@/types/scene";
import type { TransitionRuntimeState } from "@/types/transition";

const PROJECT_LABELS: Readonly<Record<ProjectId, string>> = {
  harubareun: "BUILD · harubareun",
  "project-02": "ITERATE · project-02",
  fitmate: "UNDERSTAND · fitmate",
};

interface SceneDebugPanelProps {
  state: SceneMachineState;
  transition: TransitionRuntimeState;
  dispatch: (event: SceneEvent) => void;
}

export function SceneDebugPanel({ state, transition, dispatch }: SceneDebugPanelProps) {
  const { scene } = state;
  const progression = resolveProjectProgression(state.worldProgress.completedProjectIds);
  const allowedEvents = SCENE_DESCRIPTORS[scene.sceneId].allowedEvents;

  return (
    <details
      id="scene-debug"
      className="fixed right-3 bottom-3 z-50 max-h-[70dvh] w-[min(92vw,430px)] overflow-auto border border-zinc-500 bg-white p-3 text-zinc-950 shadow-xl"
    >
      <summary className="cursor-pointer font-mono text-xs font-bold uppercase">
        Scene debug · {scene.sceneId}
      </summary>
      <dl className="mt-4 grid gap-3 font-mono text-xs sm:grid-cols-2">
        <DebugValue label="Phase" value={scene.phase} />
        <DebugValue label="Camera" value={scene.cameraPreset} />
        <DebugValue label="Focused island" value={scene.focusedIslandId ?? "none"} />
        <DebugValue label="Chooni intent" value={scene.requestedChooniIntent ?? "none"} />
        <DebugValue label="Pending scene" value={scene.pendingScene?.sceneId ?? "none"} />
        <DebugValue label="Transition ID" value={transition.id} />
        <DebugValue label="Transition phase" value={transition.phase} />
        <DebugValue label="Reduced motion" value={String(transition.reducedMotion)} />
        <DebugValue label="Gate" value={transition.gateVisibility} />
      </dl>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Allowed debug events">
        {allowedEvents
          .filter((type) => type !== "WORLD_ENTRY_COMPLETE" && type !== "SELECT_ISLAND")
          .map((type) => (
            <button
              key={type}
              type="button"
              className="min-h-11 border border-zinc-500 px-3 py-2 font-mono text-xs"
              onClick={() => dispatch({ type } as SceneEvent)}
            >
              {type}
            </button>
          ))}
      </div>

      {allowedEvents.includes("SELECT_ISLAND") && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(PROJECT_LABELS) as ProjectId[]).map((projectId) => {
            const status = progression.statuses[projectId];
            return (
              <button
                key={projectId}
                type="button"
                className="min-h-11 border border-zinc-500 px-3 py-2 font-mono text-xs disabled:opacity-45"
                disabled={status === "locked"}
                onClick={() => dispatch({ type: "SELECT_ISLAND", projectId })}
              >
                {PROJECT_LABELS[projectId]} · {status}
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-3 min-h-5 font-mono text-xs text-red-700" aria-live="polite">
        {state.lastRejectedEvent
          ? `Rejected: ${state.lastRejectedEvent.eventType} (${state.lastRejectedEvent.reason})`
          : "No rejected event"}
      </p>
    </details>
  );
}

function DebugValue({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-zinc-500">{label}</dt><dd>{value}</dd></div>;
}
