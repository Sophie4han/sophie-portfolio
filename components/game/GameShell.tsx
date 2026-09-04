import { resolveProjectProgression } from "@/lib/project-progression";
import { INITIAL_SCENE_STATE, type WorldProgressV1 } from "@/types/game";

const INITIAL_WORLD_PROGRESS: WorldProgressV1 = {
  version: 1,
  introCompleted: false,
  completedProjectIds: [],
  updatedAt: "",
};

/** Step 01 foundation: no SceneManager, renderer, persistence, or motion yet. */
export function GameShell() {
  const progression = resolveProjectProgression(
    INITIAL_WORLD_PROGRESS.completedProjectIds,
  );

  return (
    <main className="flex min-h-svh items-center justify-center bg-white px-6 py-12 text-zinc-950">
      <section
        aria-labelledby="game-shell-title"
        className="w-full max-w-2xl border border-dashed border-zinc-400 p-6"
        data-camera-preset={INITIAL_SCENE_STATE.cameraPreset}
        data-scene={INITIAL_SCENE_STATE.sceneId}
      >
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Development foundation · Step 01
        </p>
        <h1 id="game-shell-title" className="mt-2 text-2xl font-semibold">
          MOVE ON GameShell
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600">
          SceneManager and WorldRenderer will connect here in later approved
          steps. No game visuals or motion are mounted.
        </p>
        <dl className="mt-6 grid gap-3 font-mono text-sm sm:grid-cols-3">
          <div>
            <dt className="text-zinc-500">Initial scene</dt>
            <dd>{INITIAL_SCENE_STATE.sceneId}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Progress</dt>
            <dd>{progression.progress} / {progression.total}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">World complete</dt>
            <dd>{String(progression.worldCompleted)}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
