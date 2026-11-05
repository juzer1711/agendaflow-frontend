/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#1B1F27',
          700: '#3A3F4B',
          500: '#6B7280',
          300: '#9CA3AF',
        },
        navy: {
          900: '#1D2748',
          800: '#242F58',
          700: '#2B3A67',
          600: '#374A80',
          100: '#E9ECF6',
          50: '#F4F5FA',
        },
        amber: {
          600: '#C97A1E',
          500: '#E8A33D',
          400: '#EFB865',
          100: '#FBEEDA',
        },
        canvas: '#F7F8FA',
        line: '#E5E7EB',
        success: '#2F9E63',
        danger: '#D64545',
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(27, 31, 39, 0.06), 0 1px 1px rgba(27, 31, 39, 0.04)',
      },
    },
  },
  plugins: [],
};
