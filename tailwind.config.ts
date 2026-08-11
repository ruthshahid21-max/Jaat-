import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        steam: {
          dark: '#171a21',
          card: '#1b2838',
          light: '#2a475e',
          blue: '#66c0f4',
          text: '#c7d5e0',
          dim: '#8f98a0',
        }
      }
    },
  },
  plugins: [],
}
export default config
