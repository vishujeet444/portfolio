import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'gsap', 'framer-motion'],
  },
  server: {
    host: 'localhost',
    port: 5173,
    open: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
