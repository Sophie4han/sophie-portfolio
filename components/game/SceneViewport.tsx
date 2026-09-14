import { IntroScene, isProloguePhase } from "@/components/intro/IntroScene";
import { WorldScene } from "@/components/world/WorldScene";
import { HarubareunProjectDetail } from "@/components/project/HarubareunProjectDetail";
import { InvaderProjectDetail } from "@/components/project/InvaderProjectDetail";
import { FitMateProjectDetail } from "@/components/project/FitMateProjectDetail";
import { ProjectDetailNavigation } from "@/components/project/ProjectDetailNavigation";
import { getIslandRegion } from "@/lib/world-manifest";
import type { SceneState, WorldProgressV1 } from "@/types/game";
import type { SceneEvent } from "@/types/scene";
import type { TransitionRuntimeState } from "@/types/transition";

interface SceneViewportProps {
  scene: SceneState;
  worldProgress: WorldProgressV1;
  transition: TransitionRuntimeState;
  dispatch: (event: SceneEvent) => void;
}

export function SceneViewport({
  scene,
  worldProgress,
  transition,
  dispatch,
}: SceneViewportProps) {
  // The default boot path resolves to greeting immediately. Rendering the same
  // visual shell on the server avoids a full-viewport swap during hydration.
  if (scene.sceneId === "boot") {
    return (
      <IntroScene
        sceneId="intro-greeting"
        chooniIntent="greet"
        transition={transition}
        dispatch={dispatch}
      />
    );
  }

  if (isProloguePhase(scene.sceneId)) {
    return (
      <IntroScene
        sceneId={scene.sceneId}
        chooniIntent={scene.requestedChooniIntent}
        transition={transition}
        dispatch={dispatch}
      />
    );
  }

  if (scene.sceneId === "world-overview" || scene.sceneId === "island-focus") {
    return (
      <WorldScene
        scene={scene}
        worldProgress={worldProgress}
        transition={transition}
        dispatch={dispatch}
      />
    );
  }

  if (scene.sceneId === "island-entry" && scene.focusedIslandId === "harubareun") {
    return (
      <HarubareunProjectDetail
        transition={transition}
        onBackToWorld={() => dispatch({ type: "BACK_TO_WORLD" })}
        onBackToFocus={() => dispatch({ type: "BACK_TO_FOCUS" })}
      />
    );
  }

  if (scene.sceneId === "island-entry" && scene.focusedIslandId === "project-02") {
    return (
      <InvaderProjectDetail
        transition={transition}
        onBackToFocus={() => dispatch({ type: "BACK_TO_FOCUS" })}
        onBackToWorld={() => dispatch({ type: "BACK_TO_WORLD" })}
      />
    );
  }

  if (scene.sceneId === "island-entry" && scene.focusedIslandId === "fitmate") {
    return (
      <FitMateProjectDetail
        transition={transition}
        onBackToFocus={() => dispatch({ type: "BACK_TO_FOCUS" })}
        onBackToWorld={() => dispatch({ type: "BACK_TO_WORLD" })}
      />
    );
  }

  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-50">
      {scene.focusedIslandId && (
        <ProjectDetailNavigation
          projectName={getIslandRegion(scene.focusedIslandId).projectName}
          disabled={scene.phase !== "active"}
          onBackToFocus={() => dispatch({ type: "BACK_TO_FOCUS" })}
          onBackToWorld={() => dispatch({ type: "BACK_TO_WORLD" })}
        />
      )}
      <section className="mx-auto w-full max-w-xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          Foundation scene
        </p>
        <h1 className="mt-2 text-2xl font-semibold">{scene.sceneId}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Case Study content is not available yet.
        </p>
        <div className="mt-6 flex gap-4">
          {scene.sceneId === "island-entry" && (
            <button type="button" disabled={scene.phase !== "active"} onClick={() => dispatch({ type: "START_CASE_STUDY" })}>
              OPEN CASE STUDY
            </button>
          )}
          <button type="button" disabled={scene.phase !== "active"} onClick={() => dispatch({ type: "BACK_TO_WORLD" })}>
            BACK TO WORLD
          </button>
        </div>
      </section>
    </main>
  );
}
