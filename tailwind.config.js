/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: { DEFAULT: '#0A0E1A', 900: '#0D1220', 800: '#131826', 700: '#1A2136' },
        cyan: { DEFAULT: '#00E5FF', glow: 'rgba(0,229,255,0.35)' },
        electric: '#4D9FFF',
        border: 'rgba(255,255,255,0.06)',
        textMuted: '#8B93A7',
      },
      boxShadow: {
        glow: '0 0 24px rgba(0,229,255,0.25)',
        glowStrong: '0 0 40px rgba(0,229,255,0.45)',
      },
      borderRadius: { xl2: '16px' },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: { shimmer: 'shimmer 1.6s infinite' },
    },
  },
  plugins: [],
}
