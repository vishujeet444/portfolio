/** Responsive tiers — mobile 320–767, tablet 768–1023, laptop 1024–1439, desktop 1440+, ultra 1920+ */
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
  ultra: 1920,
} as const;

export type DeviceTier = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'ultra';

export type ParticleBudget = {
  galaxy: number;
  stars: number;
  nebula: number;
  dust: number;
  ringPoints: number;
  ringCount: number;
  dpr: [number, number];
  /** Skip WebGL extras (nebula, dust, extra rings) */
  lite: boolean;
};

export function tierFromWidth(width: number): DeviceTier {
  if (width >= BREAKPOINTS.ultra) return 'ultra';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.laptop) return 'laptop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

/** ~3.5k mobile · ~10k tablet · ~22k desktop — ~80% reduction vs prior caps */
export function getParticleBudget(tier: DeviceTier): ParticleBudget {
  switch (tier) {
    case 'mobile':
      return { galaxy: 0, stars: 0, nebula: 0, dust: 0, ringPoints: 0, ringCount: 0, dpr: [1, 1], lite: true };
    case 'tablet':
      return { galaxy: 3500, stars: 2000, nebula: 0, dust: 0, ringPoints: 48, ringCount: 1, dpr: [1, 1.1], lite: true };
    case 'laptop':
      return { galaxy: 8000, stars: 4000, nebula: 60, dust: 0, ringPoints: 56, ringCount: 1, dpr: [1, 1.2], lite: true };
    case 'desktop':
      return { galaxy: 12000, stars: 5500, nebula: 80, dust: 40, ringPoints: 64, ringCount: 2, dpr: [1, 1.25], lite: false };
    case 'ultra':
    default:
      return { galaxy: 15000, stars: 6500, nebula: 100, dust: 50, ringPoints: 72, ringCount: 2, dpr: [1, 1.3], lite: false };
  }
}

export function getTotalParticles(budget: ParticleBudget): number {
  return budget.galaxy + budget.stars + budget.nebula + budget.dust + budget.ringPoints * budget.ringCount;
}
