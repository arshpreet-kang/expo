/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E7DBC9',
          300: '#D5C2A4',
          400: '#BEA47D',
          500: '#A48457',
          600: '#8A693F',
          700: '#6F502F',
          800: '#4D361F',
          900: '#2E1F11',
          950: '#1A1009',
        },
        surface: {
          dark: '#0F0D0A',
          card: '#16130E',
          cardHover: '#201C15',
          border: '#2A241C',
          muted: '#8A8275',
        },
        chd: {
          gold: '#D4AF37',
          bronze: '#CD7F32',
          amber: '#F59E0B',
          emerald: '#10B981',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
