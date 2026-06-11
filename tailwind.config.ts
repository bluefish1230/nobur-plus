import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 45px -25px rgb(15 23 42 / 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
