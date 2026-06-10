import { useRef, useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useInView } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { fetchModels } from '../lib/modelsApi';
import { useResponsive } from '../context/ResponsiveProvider';

const ModelScene = lazy(() => import('./lab/ModelScene'));

const ENV_OPTIONS = [
  { id: 'studio', label: 'Studio' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'city', label: 'City' },
  { id: 'warehouse', label: 'Warehouse' },
  { id: 'night', label: 'Night' },
  { id: 'forest', label: 'Forest' },
];

export default function Interactive3DLab() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  const [models, setModels] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [envPreset, setEnvPreset] = useState('studio');
  const [ambient, setAmbient] = useState(0.35);
  const [directional, setDirectional] = useState(1.2);
  const [resetToken, setResetToken] = useState(0);
  const [stats, setStats] = useState({ polycount: 0, materials: [] });
  const [showMaterials, setShowMaterials] = useState(false);
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (!inView) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const list = await fetchModels();
      if (!cancelled) {
        setModels(list);
        setActive(list[0] || null);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [inView]);

  const handleStats = useCallback((s) => {
    setStats(s);
  }, []);

  const polyDisplay = active?.polycount || stats.polycount || '—';
  const materials = stats.materials?.length
    ? stats.materials
    : (active?.materials || []);

  const downloadModel = () => {
    if (!active?.model_url) return;
    const a = document.createElement('a');
    a.href = active.model_url;
    a.download = `${active.slug || 'model'}.${active.file_format || 'glb'}`;
    a.rel = 'noopener';
    a.target = '_blank';
    a.click();
  };

  const annotations = active?.tags?.slice(0, 2).map((tag, i) => ({
    label: tag,
    position: [0.8 + i * 0.4, 0.6 + i * 0.3, 0.5],
  })) || [];

  return (
    <section id="lab" ref={sectionRef} className="relative z-10 section-pad lab-section">
      <div className="lab-atmosphere" aria-hidden>
        <div className="lab-fog" />
        <div className="lab-light-shaft lab-light-shaft--left" />
        <div className="lab-light-shaft lab-light-shaft--right" />
        {[...Array(isMobile ? 6 : 10)].map((_, i) => (
          <span key={i} className="lab-particle" style={{ '--i': i }} />
        ))}
      </div>

      <div className="section-container relative">
        <SectionHeader
          number="02"
          label="Interactive"
          title="3D"
          titleAccent="Lab"
        />

        <p className="type-body max-w-2xl mb-12 -mt-6" data-reveal>
          Orbit, inspect materials, and explore GLB assets in real time. Upload new models from the admin panel.
        </p>

        {loading ? (
          <div className="lab-loading type-label">Initializing lab…</div>
        ) : (
          <div className="lab-grid" data-reveal-stagger>
            {/* Viewer */}
            <div data-reveal-child className="lab-viewer-card">
              <div className="lab-viewer-toolbar">
                <span className="type-label text-[var(--neon)]/70">Live viewer</span>
                <div className="lab-toolbar-actions">
                  <button
                    type="button"
                    className="lab-tool-btn"
                    onClick={() => setResetToken((t) => t + 1)}
                    aria-label="Reset camera"
                    title="Reset camera"
                  >
                    ↺
                  </button>
                  <button
                    type="button"
                    className={`lab-tool-btn ${autoRotate ? 'active' : ''}`}
                    onClick={() => setAutoRotate((v) => !v)}
                    aria-pressed={autoRotate}
                    title="Auto rotate"
                  >
                    ⟳
                  </button>
                </div>
              </div>

              <Suspense fallback={<div className="lab-viewer-fallback"><div className="lab-spinner" /></div>}>
                <ModelScene
                  active={inView}
                  modelUrl={active?.model_url}
                  envPreset={envPreset}
                  wireframe={wireframe}
                  exploded={exploded}
                  showGrid={showGrid}
                  ambientIntensity={ambient}
                  directionalIntensity={directional}
                  autoRotate={autoRotate}
                  resetToken={resetToken}
                  annotations={annotations}
                  onStats={handleStats}
                />
              </Suspense>
            </div>

            {/* Details panel */}
            <aside
              data-reveal-child
              className={`lab-details-panel glass-stat ${isMobile ? 'lab-details-panel--mobile' : ''}`}
            >
              <details className="lab-details-accordion" open={!isMobile}>
                {isMobile && <summary>Model details & controls</summary>}
              <div className="lab-details-accordion__body">
              <div className="lab-model-picker">
                <span className="type-label mb-3 block">Models</span>
                <div className="lab-model-list" role="listbox" aria-label="Select 3D model">
                  {models.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      role="option"
                      aria-selected={active?.id === m.id}
                      className={`lab-model-item ${active?.id === m.id ? 'active' : ''}`}
                      onClick={() => setActive(m)}
                    >
                      <span className="lab-model-item-title">{m.title}</span>
                      <span className="type-label opacity-60">{m.category}</span>
                    </button>
                  ))}
                </div>
              </div>

              {active && (
                <>
                  <h3 className="type-card-title mt-6 mb-2">{active.title}</h3>
                  <p className="type-body-sm mb-4">{active.description}</p>

                  <dl className="lab-meta-grid">
                    <div>
                      <dt className="type-label">Software</dt>
                      <dd className="type-body-sm">{active.software || '—'}</dd>
                    </div>
                    <div>
                      <dt className="type-label">Polygons</dt>
                      <dd className="type-stat">{typeof polyDisplay === 'number' ? polyDisplay.toLocaleString() : polyDisplay}</dd>
                    </div>
                    <div>
                      <dt className="type-label">Format</dt>
                      <dd className="type-body-sm uppercase">{(active.file_format || 'glb').toUpperCase()}</dd>
                    </div>
                    <div>
                      <dt className="type-label">Views</dt>
                      <dd className="type-body-sm">{active.views ?? 0}</dd>
                    </div>
                  </dl>

                  {active.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {active.tags.map((t) => (
                        <span key={t} className="lab-tag">{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="lab-controls mt-6">
                    <span className="type-label block mb-3">Viewer controls</span>

                    <label className="lab-control-row">
                      <span>Environment</span>
                      <select
                        value={envPreset}
                        onChange={(e) => setEnvPreset(e.target.value)}
                        className="lab-select"
                      >
                        {ENV_OPTIONS.map((o) => (
                          <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                      </select>
                    </label>

                    <label className="lab-control-row">
                      <span>Ambient light</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={ambient}
                        onChange={(e) => setAmbient(parseFloat(e.target.value))}
                      />
                    </label>

                    <label className="lab-control-row">
                      <span>Key light</span>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={directional}
                        onChange={(e) => setDirectional(parseFloat(e.target.value))}
                      />
                    </label>

                    <div className="lab-toggles">
                      <button type="button" className={`lab-pill ${wireframe ? 'active' : ''}`} onClick={() => setWireframe((v) => !v)}>
                        Wireframe
                      </button>
                      <button type="button" className={`lab-pill ${exploded ? 'active' : ''}`} onClick={() => setExploded((v) => !v)}>
                        Exploded
                      </button>
                      <button type="button" className={`lab-pill ${showGrid ? 'active' : ''}`} onClick={() => setShowGrid((v) => !v)}>
                        Grid
                      </button>
                    </div>

                    <button
                      type="button"
                      className="lab-pill w-full mt-3"
                      onClick={() => setShowMaterials((v) => !v)}
                    >
                      Material inspector {showMaterials ? '▲' : '▼'}
                    </button>
                    {showMaterials && (
                      <ul className="lab-materials-list">
                        {materials.length ? materials.map((name) => (
                          <li key={name}>{name}</li>
                        )) : (
                          <li className="opacity-50">Load model to inspect materials</li>
                        )}
                      </ul>
                    )}

                    <button
                      type="button"
                      className="btn-magnetic lab-download-btn mt-4"
                      onClick={downloadModel}
                      data-cursor
                    >
                      Download model
                    </button>
                    {(active.file_format === 'usdz' || active.model_url?.includes('.usdz')) && (
                      <p className="type-label mt-2 opacity-50">USDZ: AR preview on iOS; web uses download.</p>
                    )}
                  </div>
                </>
              )}
              </div>
              </details>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
