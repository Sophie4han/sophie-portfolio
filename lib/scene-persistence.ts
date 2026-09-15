import { PROJECT_SEQUENCE, type ProjectId, type SceneId } from "@/types/game";

const STORAGE_KEY = "move-on:journey-scene:v1";

const RESTORABLE_SCENES = [
  "intro-greeting",
  "intro-follow",
  "intro-gate",
  "enter-world",
  "world-overview",
  "island-focus",
  "island-entry",
] as const satisfies readonly SceneId[];

type RestorableSceneId = (typeof RESTORABLE_SCENES)[number];

const DETAIL_SECTIONS: Readonly<Record<ProjectId, readonly string[]>> = {
  harubareun: ["strategy", "product", "commerce", "go-to-market", "final-overview"],
  "project-02": ["value", "experience", "signal"],
  fitmate: ["contribution", "validation", "foundation"],
};

interface JourneySnapshot {
  version: 1;
  sceneId: RestorableSceneId;
  projectId: ProjectId | null;
  detailSectionId: string | null;
}

const WORLD_FALLBACK: JourneySnapshot = {
  version: 1,
  sceneId: "world-overview",
  projectId: null,
  detailSectionId: null,
};

export function loadJourneySnapshot(): JourneySnapshot | null {
  if (typeof window === "undefined") return null;

  const stored = window.sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const value: unknown = JSON.parse(stored);
    return isJourneySnapshot(value) ? value : WORLD_FALLBACK;
  } catch {
    return WORLD_FALLBACK;
  }
}

export function saveSceneSnapshot(sceneId: SceneId, projectId: ProjectId | null) {
  if (typeof window === "undefined" || !isRestorableScene(sceneId)) return;

  const current = loadJourneySnapshot();
  const detailSectionId =
    sceneId === "island-entry" && current?.projectId === projectId
      ? current.detailSectionId
      : null;

  writeSnapshot({ version: 1, sceneId, projectId, detailSectionId });
}

export function loadDetailSection<T extends string>(
  projectId: ProjectId,
  validSections: readonly T[],
): T | null {
  const snapshot = loadJourneySnapshot();
  if (
    snapshot?.sceneId !== "island-entry" ||
    snapshot.projectId !== projectId ||
    snapshot.detailSectionId === null
  ) {
    return null;
  }

  return validSections.includes(snapshot.detailSectionId as T)
    ? (snapshot.detailSectionId as T)
    : null;
}

export function saveDetailSection(projectId: ProjectId, detailSectionId: string | null) {
  if (typeof window === "undefined") return;

  const snapshot = loadJourneySnapshot();
  if (snapshot?.sceneId !== "island-entry" || snapshot.projectId !== projectId) return;

  writeSnapshot({ ...snapshot, detailSectionId });
}

function writeSnapshot(snapshot: JourneySnapshot) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function isJourneySnapshot(value: unknown): value is JourneySnapshot {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<JourneySnapshot>;
  if (
    candidate.version !== 1 ||
    !isRestorableScene(candidate.sceneId) ||
    !(candidate.projectId === null || isProjectId(candidate.projectId)) ||
    !(candidate.detailSectionId === null || typeof candidate.detailSectionId === "string")
  ) {
    return false;
  }

  const needsProject = candidate.sceneId === "island-focus" || candidate.sceneId === "island-entry";
  if (needsProject ? candidate.projectId === null : candidate.projectId !== null) return false;

  if (candidate.detailSectionId === null) return true;
  return (
    candidate.sceneId === "island-entry" &&
    candidate.projectId !== null &&
    DETAIL_SECTIONS[candidate.projectId].includes(candidate.detailSectionId)
  );
}

function isRestorableScene(sceneId: unknown): sceneId is RestorableSceneId {
  return typeof sceneId === "string" && (RESTORABLE_SCENES as readonly string[]).includes(sceneId);
}

function isProjectId(projectId: unknown): projectId is ProjectId {
  return typeof projectId === "string" && (PROJECT_SEQUENCE as readonly string[]).includes(projectId);
}
