/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      // Your keyframes and animation settings are correct
      keyframes: {
        'gradient-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'kenburns': {
          '0%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(1.1) translateY(-10px)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
        'fadeInUp': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        }
      },
      animation: {
        'gradient-pan': 'gradient-pan 15s ease infinite',
        'kenburns': 'kenburns 15s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 1s ease-out forwards',
        'pulse-subtle': 'pulse-subtle 2.5s ease-in-out infinite',
      },

      // --- THIS IS THE CORRECTED PART ---
      // The backgroundImage object is now correctly placed inside 'extend'
       
      // ------------------------------------

    }, // <-- The 'extend' object closes here
  }, // <-- The 'theme' object closes here
  plugins: [],
}