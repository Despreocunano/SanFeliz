/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B2B',
        secondary: '#FFA41C',
        accent: '#FFE0B2',
        dark: '#2D3748'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif']
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: '#FF6B2B',
              '&:hover': {
                color: '#FFA41C',
              },
            },
            h1: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
            },
            h2: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
            },
            h3: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
            },
            h4: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
            },
          },
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
};