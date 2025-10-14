/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        bg: {
          900: '#0a0a0f',
          800: '#13131a',
          700: '#1c1c27',
          600: '#252534',
        },
        accent: {
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#8b5cf6',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#a855f7',
          green: '#00ff88',
          pink: '#ff0080',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
        lg: 'clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem)',
        xl: 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 1.35rem + 0.75vw, 2rem)',
        '3xl': 'clamp(1.875rem, 1.65rem + 1.125vw, 2.5rem)',
        '4xl': 'clamp(2.25rem, 1.95rem + 1.5vw, 3rem)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.5)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.6)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        neon: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
