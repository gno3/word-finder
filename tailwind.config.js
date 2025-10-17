/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Verify responsive breakpoints (using Tailwind defaults)
      // sm: 640px, md: 768px, lg: 1024px
      screens: {
        'sm': '640px',
        'md': '768px', 
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Touch target utilities for accessibility
      spacing: {
        '11': '44px', // Minimum touch target size
        '12': '48px', // Recommended touch target size
      },
      minWidth: {
        '11': '44px',
        '12': '48px',
      },
      minHeight: {
        '11': '44px', 
        '12': '48px',
      },
    },
  },
  plugins: [],
}