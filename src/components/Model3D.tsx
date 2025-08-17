'use client';

import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, mousePosition }: { url: string; mousePosition: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const originalScaleRef = useRef<number>(1);
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 0.015 / Math.max(size.x, size.y, size.z);
      
      scene.position.sub(center);
      scene.position.y -= 5.75;
      scene.scale.setScalar(scale);
      scene.rotation.x = Math.PI;
      
      originalScaleRef.current = scale;
      setIsPulsing(false);
    }
  }, [scene, url]);
  
  useFrame((state) => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.y += (-mousePosition.x * 0.3 + Math.PI / 2 - meshRef.current.rotation.y) * 0.03;
      meshRef.current.rotation.x += (Math.PI - mousePosition.y * 0.2 - meshRef.current.rotation.x) * 0.03;
      
      if (isPulsing) {
        meshRef.current.scale.setScalar(originalScaleRef.current * (1 + Math.sin(state.clock.elapsedTime * 10) * 0.1));
      } else {
        meshRef.current.scale.setScalar(originalScaleRef.current);
      }
    }
  });

  return (
    <primitive 
      ref={meshRef}
      object={scene} 
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => {
        setIsDragging(false);
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1000);
      }}
      onPointerLeave={() => setIsDragging(false)}
    />
  );
}

export default function Model3D({ modelPath }: { modelPath: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div style={{ width: '500px', height: '420px', margin: '1rem auto' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas camera={{ position: [0, 15, 45], fov: 20 }} style={{ background: 'transparent' }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} />
          <Model key={modelPath} url={modelPath} mousePosition={mousePosition} />
        </Canvas>
      </Suspense>
    </div>
  );
}
