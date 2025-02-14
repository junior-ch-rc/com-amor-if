/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-detail",
    "bg-detail-subtle",
    "bg-detail-minor",
    "border-detail",
    "border-detail-subtle",
    "border-detail-minor",
    "text-detail-dark",
    "text-detail-subtle-dark",
    "text-detail-minor-dark",
    "hover:text-detail-dark",
    "hover:text-detail-subtle-dark",
    "hover:text-detail-minor-dark",
    "bg-lime-400",
    "border-lime-400",
    "bg-gray-400",
    "bg-opacity-50",
    // Adicione outras classes dinâmicas conforme necessário
  ],
  theme: {
    extend: {
      colors: {
        wheat: "#f5deb3",
        primary: "#18a08c",
        "primary-light": "#49c8aa",
        detail: {
          DEFAULT: "#ffbb03",
          subtle: "#ff941b",
          minor: "#ff8486",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
