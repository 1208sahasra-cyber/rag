/**
 * tailwind.config.cjs
 * Premium dark mode with glassmorphism and subtle animations.
 */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class", // enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: "hsl(210, 100%, 55%)",
        secondary: "hsl(280, 70%, 60%)",
        accent: "hsl(45, 100%, 55%)",
        glass: "rgba(255,255,255,0.12)"
      },
      backdropBlur: {
        xs: "2px"
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        slideIn: "slideIn 0.3s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};
