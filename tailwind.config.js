/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'sans-serif'],
      },
      colors: {
        'brutalist-black': '#111111',
        'brutalist-grey': '#E0E0E0',
        // Site tokens — mirrored as CSS variables in src/index.css
        'ink': '#E0E0E0',
        'muted': '#919191',   // 5.9:1 on #111 (WCAG AA for small text)
        'line': 'rgba(224, 224, 224, 0.12)',
        'surface': '#181818', // placeholder behind media while it loads
        'accent': '#ffff00',
      },
    },
  },
  plugins: [],
}
