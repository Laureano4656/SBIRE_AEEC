/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#4f46e5", // indigo-600, ajustá al color que uses
        "brand-secondary": "#6366f1", // indigo-500
      },
    },
  },
  plugins: [],
};
