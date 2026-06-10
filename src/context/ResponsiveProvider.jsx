import { createContext, useContext, useEffect } from 'react';
import { useDevice } from '../hooks/useDevice';

const ResponsiveContext = createContext(null);

export function ResponsiveProvider({ children }) {
  const device = useDevice();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.tier = device.tier;
    root.dataset.touch = device.isTouch ? 'true' : 'false';
    root.dataset.reduceMotion = device.reduceMotion ? 'true' : 'false';
    root.dataset.reduceEffects = device.reduceEffects ? 'true' : 'false';
    root.style.setProperty('--viewport-w', `${device.width}px`);
  }, [device]);

  return (
    <ResponsiveContext.Provider value={device}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive() {
  const ctx = useContext(ResponsiveContext);
  if (!ctx) {
    throw new Error('useResponsive must be used within ResponsiveProvider');
  }
  return ctx;
}

/** Safe hook when provider may be absent (e.g. tests) */
export function useResponsiveOptional() {
  return useContext(ResponsiveContext);
}
