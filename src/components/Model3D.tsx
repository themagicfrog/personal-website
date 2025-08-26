'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function Model({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { scene } = useGLTF('/magicfrog.glb');
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      const targetRotationY = (mousePosition.x - 0.5) * Math.PI * 0.3;
      const targetRotationX = (mousePosition.y - 0.5) * Math.PI * 0.15;
      
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.02;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <group ref={meshRef} scale={0.8} position={[0, -1.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function Model3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Model mousePosition={mousePosition} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
