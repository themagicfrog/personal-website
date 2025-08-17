'use client';

import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/cat.glb');

function Model({ url, mousePosition }: { url: string; mousePosition: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const originalScaleRef = useRef<number>(1);
  
  const gltf = useGLTF(url);
  const scene = gltf?.scene || null;
  
  useEffect(() => {
    if (scene) {
      try {
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
      } catch (error) {
        console.error('Failed to setup model:', error);
      }
    }
  }, [scene]);
  
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

  if (!scene) {
    return null;
  }

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
  const [isClient, setIsClient] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
  
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [retryCount]);
  
  if (!isClient) {
    return (
      <div style={{ 
        width: '500px', 
        height: '420px', 
        margin: '1rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '1rem'
      }}>
        loading 3D model...
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div style={{ 
        width: '500px', 
        height: '420px', 
        margin: '1rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '1rem',
        textAlign: 'center'
      }}>
        <div>
          <p>3D model failed to load</p>
          <button 
            onClick={() => {
              setHasError(false);
              setRetryCount(prev => prev + 1);
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ width: '500px', height: '420px', margin: '1rem auto', position: 'relative' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          fontSize: '1rem',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          Loading 3D model...
        </div>
      )}
      
      <Suspense fallback={null}>
        <ErrorBoundary 
          onError={() => {
            console.log('3D model error, retrying...');
            setHasError(true);
          }}
          key={retryCount}
        >
          <Canvas 
            camera={{ position: [0, 15, 45], fov: 20 }} 
            style={{ background: 'transparent' }}
            onCreated={() => setIsLoading(false)}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-5, -5, -5]} intensity={0.3} />
            <Model key={`${modelPath}-${retryCount}`} url={modelPath} mousePosition={mousePosition} />
          </Canvas>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) { 
      return null; 
    }

    return this.props.children;
  }
}
