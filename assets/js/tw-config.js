/* Configuration Tailwind partagée — Hôtel Glodi VIP
   Les couleurs pointent vers les variables CSS de assets/css/site.css
   (thème clair / sombre gérés en un seul endroit). */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        subtle: 'rgb(var(--c-subtle) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        gold: {
          DEFAULT: 'rgb(var(--c-gold) / <alpha-value>)',
          ink: 'rgb(var(--c-gold-ink) / <alpha-value>)',
          soft: 'rgb(var(--c-gold-soft) / <alpha-value>)',
        },
        night: '#14110F',
        ivory: '#FAF7F2',
      },
      maxWidth: { site: '80rem' },
      boxShadow: {
        lux: '0 30px 60px -30px rgba(20, 17, 15, .35)',
        card: '0 1px 2px rgba(20,17,15,.04), 0 12px 32px -16px rgba(20,17,15,.18)',
      },
    },
  },
};
