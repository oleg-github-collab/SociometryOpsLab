import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';

// Simplified 3D Node Component
function Node({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
}

// Simplified 3D Scene
function Scene() {
  // Mock data - in real implementation, this would come from the API
  const nodes = [
    { position: [0, 0, 0] as [number, number, number], color: '#6366f1', size: 1 },
    { position: [3, 2, 1] as [number, number, number], color: '#8b5cf6', size: 0.8 },
    { position: [-2, 1, 3] as [number, number, number], color: '#06b6d4', size: 0.9 },
    { position: [1, -2, 2] as [number, number, number], color: '#10b981', size: 0.7 },
    { position: [-3, 0, -2] as [number, number, number], color: '#f59e0b', size: 0.85 },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {nodes.map((node, i) => (
        <Node key={i} position={node.position} color={node.color} size={node.size} />
      ))}
    </>
  );
}

export default function Dashboard3D() {
  return (
    <div className="min-h-screen bg-bg-900">
      {/* Header */}
      <header className="glass border-b border-bg-600 absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">3D Team Space</h1>
              <p className="text-sm text-gray-400 mt-1">Interactive team visualization</p>
            </div>
            <a href="/dashboard" className="btn btn-ghost">
              ← Back
            </a>
          </div>
        </div>
      </header>

      {/* 3D Canvas */}
      <div className="w-full h-screen pt-20">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
          <OrbitControls enableDamping dampingFactor={0.05} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="glass px-6 py-3 rounded-full flex items-center space-x-4">
          <span className="text-sm text-gray-400">Drag to rotate • Scroll to zoom • Click node for details</span>
        </div>
      </motion.div>
    </div>
  );
}
