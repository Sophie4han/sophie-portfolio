"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { saveDetailSection, saveSceneSnapshot } from "@/lib/scene-persistence";
import type { ProjectId } from "@/types/game";
import styles from "./home.module.css";

const GameShell = dynamic(() => import("@/components/game/GameShell").then((module) => module.GameShell), { ssr: false });

/** Adapter only: the original scene navigation and all detail content stay intact. */
export function ProjectEntry({ projectId }: { projectId?: ProjectId }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (projectId) {
      saveSceneSnapshot("island-entry", projectId);
      saveDetailSection(projectId, null);
    }
    // Mount the existing scene machine only after its entry snapshot is ready.
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [projectId]);
  return <div className={styles.detailEntry}>
    <Link className={styles.homeReturn} href="/#work">← HOME</Link>
    {ready ? <GameShell /> : <p role="status" className={styles.loading}>Opening selected work…</p>}
  </div>;
}
