/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: 'class',
  important: true,
  theme: {
    screens: {
      xs: "540px",
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1600px',
      '4xl': '2560px',
      '5xl': '3440px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '12px',
        sm: '1rem',
        lg: '45px',
        xl: '5rem',
        '2xl': '13rem',
      },

    },
    

    fontFamily: {
      'urbanist': "var(--font-urbanist)"
    },
    extend: {
      colors: {
        'dark': '#3c4858',
        'black': '#161c2d',
        'dark-footer': '#192132',
      },

      boxShadow: {
        sm: '0 2px 4px 0 rgb(60 72 88 / 0.15)',
        DEFAULT: '0 0 3px rgb(60 72 88 / 0.15)',
        md: '0 5px 13px rgb(60 72 88 / 0.20)',
        lg: '0 10px 25px -3px rgb(60 72 88 / 0.15)',
        xl: '0 20px 25px -5px rgb(60 72 88 / 0.1), 0 8px 10px -6px rgb(60 72 88 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(60 72 88 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(60 72 88 / 0.05)',
        testi: '2px 2px 2px -1px rgb(60 72 88 / 0.15)',
      },
      fontSize: {
        sm: ['14px', '20px'],
        base: ['17px', '24px'],
        lg: ['20px', '28px'],
        xl: ['22px', '30px'],
      },

      spacing: {
        0.75: '0.1875rem',
        3.25: '0.8125rem'
      },

      maxWidth: ({
        theme,
        breakpoints
      }) => ({
        '1200': '71.25rem',
        '992': '60rem',
        '768': '45rem',
      }),

      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        999: '999',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 3s ease-in-out infinite',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'float': 'float 20s ease-in-out infinite',
        'diagonal': 'diagonal 25s linear infinite',
        'fast-float': 'fastFloat 8s ease-in-out infinite',
        'fast-diagonal': 'fastDiagonal 10s linear infinite',
        'fast-horizontal': 'fastHorizontal 6s linear infinite',
        'fast-vertical': 'fastVertical 7s linear infinite',
        'spin': 'spin 2s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        diagonal: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(100vw, 100vh)' },
        },
        fastFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-30px)' },
        },
        fastDiagonal: {
          '0%': { transform: 'translate(-100%, -100%)' },
          '100%': { transform: 'translate(100%, 100%)' },
        },
        fastHorizontal: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fastVertical: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },

  plugins: [
    require('autoprefixer')
  ]
}
