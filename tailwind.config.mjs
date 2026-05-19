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
        // Base clara (substitui o wheat por algo mais clean da imagem)
        background: "#f7f6f2",
        foreground: "#1f2937",

        // Verde institucional (principal)
        primary: "#1f8f5f",
        "primary-light": "#4bbf8a",
        "primary-dark": "#166b47",

        // Vermelho IF (agora entra como secundário forte)
        secondary: "#d92d2d",
        "secondary-light": "#ff5a5a",

        // Dourado do troféu (call to action / destaque)
        accent: "#f4b400",
        "accent-soft": "#ffd166",

        // Detalhes (mantendo sua ideia, mas ajustando à nova estética)
        detail: {
          DEFAULT: "#f4b400", // dourado principal
          subtle: "#ff7a00", // laranja energético
          minor: "#e63946", // vermelho suave
        },

        // Neutros (importante pra UI moderna)
        neutral: {
          light: "#ffffff",
          medium: "#e5e7eb",
          dark: "#374151",
        },
      },
    },
  },
  plugins: [],
};
