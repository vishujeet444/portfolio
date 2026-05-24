import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';

// ─── Galaxy Core Particles — HELIOS Green Cosmic ─────────────────────────────
function GalaxyParticles({ mouse }) {
  const pointsRef = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const count = 14000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // HELIOS color palette: neon green + cyan + white
    const neonGreen = new THREE.Color('#00FF88');
    const cyanColor = new THREE.Color('#00E5FF');
    const whiteColor = new THREE.Color('#ffffff');
    const coreColor = new THREE.Color('#33FFAA');
    const dimGreen = new THREE.Color('#005533');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const armCount = 3;
      const arm = Math.floor(Math.random() * armCount);
      const armAngle = (arm / armCount) * Math.PI * 2;

      const radius = Math.pow(Math.random(), 0.5) * 8;
      const spinAngle = radius * 1.3;
      const branchAngle = armAngle + spinAngle;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.22;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;

      positions[i3]     = Math.cos(branchAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ;

      // Color mixing: green core → cyan mid → white edge
      const mixedColor = new THREE.Color();
      if (radius < 1.5) {
        mixedColor.lerpColors(coreColor, neonGreen, radius / 1.5);
      } else if (radius < 4) {
        mixedColor.lerpColors(neonGreen, cyanColor, (radius - 1.5) / 2.5);
      } else {
        mixedColor.lerpColors(cyanColor, whiteColor, (radius - 4) / 4);
      }

      // Dim green in arm gaps (adds depth)
      if (Math.random() < 0.15) {
        mixedColor.lerpColors(mixedColor, dimGreen, 0.5);
      }

      colors[i3]     = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      const distFromCenter = Math.sqrt(
        positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
      );
      sizes[i] = distFromCenter < 1 ? Math.random() * 4.5 + 2.5 : Math.random() * 2.5 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  // Background star field with slight green tint
  const { starPositions, starColors } = useMemo(() => {
    const count = 6000;
    const starPositions = new Float32Array(count * 3);
    const starColors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      starPositions[i3]     = (Math.random() - 0.5) * 100;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 100;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 100;
      const brightness = Math.random() * 0.6 + 0.2;
      // Slight green tint for 20% of stars
      if (Math.random() < 0.2) {
        starColors[i3]     = brightness * 0.5;
        starColors[i3 + 1] = brightness;
        starColors[i3 + 2] = brightness * 0.7;
      } else {
        starColors[i3]     = brightness;
        starColors[i3 + 1] = brightness;
        starColors[i3 + 2] = brightness;
      }
    }
    return { starPositions, starColors };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.045;
      const breathe = Math.sin(t * 0.25) * 0.015 + 1;
      pointsRef.current.scale.setScalar(breathe);

      if (mouse.current) {
        const targetX = mouse.current.y * 0.28;
        pointsRef.current.rotation.x += (targetX - pointsRef.current.rotation.x) * 0.018;
      }
    }
  });

  const starMaterial = useMemo(() =>
    new THREE.PointsMaterial({
      size: 0.07,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }), []);

  const galaxyMaterial = useMemo(() =>
    new THREE.PointsMaterial({
      size: 0.045,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }), []);

  return (
    <>
      <points material={starMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
      </points>
      <points ref={pointsRef} material={galaxyMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
      </points>
    </>
  );
}

// ─── Green Nebula Clouds ─────────────────────────────────────────────────────
function NebulaClouds() {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 5.5 + 0.5;
      positions[i3]     = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 1.8;
      positions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;

      // Green/cyan nebula color
      const isCyan = Math.random() > 0.55;
      if (isCyan) {
        // Cyan
        colors[i3] = 0.0; colors[i3 + 1] = 0.9; colors[i3 + 2] = 1.0;
      } else {
        // Neon green
        colors[i3] = 0.0; colors[i3 + 1] = 1.0; colors[i3 + 2] = 0.53;
      }
    }
    return { positions, colors };
  }, []);

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      size: 0.65,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.10,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }), []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.025;
    }
  });

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
    </points>
  );
}

// ─── Foreground Neon Dust ─────────────────────────────────────────────────────
function ForegroundDust({ mouse }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const count = 250;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 + 2;
    }
    return pos;
  }, []);

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      size: 0.03,
      color: '#00FF88',
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }), []);

  useFrame((state) => {
    if (ref.current && mouse.current) {
      ref.current.position.x += (mouse.current.x * 0.5 - ref.current.position.x) * 0.018;
      ref.current.position.y += (mouse.current.y * 0.3 - ref.current.position.y) * 0.018;
    }
  });

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
}

// ─── Camera Controller ────────────────────────────────────────────────────────
function CameraController({ mouse, scrollY }) {
  const { camera } = useThree();

  useFrame(() => {
    if (mouse.current) {
      camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.02;
    }
    const targetZ = 12 + (scrollY.current || 0) * 0.008;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Main HELIOS Galaxy Scene ─────────────────────────────────────────────────
export default function GalaxyScene({ mouse, scrollY }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1, 12], fov: 75, near: 0.1, far: 200 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, 1.5]}
      >
        {/* Deep cosmic void background */}
        <color attach="background" args={['#050508']} />
        <fog attach="fog" args={['#050508', 18, 90]} />

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.008} />

        <GalaxyParticles mouse={mouse} />
        <NebulaClouds />
        <ForegroundDust mouse={mouse} />
        <CameraController mouse={mouse} scrollY={scrollY} />
      </Canvas>

      {/* CSS post-processing: neon green bloom simulation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 55%, rgba(0,255,136,0.045) 0%, transparent 55%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Cyan accent glow from below */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 80%, rgba(0,229,255,0.025) 0%, transparent 45%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none vignette" />
    </div>
  );
}
