import { SceneManager } from "@/components/game/SceneManager";

/** Step 01 foundation: no SceneManager, renderer, persistence, or motion yet. */
export function GameShell() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-white px-6 py-12 text-zinc-950">
      <section
        aria-labelledby="game-shell-title"
        className="w-full max-w-2xl border border-dashed border-zinc-400 p-6"
      >
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Development foundation · Step 01
        </p>
        <h1 id="game-shell-title" className="mt-2 text-2xl font-semibold">
          MOVE ON GameShell
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600">
          Scene state machine development controls. No game visuals, motion,
          camera animation, or WorldRenderer are mounted.
        </p>
        <div className="mt-6 border-t border-zinc-300 pt-6">
          <SceneManager />
        </div>
      </section>
    </main>
  );
}
