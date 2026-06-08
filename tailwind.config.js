/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0e1116",
        ink2: "#4a5568",
        ink3: "#7c8694",
        accent: "#ea580c",
        good: "#15803d",
        warn: "#b45309",
        danger: "#c8341f",
      },
      fontFamily: {
        sans: ['"Geist"', '"Geist Fallback"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  // The product's visual system is encoded in src/index.css design tokens; Tailwind's
  // preflight is disabled so it never fights those hand-tuned base styles.
  corePlugins: { preflight: false },
  plugins: [],
};
