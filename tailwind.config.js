/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Child-friendly touch targets - minimum 44pt (58.67px at standard DPI)
      spacing: {
        'touch': '58.67px', // 44pt minimum touch target
      },
      fontSize: {
        'child': ['1.25rem', '1.5rem'], // 20px with good line height for children
        'child-large': ['1.75rem', '2rem'], // 28px for important buttons
      },
      colors: {
        // Swedish school colors - high contrast for accessibility
        'swedish-blue': '#0066CC',
        'swedish-yellow': '#FFCC00',
        'class-1a': '#FF5722',
        'class-1b': '#2196F3',
        'class-2a': '#4CAF50',
        'class-2b': '#FF9800',
        'class-3a': '#9C27B0',
        'class-3b': '#F44336',
      },
      screens: {
        // iPad-specific breakpoints
        'ipad': '768px',
        'ipad-pro': '1024px',
      }
    },
  },
  plugins: [],
}