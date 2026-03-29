/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.rs'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Surface Hierarchy */
        surface: {
          DEFAULT: 'var(--color-surface)',
          'container-low': 'var(--color-surface-container-low)',
          container: 'var(--color-surface-container)',
          'container-high': 'var(--color-surface-container-high)',
          'container-highest': 'var(--color-surface-container-highest)',
          'container-lowest': 'var(--color-surface-container-lowest)',
        },

        /* Legacy aliases */
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },

        /* Primary: Deep Navy */
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          container: 'var(--color-primary-container)',
        },

        /* Secondary */
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },

        /* Muted */
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },

        /* Accent */
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },

        /* Positive: Emerald */
        positive: {
          DEFAULT: 'var(--color-positive)',
          dim: 'var(--color-positive-dim)',
          container: 'var(--color-positive-container)',
        },

        /* Error / Destructive */
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          container: 'var(--color-error-container)',
        },

        /* Outline / Border / Input / Ring */
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        outline: {
          DEFAULT: 'var(--color-outline)',
          variant: 'var(--color-outline-variant)',
        },

        /* Sidebar: Deep Navy */
        sidebar: {
          DEFAULT: 'var(--color-sidebar)',
          foreground: 'var(--color-sidebar-foreground)',
          muted: 'var(--color-sidebar-muted)',
          accent: 'var(--color-sidebar-accent)',
        },

        /* MoneyWorks colour palette */
        'mw-0': 'var(--color-mw-0)',
        'mw-1': 'var(--color-mw-1)',
        'mw-2': 'var(--color-mw-2)',
        'mw-3': 'var(--color-mw-3)',
        'mw-4': 'var(--color-mw-4)',
        'mw-5': 'var(--color-mw-5)',
        'mw-6': 'var(--color-mw-6)',
        'mw-7': 'var(--color-mw-7)',

        /* Chart palette */
        chart: {
          1: 'var(--color-chart-1)',
          2: 'var(--color-chart-2)',
          3: 'var(--color-chart-3)',
          4: 'var(--color-chart-4)',
          5: 'var(--color-chart-5)',
          6: 'var(--color-chart-6)',
          7: 'var(--color-chart-7)',
          8: 'var(--color-chart-8)',
          9: 'var(--color-chart-9)',
          10: 'var(--color-chart-10)',
          income: 'var(--color-chart-income)',
          expenses: 'var(--color-chart-expenses)',
          profit: 'var(--color-chart-profit)',
          positive: 'var(--color-chart-positive)',
          negative: 'var(--color-chart-negative)',
        },
      },

      borderRadius: {
        DEFAULT: '0.75rem',
      },

      fontFamily: {
        headline: ["'Manrope'", 'sans-serif'],
        body: ["'Inter'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
