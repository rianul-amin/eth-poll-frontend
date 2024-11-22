import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        glow: "glow 3s ease infinite",
        gradientShift: "gradientShift 3s ease infinite",
        verticalGradientShift: "verticalGradientShift 3s ease infinite", // New vertical gradient shift
      },
      keyframes: {
        glow: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        gradientShift: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        // New vertical gradient animation
        verticalGradientShift: {
          "0%": {
            backgroundPosition: "0% 0%", // Start at the top
          },
          "50%": {
            backgroundPosition: "0% 100%", // Move to the bottom
          },
          "100%": {
            backgroundPosition: "0% 0%", // Return to the top
          },
        },
      },
      screens: {
        below365: { max: "364px" },
      },
    },
  },
  plugins: [],
};

export default config;
