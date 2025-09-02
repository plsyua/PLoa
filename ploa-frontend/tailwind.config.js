/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 다크모드를 클래스 기반으로 활성화
  theme: {
    extend: {
      transitionProperty: {
        'transform-opacity': 'transform, opacity',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '100': '100',
      }
    },
  },
  plugins: [],
}