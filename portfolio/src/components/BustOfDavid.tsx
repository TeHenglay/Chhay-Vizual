import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Bounds, Center } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/bust-of-david.glb');

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/bust-of-david.glb');

export default function BustOfDavid() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2.5} />
      <directionalLight position={[-3, 2, -3]} intensity={0.8} />
      <Suspense fallback={null}>
        <Bounds fit clip observe damping={0}>
          <Center>
            <Model />
          </Center>
        </Bounds>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}
