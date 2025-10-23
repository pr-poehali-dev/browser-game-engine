import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';

type GameObject = {
  id: string;
  name: string;
  type: 'cube' | 'sphere' | 'light' | 'camera';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
};

type Scene3DProps = {
  objects: GameObject[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

function SceneObject({ obj, isSelected, onSelect }: { obj: GameObject; isSelected: boolean; onSelect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && obj.type === 'cube') {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.001;
    }
  });

  if (obj.type === 'light') {
    return (
      <directionalLight
        position={[obj.position.x, obj.position.y, obj.position.z]}
        intensity={1}
        castShadow
      />
    );
  }

  if (obj.type === 'camera') {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={[obj.position.x, obj.position.y, obj.position.z]}
      rotation={[
        obj.rotation.x * Math.PI / 180,
        obj.rotation.y * Math.PI / 180,
        obj.rotation.z * Math.PI / 180
      ]}
      scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      {obj.type === 'cube' ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : (
        <sphereGeometry args={[0.5, 32, 32]} />
      )}
      <meshStandardMaterial
        color={isSelected ? '#0EA5E9' : hovered ? '#4EC9B0' : obj.type === 'cube' ? '#007ACC' : '#4EC9B0'}
        emissive={isSelected || hovered ? '#007ACC' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
      />
    </mesh>
  );
}

const Scene3D = ({ objects, selectedId, onSelect }: Scene3DProps) => {
  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ background: 'radial-gradient(circle at 50% 50%, hsl(0 0% 15%) 0%, hsl(0 0% 9.4%) 100%)' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#303030"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#404040"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid
      />

      {objects.map(obj => (
        <SceneObject
          key={obj.id}
          obj={obj}
          isSelected={obj.id === selectedId}
          onSelect={() => onSelect(obj.id)}
        />
      ))}

      <OrbitControls makeDefault />
      
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#007ACC', '#4EC9B0', '#C586C0']} labelColor="white" />
      </GizmoHelper>
    </Canvas>
  );
};

export default Scene3D;
