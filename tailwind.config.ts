import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      minWidth: {
        '16': '4rem',
        '32': '8rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} satisfies Config;
