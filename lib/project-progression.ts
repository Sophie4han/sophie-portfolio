import {
  PROJECT_SEQUENCE,
  type JourneyProjectStatus,
  type ProjectId,
} from "../types/game";

export interface ProjectProgression {
  statuses: Readonly<Record<ProjectId, JourneyProjectStatus>>;
  completedProjectIds: readonly ProjectId[];
  nextAvailableProjectId: ProjectId | null;
  progress: number;
  total: number;
  worldCompleted: boolean;
}

/**
 * Resolves Game Journey progression only. Content availability for `/projects`
 * and direct Case Study URLs is intentionally outside this model.
 * Only the completed prefix is accepted, so malformed data cannot unlock a
 * later island by skipping its prerequisite.
 */
export function resolveProjectProgression(
  completedProjectIds: readonly ProjectId[],
  activeProjectId: ProjectId | null = null,
): ProjectProgression {
  const recordedCompletions = new Set(completedProjectIds);
  const sequentialCompletions: ProjectId[] = [];

  for (const projectId of PROJECT_SEQUENCE) {
    if (!recordedCompletions.has(projectId)) break;
    sequentialCompletions.push(projectId);
  }

  const nextAvailableProjectId =
    PROJECT_SEQUENCE[sequentialCompletions.length] ?? null;
  const completedSet = new Set(sequentialCompletions);

  const statuses = Object.fromEntries(
    PROJECT_SEQUENCE.map((projectId): [ProjectId, JourneyProjectStatus] => {
      if (completedSet.has(projectId)) return [projectId, "completed"];
      if (projectId === nextAvailableProjectId) {
        return [projectId, activeProjectId === projectId ? "active" : "available"];
      }
      return [projectId, "locked"];
    }),
  ) as Record<ProjectId, JourneyProjectStatus>;

  return {
    statuses,
    completedProjectIds: sequentialCompletions,
    nextAvailableProjectId,
    progress: sequentialCompletions.length,
    total: PROJECT_SEQUENCE.length,
    worldCompleted: sequentialCompletions.length === PROJECT_SEQUENCE.length,
  };
}
