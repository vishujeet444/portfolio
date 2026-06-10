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
};

export function tierFromWidth(width: number): DeviceTier {
  if (width >= BREAKPOINTS.ultra) return 'ultra';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.laptop) return 'laptop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

export function getParticleBudget(tier: DeviceTier): ParticleBudget {
  switch (tier) {
    case 'mobile':
      return { galaxy: 9000, stars: 4000, nebula: 80, dust: 50, ringPoints: 60, ringCount: 1, dpr: [0.75, 1] };
    case 'tablet':
      return { galaxy: 26000, stars: 12000, nebula: 180, dust: 100, ringPoints: 90, ringCount: 2, dpr: [1, 1.2] };
    case 'laptop':
      return { galaxy: 38000, stars: 18000, nebula: 200, dust: 110, ringPoints: 90, ringCount: 2, dpr: [1, 1.25] };
    case 'desktop':
      return { galaxy: 52000, stars: 22000, nebula: 240, dust: 140, ringPoints: 100, ringCount: 3, dpr: [1, 1.35] };
    case 'ultra':
    default:
      return { galaxy: 58000, stars: 24000, nebula: 260, dust: 150, ringPoints: 110, ringCount: 3, dpr: [1, 1.4] };
  }
}

/** ~15k mobile · ~40k tablet · ~100k desktop+ */
export function getTotalParticles(budget: ParticleBudget): number {
  return budget.galaxy + budget.stars + budget.nebula + budget.dust + budget.ringPoints * budget.ringCount;
}
