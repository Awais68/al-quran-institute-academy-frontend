"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const HeroScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number>(0);

  // Define activeSlides data here or pass it as a prop
  const activeSlides = [
    { color: "#3B82F6" }, // blue-500
    { color: "#10B981" }, // emerald-500
    { color: "#8B5CF6" }, // violet-500
    { color: "#EC4899" }, // pink-500
  ];
  const currentSlide = 0; // This should come from props or context

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Position camera
    camera.position.z = 5;

    // Create particles
    const particles = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activeSlides[currentSlide].color),
    });
    const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    // Create a grid of particles
    for (let i = 0; i < 100; i++) {
      const mesh = new THREE.Mesh(geo, material.clone());
      mesh.position.x = (Math.random() - 0.5) * 10;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = (Math.random() - 0.5) * 10;
      particles.add(mesh);
    }

    scene.add(particles);

    // Animation function
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.001;
        particlesRef.current.rotation.y += 0.001;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    particlesRef.current = particles;

    animate();

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (containerRef.current && rendererRef.current?.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [currentSlide]);

  return <div ref={containerRef} className="absolute inset-0 -z-10" />;
};

export default HeroScene;