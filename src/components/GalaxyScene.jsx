import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import { useResponsive } from '../context/ResponsiveProvider';
import usePageVisibility from '../hooks/usePageVisibility';

const EMERALD = '#3dd68c';
const CYAN = '#6ec4d4';
const CORE = '#5bc492';

function buildGalaxy(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const emerald = new THREE.Color(EMERALD);
  const cyan = new THREE.Color(CYAN);
  const white = new THREE.Color('#e8f0ec');
  const core = new THREE.Color(CORE);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const arm = Math.floor(Math.random() * 3);
    const armAngle = (arm / 3) * Math.PI * 2;
    const radius = Math.pow(Math.random(), 0.48) * 9;
    const branchAngle = armAngle + radius * 1.25;

    positions[i3] = Math.cos(branchAngle) * radius + (Math.random() - 0.5) * 0.45;
    positions[i3 + 1] = (Math.random() - 0.5) * 0.35;
    positions[i3 + 2] = Math.sin(branchAngle) * radius + (Math.random() - 0.5) * 0.45;

    const mixed = new THREE.Color();
    if (radius < 1.8) mixed.lerpColors(core, emerald, radius / 1.8);
    else if (radius < 4.5) mixed.lerpColors(emerald, cyan, (radius - 1.8) / 2.7);
    else mixed.lerpColors(cyan, white, Math.min((radius - 4.5) / 4, 1));

    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }
  return { positions, colors };
}

function buildStars(count) {
  const starPositions = new Float32Array(count * 3);
  const starColors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 90;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 90;
    starPositions[i3 + 2] = (Math.random() - 0.5) * 90;
    const b = Math.random() * 0.5 + 0.15;
    starColors[i3] = b * 0.9;
    starColors[i3 + 1] = b;
    starColors[i3 + 2] = b * 0.95;
  }
  return { starPositions, starColors };
}

const galaxyMat = new THREE.PointsMaterial({
  size: 0.04,
  sizeAttenuation: true,
  vertexColors: true,
  transparent: true,
  opacity: 0.92,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const starMat = new THREE.PointsMaterial({
  size: 0.06,
  sizeAttenuation: true,
  vertexColors: true,
  transparent: true,
  opacity: 0.45,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

function GalaxyCore({ mouse, galaxyCount, starCount, ringCount, ringPoints, lite }) {
  const galaxyRef = useRef();
  const ringRef = useRef();
  const { positions, colors } = useMemo(() => buildGalaxy(galaxyCount), [galaxyCount]);
  const { starPositions, starColors } = useMemo(() => buildStars(starCount), [starCount]);
  const ringPos = useMemo(() => {
    const n = ringPoints;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = 2.2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    return pos;
  }, [ringPoints]);

  const ringMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.08,
        color: EMERALD,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = t * 0.028;
      if (!lite && mouse?.current) {
        const targetX = mouse.current.y * 0.12;
        galaxyRef.current.rotation.x += (targetX - galaxyRef.current.rotation.x) * 0.012;
      }
    }
    if (ringRef.current) ringRef.current.rotation.y = t * 0.1;
  });

  return (
    <>
      <points material={starMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
      </points>
      <points ref={galaxyRef} material={galaxyMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
      </points>
      {ringCount > 0 && (
        <points ref={ringRef} material={ringMat}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ringPos, 3]} />
          </bufferGeometry>
        </points>
      )}
    </>
  );
}

function CameraRig({ mouse, lite }) {
  const { camera } = useThree();
  useFrame(() => {
    if (lite || !mouse?.current) return;
    camera.position.x += (mouse.current.x * 0.2 - camera.position.x) * 0.012;
    camera.position.y += (-mouse.current.y * 0.12 - camera.position.y) * 0.012;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function GalaxyScene({ mouse }) {
  const { particles, reduceEffects } = useResponsive();
  const pageVisible = usePageVisibility();

  if (particles.galaxy === 0 && particles.stars === 0) return null;

  return (
    <div className="fixed inset-0 z-0 galaxy-scene" aria-hidden>
      <Canvas
        frameloop={pageVisible ? 'always' : 'never'}
        camera={{ position: [0, 0.8, 12], fov: 74, near: 0.1, far: 200 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'default',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
        dpr={particles.dpr}
      >
        <color attach="background" args={['#050508']} />
        <fog attach="fog" args={['#050508', 14, 85]} />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <GalaxyCore
          mouse={mouse}
          galaxyCount={particles.galaxy}
          starCount={particles.stars}
          ringCount={particles.ringCount}
          ringPoints={particles.ringPoints}
          lite={particles.lite || reduceEffects}
        />
        <CameraRig mouse={mouse} lite={particles.lite || reduceEffects} />
      </Canvas>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 52%, rgba(45,160,110,0.06) 0%, transparent 58%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none vignette" />
    </div>
  );
}
