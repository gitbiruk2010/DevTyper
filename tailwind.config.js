/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'code-bg': '#1a1a1a',
        'code-text': '#e0e0e0',
        'code-correct': '#10b981',
        'code-error': '#ef4444',
        'code-cursor': '#60a5fa',
      },
      fontFamily: {
        mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
