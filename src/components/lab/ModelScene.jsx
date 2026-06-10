import { Suspense, useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import usePageVisibility from '../../hooks/usePageVisibility';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
  Center,
  Grid,
} from '@react-three/drei';
import { DRACO_DECODER } from '../../data/demoModels';

useGLTF.setDecoderPath(DRACO_DECODER);

const ENV_PRESETS = {
  studio: 'studio',
  sunset: 'sunset',
  city: 'city',
  warehouse: 'warehouse',
  dawn: 'dawn',
  night: 'night',
  forest: 'forest',
  apartment: 'apartment',
};

function countPolygons(object) {
  let count = 0;
  object.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const pos = child.geometry.attributes.position;
      if (pos) count += pos.count / 3;
    }
  });
  return Math.round(count);
}

function collectMaterials(object) {
  const names = new Set();
  object.traverse((child) => {
    if (child.isMesh && child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m) => {
        if (m?.name) names.add(m.name);
        else if (m?.type) names.add(m.type);
      });
    }
  });
  return [...names];
}

function LoadedModel({
  url,
  wireframe,
  exploded,
  onStats,
}) {
  const group = useRef();
  const { scene } = useGLTF(url);

  useEffect(() => {
    if (!scene) return;
    onStats?.({
      polycount: countPolygons(scene),
      materials: collectMaterials(scene),
    });
  }, [scene, onStats]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          m.wireframe = wireframe;
          m.needsUpdate = true;
        });
      }
    });
  }, [scene, wireframe]);

  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!group.current) return;
    let i = 0;
    group.current.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData.basePos) {
          child.userData.basePos = child.position.clone();
        }
        if (exploded) {
          const offset = (i - 2) * 0.12;
          child.position.set(
            child.userData.basePos.x + offset,
            child.userData.basePos.y + offset * 0.5,
            child.userData.basePos.z + offset * 0.3
          );
        } else {
          child.position.copy(child.userData.basePos);
        }
        i += 1;
      }
    });
  }, [exploded, clone]);

  return (
    <group ref={group}>
      <Center>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

function CameraRig({ autoRotate, resetToken }) {
  const { camera } = useThree();
  const controls = useRef();

  useEffect(() => {
    camera.position.set(2.5, 1.8, 3.2);
    camera.lookAt(0, 0, 0);
    if (controls.current) {
      controls.current.target.set(0, 0, 0);
      controls.current.update();
    }
  }, [resetToken, camera]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
      minDistance={0.5}
      maxDistance={20}
      enablePan
      enableZoom
    />
  );
}

function SceneContent({
  modelUrl,
  envPreset,
  wireframe,
  exploded,
  showGrid,
  ambientIntensity,
  directionalIntensity,
  autoRotate,
  resetToken,
  annotations,
  onStats,
}) {
  const preset = ENV_PRESETS[envPreset] || 'studio';

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[5, 8, 5]} intensity={directionalIntensity} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={directionalIntensity * 0.35} />

      <Suspense fallback={null}>
        <LoadedModel
          url={modelUrl}
          wireframe={wireframe}
          exploded={exploded}
          onStats={onStats}
        />
        <Environment preset={preset} background={false} />
        <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={12} blur={2.5} />
      </Suspense>

      {showGrid && <Grid infiniteGrid fadeDistance={30} cellColor="#ffffff08" sectionColor="#3dd68c22" />}

      {annotations?.map((ann, i) => (
        <Html key={i} position={ann.position || [0, 1, 0]} center distanceFactor={8}>
          <div className="lab-annotation">{ann.label}</div>
        </Html>
      ))}

      <CameraRig autoRotate={autoRotate} resetToken={resetToken} />
    </>
  );
}

function ViewerFallback() {
  return (
    <div className="lab-viewer-fallback">
      <div className="lab-spinner" />
      <span className="type-label">Loading 3D asset…</span>
    </div>
  );
}

export default function ModelScene({
  modelUrl,
  envPreset = 'studio',
  wireframe = false,
  exploded = false,
  showGrid = false,
  ambientIntensity = 0.35,
  directionalIntensity = 1.2,
  autoRotate = true,
  resetToken = 0,
  annotations = [],
  onStats,
  className = '',
  active = true,
}) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pageVisible = usePageVisibility();
  const shouldRender = active && pageVisible;

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  if (!modelUrl) {
    return (
      <div className={`lab-viewer-empty ${className}`}>
        <span className="type-label">Select a model to preview</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`lab-viewer-canvas-wrap ${isFullscreen ? 'is-fullscreen' : ''} ${className}`}>
      <Suspense fallback={<ViewerFallback />}>
        <Canvas
          frameloop={shouldRender ? 'always' : 'never'}
          shadows
          dpr={[1, 1.5]}
          camera={{ fov: 42, near: 0.1, far: 100 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
          className="lab-canvas"
        >
          <color attach="background" args={['#050508']} />
          <fog attach="fog" args={['#050508', 8, 24]} />
          <SceneContent
            modelUrl={modelUrl}
            envPreset={envPreset}
            wireframe={wireframe}
            exploded={exploded}
            showGrid={showGrid}
            ambientIntensity={ambientIntensity}
            directionalIntensity={directionalIntensity}
            autoRotate={autoRotate}
            resetToken={resetToken}
            annotations={annotations}
            onStats={onStats}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
