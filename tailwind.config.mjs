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
            color: '#2D3748',
            a: {
              color: '#FF6B2B',
              textDecoration: 'none',
              '&:hover': {
                color: '#FFA41C',
              },
            },
            h1: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
              color: '#2D3748',
            },
            h2: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
              color: '#2D3748',
            },
            h3: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
              color: '#2D3748',
            },
            h4: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
              color: '#2D3748',
            },
            strong: {
              color: '#2D3748',
            },
            blockquote: {
              borderLeftColor: '#FF6B2B',
              color: '#4A5568',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              color: '#FF6B2B',
              backgroundColor: '#FFF5F5',
              borderRadius: '0.25rem',
              padding: '0.25rem',
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