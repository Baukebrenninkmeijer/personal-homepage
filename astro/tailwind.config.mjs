export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { dark: '#0a0a0a', light: '#fafafa' },
        text: { dark: '#fafafa', light: '#0a0a0a' },
        muted: { dark: '#888888', light: '#666666' },
        border: { dark: '#1a1a1a', light: '#e0e0e0' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'monospace'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('light', ':root.light &');
    },
  ],
};
