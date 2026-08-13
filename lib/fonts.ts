import localFont from "next/font/local"

/**
 * Couple-name script from public/fonts/AnastasiaScript.ttf
 * (AnastasiaScript Regular.ttf is the same face).
 */
export const anastasiaScript = localFont({
  src: "../Font/AnastasiaScript.ttf",
  display: "swap",
  preload: true,
  variable: "--font-anastasia-script",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
})
