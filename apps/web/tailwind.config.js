const path = require('path');

// Ensure POSIX forward slashes for fast-glob compatibility on Windows
const webDir = __dirname.split(path.sep).join('/');
const packagesDir = path.resolve(__dirname, '../../packages').split(path.sep).join('/');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    `${webDir}/src/**/*.{js,ts,jsx,tsx,mdx}`,
    `${packagesDir}/**/*.{js,ts,jsx,tsx,mdx}`,
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/web/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border, 214.3 31.8% 91.4%))',
        input: 'hsl(var(--input, 214.3 31.8% 91.4%))',
        ring: 'hsl(var(--ring, 221.2 83.2% 53.3%))',
        background: 'hsl(var(--background, 210 20% 98%))',
        foreground: 'hsl(var(--foreground, 222 47% 11%))',
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        sidebar: {
          DEFAULT: '#111827',
          active: '#1F2937',
          hover: '#1F2937',
          border: '#1F2937',
          text: '#9CA3AF',
          textActive: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
      },
    },
  },
  plugins: [],
};
