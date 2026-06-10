import { useMemo } from 'react';
import {
  tierFromWidth,
  getParticleBudget,
  getTotalParticles,
  type DeviceTier,
  type ParticleBudget,
} from '../lib/breakpoints';
import { useMedia, useViewportWidth } from './useMedia';

export type DeviceInfo = {
  tier: DeviceTier;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isCoarsePointer: boolean;
  reduceMotion: boolean;
  reduceEffects: boolean;
  particles: ParticleBudget;
  particleTotal: number;
};

export function useDevice(): DeviceInfo {
  const width = useViewportWidth();
  const isTouch = useMedia('(hover: none), (pointer: coarse)');
  const isCoarsePointer = useMedia('(pointer: coarse)');
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)');

  return useMemo(() => {
    const tier = tierFromWidth(width);
    const particles = getParticleBudget(tier);
    const isMobile = tier === 'mobile';
    const isTablet = tier === 'tablet';
    const reduceEffects = isMobile || isTablet || reduceMotion;

    return {
      tier,
      width,
      height: typeof window !== 'undefined' ? window.innerHeight : 800,
      isMobile,
      isTablet,
      isLaptop: tier === 'laptop',
      isDesktop: tier === 'desktop' || tier === 'ultra',
      isTouch,
      isCoarsePointer,
      reduceMotion,
      reduceEffects,
      particles,
      particleTotal: getTotalParticles(particles),
    };
  }, [width, isTouch, isCoarsePointer, reduceMotion]);
}
