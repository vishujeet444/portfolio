import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'gsap', 'framer-motion', 'lenis'],
  },
  server: {
    // Listen on IPv4 + IPv6 — host:'localhost' was IPv6-only on Windows (Chrome can fail on 127.0.0.1)
    host: true,
    port: 5173,
    strictPort: true,
    open: '/',
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
});
