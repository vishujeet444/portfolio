import { useResponsiveOptional } from '../context/ResponsiveProvider';

/** Static CSS atmosphere — no scroll listeners, no RAF loops */
export default function AmbientLayers() {
  const device = useResponsiveOptional();
  const reduceEffects = device?.reduceEffects ?? false;

  if (reduceEffects) return null;

  return (
    <div className="ambient-stack ambient-stack--static" aria-hidden>
      <div className="ambient-fog" />
      <div className="ambient-vignette" />
    </div>
  );
}
