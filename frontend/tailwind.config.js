/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        base: '#0b1220',
        panel: '#111a2e',
        panel2: '#16223c',
        line: '#22304f',
        sky: '#38bdf8',
        mint: '#34d399',
        amber: '#fbbf24',
        rose: '#fb7185',
        violet: '#a78bfa',
      },
    },
  },
  plugins: [],
};
