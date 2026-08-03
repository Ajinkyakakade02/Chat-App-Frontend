/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: { preflight: false },   // avoid overriding MUI's CssBaseline
  darkMode: 'class',                   // you toggle a "dark" class on <html>
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#FF6584',
        surface: 'rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
}