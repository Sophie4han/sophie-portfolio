/** Reset the document and a scene's own scroll area, if it has one. */
export function resetNavigationScroll(sceneRoot?: HTMLElement | null) {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  if (!sceneRoot) return;
  const overflowY = window.getComputedStyle(sceneRoot).overflowY;
  if (sceneRoot.scrollHeight > sceneRoot.clientHeight && /^(auto|scroll)$/.test(overflowY)) {
    sceneRoot.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
}
