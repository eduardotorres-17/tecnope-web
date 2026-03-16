/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nossa cor principal da marca (Verde-Água/Saúde)
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Cor dos botões primários
          600: '#0d9488', // Cor do hover
          900: '#134e4a', // Textos escuros
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fonte limpa e legível
      }
    },
  },
  plugins: [],
}