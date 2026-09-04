import { IntroScene, isProloguePhase } from "@/components/intro/IntroScene";
import { WorldScene } from "@/components/world/WorldScene";
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
        key={scene.sceneId}
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

  return (
    <main className="grid min-h-dvh place-items-center bg-zinc-950 px-6 py-12 text-zinc-50">
      <section className="w-full max-w-xl border border-dashed border-zinc-600 p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          Foundation scene
        </p>
        <h1 className="mt-2 text-2xl font-semibold">{scene.sceneId}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          The World Map begins in a later approved implementation step.
        </p>
      </section>
    </main>
  );
}
