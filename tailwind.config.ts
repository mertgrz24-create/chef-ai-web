import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Design-system tokens (themeable via CSS vars)
        bg: "var(--bg)",
        surface: "var(--bg-card)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        ink: "var(--text-primary)",
        "ink-2": "var(--text-secondary)",
        "ink-muted": "var(--text-muted)",
        brand: "var(--brand)",
        "brand-ink": "var(--brand-ink)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        "accent-light": "var(--accent-light)",
        clay: "var(--clay)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
