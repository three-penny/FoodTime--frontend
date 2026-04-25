module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        kraft: '#EFE7D2',
        ink: '#1C1916',
        vermilion: '#B8351F',
        maroon: '#8C2A1C',
        enamel: '#2F5D3A',
        ivory: '#F8F2E2',
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
      },
      letterSpacing: {
        tightprint: '-0.02em',
      },
    },
  },
  plugins: [],
};
