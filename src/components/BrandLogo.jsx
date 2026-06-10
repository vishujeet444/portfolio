const SIZES = {
  nav: 40,
  icon: 56,
};

/** Orbital monogram + optional wordmark lockup */
export function BrandGlyph({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="vkGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#3dd68c" />
          <stop offset="100%" stopColor="#6ec4d4" />
        </linearGradient>
        <linearGradient id="vkRing" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3dd68c" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6ec4d4" stopOpacity="0.15" />
        </linearGradient>
        <filter id="vkGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="url(#vkRing)"
        strokeWidth="1"
        strokeDasharray="28 98"
        strokeLinecap="round"
        transform="rotate(-28 24 24)"
      />
      <circle cx="24" cy="24" r="3" fill="var(--neon)" opacity="0.85" filter="url(#vkGlow)" />
      <path
        d="M14 34 L24 12 L34 34"
        stroke="url(#vkGrad)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M28 12 L28 34 M28 22 L36 12 M28 22 L36 34"
        stroke="url(#vkGrad)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.92"
      />
    </svg>
  );
}

export default function BrandLogo({ variant = 'nav', className = '' }) {
  const size = SIZES[variant] ?? SIZES.nav;
  const isIcon = variant === 'icon';

  if (isIcon) {
    return (
      <div className={`brand-logo brand-logo--icon ${className}`}>
        <BrandGlyph size={size} />
      </div>
    );
  }

  return (
    <div className={`brand-logo brand-logo--nav ${className}`}>
      <div className="brand-logo__glyph-wrap">
        <div className="brand-logo__ring-glow" />
        <BrandGlyph size={size} />
      </div>
    </div>
  );
}
