'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshWobbleMaterial, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function LaptopNode({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Laptop Base */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.6, 0.08, 1.1]} />
        <meshStandardMaterial color="#2E1F11" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Laptop Screen */}
      <mesh position={[0, 0.5, -0.5]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1.5, 0.9, 0.05]} />
        <meshStandardMaterial color="#A48457" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Glow Display */}
      <mesh position={[0, 0.5, -0.47]} rotation={[0.2, 0, 0]}>
        <planeGeometry args={[1.4, 0.8]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function ServerRackNode({ position }: { position: [number, number, number] }) {
  const rackRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (rackRef.current) {
      rackRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={rackRef} position={position}>
      {/* Server Tower */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.0, 2.2, 1.0]} />
        <meshStandardMaterial color="#16130E" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* LED Blinking Nodes */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.51]}>
          <planeGeometry args={[0.8, 0.15]} />
          <meshBasicMaterial color={idx % 2 === 0 ? '#10B981' : '#F59E0B'} />
        </mesh>
      ))}
    </group>
  );
}

function DataCardNode({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={position}>
      <mesh>
        <boxGeometry args={[2.0, 1.0, 0.1]} />
        <MeshWobbleMaterial color="#4D361F" factor={0.1} speed={1} roughness={0.3} metalness={0.5} />
      </mesh>
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.18}
        color="#FAF8F5"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {label}
      </Text>
    </Float>
  );
}

export default function EcosystemCanvas() {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!mounted) return <div className="h-[450px] w-full bg-surface-dark animate-pulse rounded-2xl" />;

  if (!webglSupported) {
    return (
      <div className="h-[450px] w-full bg-surface-dark border border-surface-border rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-800/40 border border-chd-gold flex items-center justify-center mb-4">
          <span className="text-3xl">🏛️</span>
        </div>
        <h3 className="text-xl font-bold text-brand-100">Chandigarh IT Procurement Ecosystem</h3>
        <p className="text-sm text-surface-muted max-w-md mt-2">
          Interactive 3D view rendered in lightweight mode for your browser. Verified e-Procurement tenders & market sources active.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[450px] w-full relative rounded-2xl overflow-hidden border border-surface-border bg-gradient-to-b from-surface-dark via-brand-950 to-surface-dark">
      <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FAF8F5" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#D4AF37" />

        <Sparkles count={80} scale={10} size={2} speed={0.4} color="#D4AF37" />

        <LaptopNode position={[-2.2, 0, 0]} />
        <ServerRackNode position={[2.2, 0.2, -0.5]} />

        <DataCardNode position={[0, 1.2, 0]} label="Chandigarh e-Tenders\netenders.chd.nic.in" />
        <DataCardNode position={[0, -1.0, 0]} label="Verified Sector 20 Market\nIndicative Budget Engine" />

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} />
      </Canvas>

      {/* Overlay Badge */}
      <div className="absolute bottom-4 left-4 bg-surface-card/90 backdrop-blur-md border border-chd-gold/30 px-3 py-1.5 rounded-lg text-xs font-mono text-chd-gold flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-chd-emerald animate-ping" />
        <span>3D Ecosystem Active • Chandigarh Target Zone</span>
      </div>
    </div>
  );
}
