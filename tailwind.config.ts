/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
      fontSize: {
        '11': ['0.6875rem', { lineHeight: '1rem' }],
        '13': ['0.8125rem', { lineHeight: '1.125rem' }],
        '15': ['0.9375rem', { lineHeight: '1.375rem' }],
        '17': ['1.0625rem', { lineHeight: '1.5rem' }],
        '19': ['1.1875rem', { lineHeight: '1.75rem' }],
        '21': ['1.3125rem', { lineHeight: '1.875rem' }],
        '23': ['1.4375rem', { lineHeight: '2rem' }],
        '27': ['1.6875rem', { lineHeight: '2.25rem' }],
        '31': ['1.9375rem', { lineHeight: '2.5rem' }],
      },

      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 2px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        '-x-full': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        '-y-full': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateY(-100%)',
          },
        },
        blink: {
          '0%': {
            opacity: '100%',
          },
          '15%': {
            opacity: '0%',
          },
          '30%': {
            opacity: '100%',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        blink1: 'blink 1s infinite',
        'step-up-4': '-y-full 0.5s steps(4, jump-end) infinite',
        'step-up-10': '-y-full 1s steps(10, jump-end) infinite',
        'step-left-4': '-x-full 0.5s steps(4, jump-end) infinite',
        'step-left-10': '-x-full 1s steps(10, jump-end) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
