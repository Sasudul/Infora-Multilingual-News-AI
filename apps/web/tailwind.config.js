import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9ddfe',
          300: '#7cc2fd',
          400: '#36a3fa',
          500: '#0b8deb',
          600: '#006ecb',
          700: '#0058a5',
          800: '#054b87',
          900: '#0b3f6f',
          950: '#07284b',
        },
        surface: {
          900: '#0a0d14',
          800: '#111622',
          700: '#1a2030',
          600: '#252e42',
        },
        accent: {
          blue: '#A3C2E0', // For light blue accents
          dark: '#131A2A', // For dark card backgrounds
        }
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(20, 30, 50, 0.8) 0%, rgba(10, 13, 20, 1) 50%)',
        'card-gradient': 'linear-gradient(180deg, rgba(30, 40, 60, 0.5) 0%, rgba(15, 20, 35, 0.8) 100%)',
        'button-gradient': 'linear-gradient(90deg, #bbdcfc 0%, #7dbdec 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
