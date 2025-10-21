import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindcssTypography from '@tailwindcss/typography';

export default {
  darkMode: ['class'],
  // Scan Astro source files so Tailwind doesn't purge needed classes
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Public Sans', 'Arial', 'sans-serif'],
        ui: ['Open Sans', 'sans-serif'],
        serif: ['DM Serif Text', 'serif'],
        sans: ['Public Sans', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'h1-desktop': '3em',
        'h1-mobile': '1.5em',
        'h2-desktop': '2em',
        'h2-mobile': '1em',
        'h3-desktop': '1.5em',
        'h3-mobile': '1.35em',
      },
      maxWidth: {
        site: '1160px',
      },
      colors: {
        // Brand Colors
        brand: {
          red: 'var(--brand-red)',
          orange: 'var(--brand-orange)',
          'orange-dark': 'var(--brand-orange-dark)',
        },
        // Text Colors
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          muted: 'var(--text-muted)',
        },
        // Background Colors
        bg: {
          white: 'var(--bg-white)',
          'light-gray': 'var(--bg-light-gray)',
          hover: 'var(--bg-hover)',
        },
        // Utility Colors
        border: 'var(--border-light)',
        overlay: {
          dark: 'var(--overlay-dark)',
          black: 'var(--overlay-black)',
        },
        // Shadcn/UI compatibility (keeping these for component library)
        background: 'var(--bg-white)',
        foreground: 'var(--text-primary)',
        card: {
          DEFAULT: 'var(--bg-white)',
          foreground: 'var(--text-primary)',
        },
        popover: {
          DEFAULT: 'var(--bg-white)',
          foreground: 'var(--text-primary)',
        },
        primary: {
          DEFAULT: 'var(--brand-orange)',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'var(--bg-light-gray)',
          foreground: 'var(--text-primary)',
        },
        muted: {
          DEFAULT: 'var(--bg-light-gray)',
          foreground: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--brand-red)',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        input: 'var(--border-light)',
        ring: 'var(--brand-red)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config;
