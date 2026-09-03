"use client"

import { Cinzel } from "next/font/google"
import { sectionType } from "@/lib/section-typography"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const NAVY = "#04103B"
const GOLD = "#c5a059"

export function HighlightedHashtag({
  value,
  as: Tag = "p",
  className,
}: {
  value: string
  as?: "p" | "span"
  className?: string
}) {
  const parts = value.split(/(JEN|TIN)/gi)

  return (
    <Tag
      className={
        className ??
        `${sectionType.subheader} font-bold tracking-[0.04em] sm:tracking-[0.06em]`
      }
    >
      {parts.map((part, index) => {
        if (/^(jen|tin)$/i.test(part)) {
          return (
            <span
              key={`${part}-${index}`}
              className={cinzel.className}
              style={{ color: NAVY }}
            >
              {part.toUpperCase()}
            </span>
          )
        }

        return (
          <span
            key={`${part}-${index}`}
            className="font-semibold"
            style={{
              color: GOLD,
              fontFamily: "SortsMillGoudy, Georgia, 'Times New Roman', serif",
              fontStyle: "normal",
            }}
          >
            {part.toLowerCase()}
          </span>
        )
      })}
    </Tag>
  )
}
