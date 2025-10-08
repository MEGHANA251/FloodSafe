import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/(pages)/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0B5ED7',
          green: '#168F6E',
          yellow: '#F4C20D',
          orange: '#F77F00',
          red: '#D7263D'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: []
} satisfies Config;

