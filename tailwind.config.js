/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        blue: {
          primary: '#6366F1',
          primaryDark: '#4F46E5',
          dark: '#1D4ED8',
          light: '#3B82F6',
        },
        ice: '#F0F4FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 28px rgba(99,102,241,0.15), 0 4px 10px rgba(0,0,0,0.08)',
        'btn': '0 4px 12px rgba(99,102,241,0.3)',
        'btn-hover': '0 8px 24px rgba(99,102,241,0.4)',
      },
    },
  },
  plugins: [],
}