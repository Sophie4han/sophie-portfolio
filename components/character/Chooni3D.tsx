"use client";

import { useEffect, useRef, useState } from "react";
import type { ChooniMotion } from "@/lib/chooni-motion";
import { CHOONI_BODY_PIVOT, CHOONI_MOTION as motion } from "@/lib/chooni-motion";
import styles from "./chooni-3d.module.css";

const MODEL_URL = "/models/chooni/chooni-25.glb";

interface Chooni3DProps {
  motion: ChooniMotion;
  reducedMotion: boolean;
  className?: string;
  entranceDelayMs?: number;
  greetingAfterLandingMs?: number;
  onReady?: () => void;
  onEntranceComplete?: () => void;
}

/** Reusable transparent GLB renderer. Placement is owned by the caller. */
export function Chooni3D({
  motion: state,
  reducedMotion,
  className,
  entranceDelayMs = 0,
  greetingAfterLandingMs = motion.greetingAfterLandingMs,
  onReady,
  onEntranceComplete,
}: Chooni3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ state, reducedMotion, changedAt: 0 });
  const entranceCallbackRef = useRef(onEntranceComplete);
  const readyCallbackRef = useRef(onReady);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    entranceCallbackRef.current = onEntranceComplete;
    readyCallbackRef.current = onReady;
  }, [onEntranceComplete, onReady]);

  useEffect(() => {
    const current = stateRef.current;
    if (current.state !== state) {
      current.state = state;
      current.changedAt = performance.now();
    }
    current.reducedMotion = reducedMotion;
  }, [state, reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let frame = 0;
    let entranceTimer = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let sceneObject: import("three").Object3D | null = null;

    async function mount() {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      if (disposed || !host) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-0.53, 0.53, 0.62, -0.62, 0.1, 10);
      camera.position.set(0, 0.5, 3);
      camera.lookAt(0, 0.5, 0);
      scene.add(new THREE.AmbientLight(0xfff1da, 1.5));
      const key = new THREE.DirectionalLight(0xffe8c5, 2.1);
      key.position.set(-2, 3, 4);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xffffff, 0.65);
      fill.position.set(3, 1, 2);
      scene.add(fill);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.setAttribute("aria-hidden", "true");
      // The root fixes scene placement. Only the inner turn group changes yaw.
      const root = new THREE.Group();
      const turnGroup = new THREE.Group();
      const poseGroup = new THREE.Group();
      const normalized = new THREE.Group();
      poseGroup.add(normalized);
      turnGroup.add(poseGroup);
      root.add(turnGroup);
      scene.add(root);

      const resize = () => {
        if (!renderer) return;
        const { width, height } = host.getBoundingClientRect();
        if (width > 0 && height > 0) renderer.setSize(width, height, false);
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
      if (disposed) return;
      sceneObject = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(sceneObject);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const unitScale = size.y > 0 ? 1 / size.y : 1;
      sceneObject.position.set(-CHOONI_BODY_PIVOT.x, -bounds.min.y, -CHOONI_BODY_PIVOT.z);
      normalized.scale.setScalar(unitScale);
      normalized.add(sceneObject);
      // Offset the fixed turn axis so the front-facing placement is unchanged.
      turnGroup.position.set(
        (CHOONI_BODY_PIVOT.x - center.x) * unitScale,
        0,
        (CHOONI_BODY_PIVOT.z - center.z) * unitScale,
      );

      let last = performance.now();
      const mountedAt = last;
      if (stateRef.current.changedAt === 0) stateRef.current.changedAt = mountedAt;
      const tick = (now: number) => {
        if (disposed || !renderer) return;
        const delta = Math.min((now - last) / 1000, 0.05);
        last = now;
        const { state, reducedMotion, changedAt } = stateRef.current;
        const elapsed = Math.max(0, now - changedAt);
        const ease = 1 - Math.exp(-motion.lerpSpeed * delta);
        const t = now / 1000;
        const quiet = reducedMotion ? 0 : 1;
        const enter = Math.max(0, Math.min(1, 1 - (now - mountedAt - entranceDelayMs) / motion.enterMs));
        const happy = state === "happy" ? Math.max(0, 1 - elapsed / motion.happyMs) : 0;
        const greet = state === "greeting" ? Math.max(0, 1 - elapsed / motion.greetingMs) : 0;
        const leave = state === "departure" ? Math.min(1, elapsed / motion.departureMs) : 0;
        const portal = state === "portal-reaction" || state === "departure";
        const turnProgress = state === "departure" ? 1 : Math.min(1,
          Math.max(0, elapsed - motion.portalTurnDelayMs) / motion.portalTurnMs);
        const easedTurn = turnProgress * turnProgress * (3 - 2 * turnProgress);
        const easedLeave = leave * leave * (3 - 2 * leave);
        const sway = portal ? 0 : quiet * motion.idleSwayRadians * Math.sin(t * 1.1);
        const breath = portal ? 0 : quiet * motion.idleBreath * Math.sin(t * 1.6);
        const greetingBounce = quiet * greet * motion.greetingBounce * Math.abs(Math.sin(elapsed / 160));
        const happyBounce = quiet * happy * motion.happyBounce * Math.abs(Math.sin(elapsed / 95));
        const departureHop = quiet * motion.departureHop * Math.sin(Math.PI * 2 * leave) ** 2;
        const targetY = quiet * enter * 0.16 + greetingBounce + happyBounce + departureHop;
        const targetScale = (1 - easedLeave * (1 - motion.departureScale)) *
          (1 + breath + quiet * happy * motion.happyScale * Math.abs(Math.sin(elapsed / 95)));

        poseGroup.position.y = THREE.MathUtils.lerp(poseGroup.position.y, targetY, ease);
        poseGroup.rotation.x = THREE.MathUtils.lerp(poseGroup.rotation.x, quiet * greet * motion.greetingLeanRadians, ease);
        turnGroup.rotation.y = portal ? motion.portalTurnRadians * easedTurn
          : THREE.MathUtils.lerp(turnGroup.rotation.y,
            quiet * greet * motion.greetingYawRadians * Math.sin(elapsed / 180), ease);
        poseGroup.rotation.z = THREE.MathUtils.lerp(poseGroup.rotation.z,
          sway + quiet * greet * motion.greetingTiltRadians * Math.sin(elapsed / 150), ease);
        poseGroup.scale.setScalar(THREE.MathUtils.lerp(poseGroup.scale.x, targetScale, ease));
        renderer.render(scene, camera);
        frame = requestAnimationFrame(tick);
      };
      poseGroup.position.y = stateRef.current.reducedMotion ? 0 : 0.16;
      renderer.render(scene, camera);
      host.appendChild(renderer.domElement);
      setReady(true);
      readyCallbackRef.current?.();
      entranceTimer = window.setTimeout(
        () => entranceCallbackRef.current?.(),
        stateRef.current.reducedMotion ? 80 : entranceDelayMs + motion.enterMs + greetingAfterLandingMs,
      );
      frame = requestAnimationFrame(tick);
    }

    void mount().catch(() => {
      if (disposed) return;
      if (readyCallbackRef.current) return;
      entranceTimer = window.setTimeout(
        () => entranceCallbackRef.current?.(),
        stateRef.current.reducedMotion ? 0 : motion.enterMs,
      );
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(entranceTimer);
      resizeObserver?.disconnect();
      if (sceneObject) {
        sceneObject.traverse((child) => {
          if (!("isMesh" in child) || !child.isMesh) return;
          const mesh = child as import("three").Mesh;
          mesh.geometry.dispose();
          for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            material.dispose();
          }
        });
      }
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [entranceDelayMs, greetingAfterLandingMs]);

  return <div className={className} role={ready ? "img" : undefined} aria-label={ready ? "Chooni, your guide" : undefined}>
    <div ref={hostRef} className={styles.canvasHost} aria-hidden="true" />
  </div>;
}
