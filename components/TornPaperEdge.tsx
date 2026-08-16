import React from "react"

interface TornPaperEdgeProps {
  className?: string
  flipped?: boolean
  /** Solid fill — must match the light paper face */
  color?: string
}

export const PAPER_FACE = "#F1E7D3"

export const TornPaperEdge: React.FC<TornPaperEdgeProps> = ({
  className = "",
  flipped = false,
  color = PAPER_FACE,
}) => {
  const path = `
    M0,-20
    L100,-20
    L100,5
    L97.5,8.2 L95,5.4 L92.5,9.1 L90,5.8 L87.5,8.6 L85,5.2 L82.5,9.4
    L80,6.0 L77.5,8.0 L75,5.5 L72.5,9.2 L70,5.7 L67.5,8.8 L65,5.1
    L62.5,9.0 L60,6.1 L57.5,8.3 L55,5.4 L52.5,9.5 L50,5.9 L47.5,8.1
    L45,5.3 L42.5,9.3 L40,5.6 L37.5,8.5 L35,5.0 L32.5,8.9 L30,6.2
    L27.5,8.4 L25,5.5 L22.5,9.1 L20,5.8 L17.5,8.7 L15,5.2 L12.5,9.0
    L10,6.0 L7.5,8.2 L5,5.4 L2.5,8.8 L0,5.6
    Z
  `

  return (
    <div className={`w-full leading-[0] ${className}`} aria-hidden>
      <svg
        viewBox="0 -20 100 30"
        preserveAspectRatio="none"
        className={`block h-6 w-full md:h-11 ${flipped ? "rotate-180" : ""}`}
      >
        <path d={path} fill={color} stroke={color} strokeWidth="0.35" />
      </svg>
    </div>
  )
}
