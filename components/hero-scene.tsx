"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Accent colours the particle field can take. Kept in sync with the hero
// slides by eye — the scene is decorative, so an exact match is not required.
const PARTICLE_COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#EC4899"];
const PARTICLE_COUNT = 100;

const HeroScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // The whole scene is ambient decoration. Anyone who has asked their OS to
    // reduce motion gets nothing at all — that also skips loading a WebGL
    // context and an rAF loop on the machines least able to afford them.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    // A WebGL context can fail to allocate (blocklisted driver, too many live
    // contexts, low memory). Losing the decoration is fine; crashing the hero
    // is not.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    renderer.setSize(container.clientWidth, container.clientHeight);
    // Uncapped devicePixelRatio means 3x3 = 9x the fragments to shade on a
    // modern phone, for a blurred background nobody looks at.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particles = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    // One material per colour, shared across meshes, instead of 100 clones.
    const materials = PARTICLE_COLORS.map(
      (color) => new THREE.MeshBasicMaterial({ color: new THREE.Color(color) })
    );

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const mesh = new THREE.Mesh(geometry, materials[i % materials.length]);
      mesh.position.x = (Math.random() - 0.5) * 10;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = (Math.random() - 0.5) * 10;
      particles.add(mesh);
    }
    scene.add(particles);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    // Stop burning GPU while the tab is in the background.
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!frameId) {
        animate();
      }
    };

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    animate();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(frameId);

      // Three.js holds GPU resources outside the JS heap, so every geometry,
      // material and the context itself has to be released by hand.
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 -z-10" />
  );
};

export default HeroScene;
