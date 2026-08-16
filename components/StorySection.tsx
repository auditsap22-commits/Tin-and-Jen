"use client"

import React, { useEffect, useRef, useState } from "react"
import localFont from "next/font/local"
import { sectionType, storyChapterTitleSize } from "@/lib/section-typography"
import Image from "next/image"
import { TornPaperEdge, PAPER_FACE } from "./TornPaperEdge"

const theSeasons = localFont({
  src: "../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const storyInk = {
  cream: PAPER_FACE,
  lift: PAPER_FACE,
  champagne: "#DDBA7A",
  gold: "#AB832E",
  slate: "#364061",
  navy: "#192030",
  midnight: "#04103B",
} as const

const lightSectionBg = PAPER_FACE

export { lightSectionBg, storyInk }

const darkSectionBg = storyInk.midnight

interface StorySectionProps {
  imageSrc: string
  title?: string
  text: React.ReactNode
  layout: "image-left" | "image-right"
  theme: "dark" | "light"
  isFirst?: boolean
  isLast?: boolean
}

export const StorySection: React.FC<StorySectionProps> = ({
  imageSrc,
  title,
  text,
  layout,
  theme,
  isFirst = false,
  isLast = false,
}) => {
  const isDark = theme === "dark"

  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const imageFrameStyle = isDark
    ? {
        background: storyInk.midnight,
        border: `1px solid ${storyInk.gold}`,
      }
    : {
        background: storyInk.lift,
        border: `1px solid color-mix(in srgb, ${storyInk.gold} 28%, transparent)`,
        boxShadow: `0 8px 24px color-mix(in srgb, ${storyInk.navy} 8%, transparent), inset 0 1px 0 color-mix(in srgb, white 70%, transparent)`,
      }

  const rotation = layout === "image-left" ? "rotate-1 md:rotate-2" : "-rotate-1 md:-rotate-2"
  const flexDirection = layout === "image-left" ? "flex-row" : "flex-row-reverse"

  return (
    <div
      className={`${theSeasons.variable} relative`}
      style={{
        background: isDark ? darkSectionBg : lightSectionBg,
        backgroundAttachment: isDark ? undefined : "fixed",
      }}
    >
      {!isDark && (
        <>
          {!isFirst && (
            <div className="pointer-events-none absolute left-0 top-0 z-20 -mt-[14px] w-full md:-mt-[32px]">
              <TornPaperEdge flipped={true} color={PAPER_FACE} />
            </div>
          )}
          {!isLast && (
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 -mb-[14px] w-full md:-mb-[32px]">
              <TornPaperEdge flipped={false} color={PAPER_FACE} />
            </div>
          )}
        </>
      )}
      <div
        ref={sectionRef}
        className={`container relative z-10 mx-auto px-2 py-12 transition-all duration-1000 ease-out md:px-12 md:py-32 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"} ${isFirst ? "pt-16 md:pt-36" : ""} ${isLast ? "pb-16 md:pb-36" : ""}`}
      >
        <div className={`flex ${flexDirection} items-center justify-between gap-3 md:gap-16`}>
          <div className="flex w-[45%] shrink-0 justify-center md:w-5/12">
            <div
              className={`relative w-full transition-all delay-300 duration-1000 ease-out md:max-w-md ${rotation} ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"} `}
            >
              <div className="w-full p-1.5 md:p-3" style={imageFrameStyle}>
                <div className="group relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt="Story Moment"
                    fill
                    sizes="(max-width: 768px) 45vw, (max-width: 1024px) 40vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    quality={90}
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-[55%] @container/story md:w-5/12"
            style={{ color: isDark ? storyInk.gold : storyInk.navy }}
          >
            {title && (
              <h2
                className={`${theSeasons.className} mb-3 uppercase leading-tight tracking-[0.08em] transition-all delay-500 duration-1000 sm:mb-4 sm:tracking-[0.1em] md:mb-6 md:tracking-[0.12em] ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} `}
                style={{
                  fontSize: storyChapterTitleSize,
                  color: isDark ? storyInk.gold : storyInk.navy,
                }}
              >
                {title}
              </h2>
            )}

            <div
              className={`font-goudy-italic space-y-3 transition-all delay-700 duration-1000 sm:space-y-4 md:space-y-6 lg:leading-[1.7] ${sectionType.textRelaxed} ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} `}
            >
              {text}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
