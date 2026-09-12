module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FBFBF9',
          muted: '#F5F5F0',
        },
        obsidian: {
          DEFAULT: '#121212',
          soft: '#1E1E1E',
        },
        accent: {
          gold: '#C5A059',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
      },
    },
  },

  plugins: [
    require('daisyui'),
  ],

  daisyui: {
    themes: ['dark'],
  },
}