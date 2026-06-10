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
  const dim = new THREE.Color('#1a3d2e');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const armCount = 3;
    const arm = Math.floor(Math.random() * armCount);
    const armAngle = (arm / armCount) * Math.PI * 2;
    const radius = Math.pow(Math.random(), 0.48) * 9;
    const spinAngle = radius * 1.25;
    const branchAngle = armAngle + spinAngle;

    positions[i3] = Math.cos(branchAngle) * radius + (Math.random() - 0.5) * 0.45;
    positions[i3 + 1] = (Math.random() - 0.5) * 0.35;
    positions[i3 + 2] = Math.sin(branchAngle) * radius + (Math.random() - 0.5) * 0.45;

    const mixed = new THREE.Color();
    if (radius < 1.8) mixed.lerpColors(core, emerald, radius / 1.8);
    else if (radius < 4.5) mixed.lerpColors(emerald, cyan, (radius - 1.8) / 2.7);
    else mixed.lerpColors(cyan, white, Math.min((radius - 4.5) / 4, 1));
    if (Math.random() < 0.12) mixed.lerpColors(mixed, dim, 0.4);

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

function GalaxyParticles({ mouse, galaxyCount }) {
  const pointsRef = useRef();
  const { positions, colors } = useMemo(() => buildGalaxy(galaxyCount), [galaxyCount]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = t * 0.038;
    const breathe = Math.sin(t * 0.2) * 0.012 + 1;
    pointsRef.current.scale.setScalar(breathe);
    if (mouse.current) {
      const targetX = mouse.current.y * 0.22;
      pointsRef.current.rotation.x += (targetX - pointsRef.current.rotation.x) * 0.015;
    }
  });

  const galaxyMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.04,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  return (
    <points ref={pointsRef} material={galaxyMat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
    </points>
  );
}

function StarField({ starCount }) {
  const { starPositions, starColors } = useMemo(() => buildStars(starCount), [starCount]);
  const starMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.06,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  return (
    <points material={starMat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
      </bufferGeometry>
    </points>
  );
}

function OrbitalRing({ radius, speed, opacity = 0.15, pointCount = 120 }) {
  const ref = useRef();
  const points = useMemo(() => {
    const n = pointCount;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 2] = Math.sin(a) * radius;
    }
    return pos;
  }, [radius, pointCount]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.08,
        color: EMERALD,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [opacity]
  );

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * speed;
  });

  return (
    <points ref={ref} material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
    </points>
  );
}

function NebulaClouds({ count }) {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 6 + 0.5;
      positions[i3] = Math.cos(angle) * r;
      positions[i3 + 1] = (Math.random() - 0.5) * 1.5;
      positions[i3 + 2] = Math.sin(angle) * r;
      const c = Math.random() > 0.5 ? new THREE.Color(CYAN) : new THREE.Color(EMERALD);
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.7,
        vertexColors: true,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.018;
  });

  return (
    <points ref={ref} material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
    </points>
  );
}

function ForegroundDust({ mouse, count }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 + 2;
    }
    return pos;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.025,
        color: EMERALD,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.y = t * 0.05;
    if (mouse.current) {
      ref.current.position.x += (mouse.current.x * 0.4 - ref.current.position.x) * 0.02;
      ref.current.position.y += (mouse.current.y * 0.25 - ref.current.position.y) * 0.02;
    }
  });

  return (
    <points ref={ref} material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
}

function CameraController({ mouse, scrollY, reduceMotion }) {
  const { camera } = useThree();
  useFrame(() => {
    const lerp = reduceMotion ? 0.008 : 0.018;
    if (mouse.current) {
      camera.position.x += (mouse.current.x * 0.35 - camera.position.x) * lerp;
      camera.position.y += (-mouse.current.y * 0.22 - camera.position.y) * lerp;
    }
    const targetZ = 12 + (scrollY.current || 0) * 0.006;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const RINGS = [
  { radius: 2.2, speed: 0.12, opacity: 0.2 },
  { radius: 4.5, speed: -0.06, opacity: 0.1 },
  { radius: 6.8, speed: 0.04, opacity: 0.06 },
];

export default function GalaxyScene({ mouse, scrollY }) {
  const { particles, reduceMotion, reduceEffects } = useResponsive();
  const pageVisible = usePageVisibility();
  const fov = reduceEffects ? 78 : 72;

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        frameloop={pageVisible ? 'always' : 'never'}
        camera={{ position: [0, 0.8, 12], fov, near: 0.1, far: 200 }}
        gl={{
          antialias: !reduceEffects,
          alpha: false,
          powerPreference: reduceEffects ? 'default' : 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: reduceEffects ? 1 : 1.05,
        }}
        dpr={particles.dpr}
      >
        <color attach="background" args={['#050508']} />
        <fog attach="fog" args={['#050508', 14, 85]} />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.006} />
        <StarField starCount={particles.stars} />
        <GalaxyParticles mouse={mouse} galaxyCount={particles.galaxy} />
        {RINGS.slice(0, particles.ringCount).map((ring) => (
          <OrbitalRing
            key={ring.radius}
            radius={ring.radius}
            speed={ring.speed}
            opacity={ring.opacity}
            pointCount={particles.ringPoints}
          />
        ))}
        <NebulaClouds count={particles.nebula} />
        <ForegroundDust mouse={mouse} count={particles.dust} />
        <CameraController mouse={mouse} scrollY={scrollY} reduceMotion={reduceMotion} />
      </Canvas>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 52%, rgba(45,160,110,0.06) 0%, transparent 58%)',
          mixBlendMode: 'screen',
        }}
      />
      {!reduceEffects && (
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: `conic-gradient(from 180deg at 50% 50%, transparent, rgba(45,160,110,0.02), transparent, rgba(110,196,212,0.02), transparent)`,
          }}
        />
      )}
      <div className="absolute inset-0 pointer-events-none vignette" />
    </div>
  );
}
