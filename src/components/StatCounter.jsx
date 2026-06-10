import useCountUp from '../hooks/useCountUp';

export default function StatCounter({ value, label, accent = 'var(--neon)' }) {
  const { ref, display } = useCountUp(value);

  return (
    <div ref={ref} className="glass-stat h-full flex flex-col justify-between min-h-[140px]">
      <div className="type-label">{label}</div>
      <div className="type-stat" style={{ color: accent }}>
        {display}
      </div>
    </div>
  );
}
