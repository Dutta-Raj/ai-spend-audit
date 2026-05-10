"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 200;
      posArray[i + 1] = (Math.random() - 0.5) * 100;
      posArray[i + 2] = (Math.random() - 0.5) * 100 - 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create gradient particles material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      color: 0x10b981,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating cubes
    const cubes: THREE.Mesh[] = [];
    const cubeColors = [0x8b5cf6, 0x10b981, 0x06b6d4, 0xec4899];
    
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const material = new THREE.MeshStandardMaterial({
        color: cubeColors[Math.floor(Math.random() * cubeColors.length)],
        emissive: 0x1a1a2e,
        roughness: 0.3,
        metalness: 0.7,
      });
      const cube = new THREE.Mesh(geometry, material);
      
      cube.position.x = (Math.random() - 0.5) * 80;
      cube.position.y = (Math.random() - 0.5) * 50;
      cube.position.z = (Math.random() - 0.5) * 60 - 30;
      
      scene.add(cube);
      cubes.push(cube);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 2, 1);
    scene.add(directionalLight);
    
    // Add point light for glow
    const pointLight = new THREE.PointLight(0x10b981, 0.5, 100);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);

    camera.position.z = 30;
    camera.position.y = 5;

    // Animation
    let time = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.005;
      
      // Rotate particles
      particlesMesh.rotation.y = time * 0.1;
      particlesMesh.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      // Animate cubes
      cubes.forEach((cube, idx) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.015;
        cube.position.y += Math.sin(time + idx) * 0.003;
      });
      
      // Animate point light
      pointLight.intensity = 0.5 + Math.sin(time * 2) * 0.2;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
