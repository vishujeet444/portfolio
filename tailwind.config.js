/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '320px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      '2xl': '1920px',
    },
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        hero: 'clamp(5rem, 8vw, 9rem)',
        section: 'clamp(3rem, 5vw, 5rem)',
        project: '1.875rem',
        card: '1.5rem',
        body: '1.125rem',
        label: '0.75rem',
        button: '0.875rem',
        stat: '4.5rem',
      },
      colors: {
        gold: {
          DEFAULT: '#3dd68c',
          light: '#6bc99a',
          dark: '#2a9d65',
        },
        neon: {
          DEFAULT: '#3dd68c',
          light: '#6bc99a',
          dark: '#2a9d65',
          cyan: '#6ec4d4',
        },
        lavender: {
          DEFAULT: '#6ec4d4',
          light: '#8ed4e0',
          dark: '#4a9aaa',
        },
        void: {
          DEFAULT: '#050508',
          100: '#070710',
          200: '#0A0E0B',
          300: '#0D1410',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'text-shimmer': 'textShimmer 3s ease infinite',
        'orbit': 'orbit 20s linear infinite',
        'grain': 'grain 0.5s steps(1) infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'helios-rotate': 'heliosRotate 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        textShimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-1%, -2%)' },
          '20%': { transform: 'translate(2%, 1%)' },
          '30%': { transform: 'translate(-1%, 3%)' },
          '40%': { transform: 'translate(3%, -1%)' },
          '50%': { transform: 'translate(-2%, 2%)' },
          '60%': { transform: 'translate(1%, -3%)' },
          '70%': { transform: 'translate(-3%, 1%)' },
          '80%': { transform: 'translate(2%, -2%)' },
          '90%': { transform: 'translate(-1%, 3%)' },
        },
        neonPulse: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 8px rgba(0,255,136,0.8)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 20px rgba(0,255,136,0.4)' },
        },
        heliosRotate: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(ellipse at center, rgba(0,255,136,0.12), transparent 70%)',
        'radial-lavender': 'radial-gradient(ellipse at center, rgba(0,229,255,0.12), transparent 70%)',
        'cosmic': 'radial-gradient(ellipse at 50% 50%, #0A0E0B 0%, #050508 100%)',
        'neon-grid': 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
