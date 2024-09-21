import { OpacityIcon } from "@radix-ui/react-icons"
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        maroon: 'maroon',
        mint: '#ADD8E6',
        mustard: '#FFDB58',
        olive: '#808000',
        pista: '#8C9B7C',
        purple :'#D8B4FE',
        red :'#FF6347',
        royal_blue:'#2563EB ',
        skyblue: '#87CEEB',
        teal:'#1C3756 ',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        marquee: {
          '100%': {
            transform: 'translateY(-50%)',
          },
        },
        flashing:{
          "0%, 100%":{opacity : '0.2'},'20%':{opacity:'1'}
        }
      },
      animation: {
        marquee: 'marquee var(--marquee-duration) linear infinite',
        'fade-in': 'fade-in 0.5s linear forwards',
        flashing:'flashing 1.4s infinite linear'
      },
    },
  },
  safelist: [
    'bg-maroon',
    'bg-mint',
    'bg-mustard',
    'bg-olive',
    'bg-pista',
    'bg-purple',
    'bg-red',
    'bg-royal_blue',
    'bg-skyblue',
    'bg-teal',
    'border-maroon',
    'border-mint',
    'border-mustard',
    'border-olive',
    'border-pista',
    'border-purple',
    'border-red',
    'border-royal_blue',
    'border-skyblue',
    'border-teal',
  ],
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config