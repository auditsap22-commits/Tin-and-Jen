"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Cinzel } from "next/font/google"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const lsNavy = "#001326"
const lsGold = "#c5a059"
const lsGoldSoft = "#e6d3a3"

export default function TableLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const navbar = document.querySelector("nav") as HTMLElement | null
    if (navbar) navbar.style.display = "none"
    return () => {
      if (navbar) navbar.style.display = ""
    }
  }, [])

  return (
    <div style={{ background: lsNavy }}>
      <div
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in srgb, #001326 82%, transparent)",
          borderColor: "color-mix(in srgb, #c5a059 32%, transparent)",
          boxShadow: "0 4px 18px color-mix(in srgb, #001326 35%, transparent)",
        }}
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-3 sm:h-14 sm:px-6 lg:px-8">
          <Link
            href="/"
            className={`${cinzel.className} inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2 sm:text-[0.6875rem] sm:tracking-[0.2em]`}
            style={{
              backgroundColor: lsGold,
              borderColor: "color-mix(in srgb, #e6d3a3 55%, transparent)",
              color: lsNavy,
            }}
          >
            <span aria-hidden>←</span>
            <span className="hidden sm:inline">Back to invitation</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div
            className={`${cinzel.className} truncate text-[0.6rem] font-semibold uppercase tracking-[0.18em] sm:text-[0.6875rem] sm:tracking-[0.28em]`}
            style={{ color: lsGoldSoft }}
          >
            Find Your Table
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
