'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

interface StarProps {
  position: [number, number, number];
}

function Star({ position }: StarProps) {
  const { scene } = useGLTF('/star.glb');
  const meshRef = useRef<THREE.Group>(null);
  const [fallSpeed] = useState(Math.random() * 0.02 + 0.01);
  const [spinSpeed] = useState(Math.random() * 0.02 + 0.01);
  const [initialX] = useState(position[0]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y -= fallSpeed;
      
      if (meshRef.current.position.y < -10) {
        meshRef.current.position.y = 10;
        meshRef.current.position.x = initialX;
      }

      meshRef.current.rotation.z += spinSpeed;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={[0.3, 0.3, 0.3]}>
      <primitive object={scene.clone()} />
    </group>
  );
}

function StarField() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * 20,
      Math.random() * 20 - 10,
      (Math.random() - 0.5) * 10
    ] as [number, number, number]
  }));

  return (
    <>
      {stars.map((star) => (
        <Star 
          key={star.id} 
          position={star.position} 
        />
      ))}
    </>
  );
}

export default function StarRain() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      pointerEvents: 'none',
      zIndex: 1
    }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          <StarField />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
