"use client"

import { useEffect } from "react"

const lsNavy = "#001326"

export default function TableLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const navbar = document.querySelector("nav") as HTMLElement | null
    if (navbar) navbar.style.display = "none"
    return () => {
      if (navbar) navbar.style.display = ""
    }
  }, [])

  return <div style={{ background: lsNavy }}>{children}</div>
}
