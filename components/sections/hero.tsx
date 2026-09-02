"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Cinzel } from "next/font/google"
import { ArrowRight } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { siteConfig } from "@/content/site"
import { parseWeddingDate } from "@/lib/wedding-date"
import { sectionType } from "@/lib/section-typography"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const GOLD = "#c5a059"
const GOLD_SOFT = "#e6d3a3"
const NAVY = "#001326"

const DECO = {
  top: "/decoration/deco/top-center-decoration.png",
  bl: "/decoration/deco/left-bottom-small.png",
  br: "/decoration/deco/right-bottom-small.png",
} as const

const DESKTOP_BACKGROUNDS = [
  "/desktop-background/couples (1).webp",
  "/desktop-background/couples (7).webp",
  "/desktop-background/couples (12).webp",
  "/desktop-background/couples (18).webp",
  "/desktop-background/couples (24).webp",
  "/desktop-background/couples (30).webp",
  "/desktop-background/couples (36).webp",
  "/desktop-background/couples (42).webp",
] as const

const MOBILE_BACKGROUNDS = [
  "/mobile-background/couples (1).webp",
  "/mobile-background/couples (5).webp",
  "/mobile-background/couples (9).webp",
  "/mobile-background/couples (13).webp",
  "/mobile-background/couples (17).webp",
  "/mobile-background/couples (21).webp",
  "/mobile-background/couples (25).webp",
  "/mobile-background/couples (29).webp",
] as const

const SLIDE_MS = 7200
const FADE_MS = 2600

function formatClockTime(raw: string) {
  const trimmed = raw.trim()
  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i)
  if (!match) return trimmed.toUpperCase()

  let hour = Number(match[1])
  const minutes = match[2] ?? "00"
  let meridiem = (match[3] || "").toUpperCase()

  if (!meridiem) {
    meridiem = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12
  } else if (meridiem === "PM" && hour > 12) {
    hour = hour % 12
  } else if (meridiem === "AM" && hour === 0) {
    hour = 12
  } else if (hour > 12) {
    hour = hour % 12
  }

  return `${hour}:${minutes} ${meridiem}`
}

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 150)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const sync = () => setIsDesktop(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    setSlideIndex(0)
    setPrevIndex(null)
  }, [isDesktop])

  const backgrounds = isDesktop ? DESKTOP_BACKGROUNDS : MOBILE_BACKGROUNDS
  const nextIndex = (slideIndex + 1) % backgrounds.length

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(() => {
      setSlideIndex((current) => {
        setPrevIndex(current)
        return (current + 1) % backgrounds.length
      })
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, backgrounds.length])

  useEffect(() => {
    if (prevIndex === null) return
    const id = window.setTimeout(() => setPrevIndex(null), FADE_MS)
    return () => window.clearTimeout(id)
  }, [prevIndex, slideIndex])

  const ceremonyDay = siteConfig.ceremony.day ?? "Saturday"
  const ceremonyTime = siteConfig.ceremony.time
  const groomName = siteConfig.couple.groomNickname ?? siteConfig.couple.groom
  const brideName = siteConfig.couple.brideNickname ?? siteConfig.couple.bride

  const weddingMeta = useMemo(() => {
    const parsed = parseWeddingDate(
      siteConfig.ceremony.date ?? siteConfig.wedding.date,
    )
    const weekday = (
      parsed.dayOfWeek ||
      ceremonyDay ||
      ""
    ).toUpperCase()
    const time = formatClockTime(ceremonyTime ?? siteConfig.wedding.time ?? "")
    const venue =
      siteConfig.ceremony.location || siteConfig.wedding.venue || ""

    return {
      weekday,
      time,
      month: parsed.month.toUpperCase(),
      day: parsed.day,
      year: parsed.year,
      venue,
    }
  }, [
    ceremonyDay,
    ceremonyTime,
    siteConfig.ceremony.date,
    siteConfig.ceremony.location,
    siteConfig.wedding.date,
    siteConfig.wedding.time,
    siteConfig.wedding.venue,
  ])

  return (
    <section
      id="home"
      className="hero-invite relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background: NAVY,
        paddingTop: "calc(var(--hero-deco-top) * 0.32 + 3.25rem)",
        paddingBottom: "calc(var(--hero-deco-sprig) * 1.15 + 3rem)",
        paddingLeft: "max(1.15rem, calc(var(--hero-frame-inset) + 0.7rem))",
        paddingRight: "max(1.15rem, calc(var(--hero-frame-inset) + 0.7rem))",
      }}
    >
      <div className="hero-invite-slideshow" aria-hidden="true">
        {backgrounds.map((src, index) => {
          const isActive = index === slideIndex
          const isPrev = index === prevIndex

          return (
            <div
              key={src}
              className={`hero-invite-slide${isActive ? " is-active" : ""}${isPrev ? " is-prev" : ""}`}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={index === 0 || isActive || index === nextIndex}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )
        })}
      </div>
      <div className="hero-invite-video-veil" aria-hidden="true" />

      <div className="hero-invite-frame" aria-hidden="true">
        <span className="hero-invite-frame-arm hero-invite-frame-arm--top-left" />
        <span className="hero-invite-frame-arm hero-invite-frame-arm--top-right" />
        <span className="hero-invite-frame-arm hero-invite-frame-arm--left" />
        <span className="hero-invite-frame-arm hero-invite-frame-arm--right" />
        <span className="hero-invite-frame-arm hero-invite-frame-arm--bottom" />
      </div>

      <div className="hero-invite-deco hero-invite-deco--top" aria-hidden="true">
        <Image
          src={DECO.top}
          alt=""
          width={2078}
          height={598}
          priority
          sizes="(max-width: 768px) 90vw, 480px"
        />
      </div>
      <div className="hero-invite-deco hero-invite-deco--bl" aria-hidden="true">
        <Image src={DECO.bl} alt="" width={851} height={1472} sizes="200px" />
      </div>
      <div className="hero-invite-deco hero-invite-deco--br" aria-hidden="true">
        <Image src={DECO.br} alt="" width={851} height={1472} sizes="200px" />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-xl flex-col items-center justify-center px-5 sm:px-8">
        <div
          className={`w-full text-center transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <p
            className={`font-goudy-italic mx-auto max-w-2xl px-2 ${sectionType.textRelaxed}`}
            style={{ color: GOLD_SOFT }}
          >
            With grateful hearts, together with our families, we warmly invite you to celebrate with us as we say “I do”
          </p>

          <div className="my-6 sm:my-8">
            <div className="flex items-center justify-center gap-2 pt-1 sm:pt-2">
              <span
                className="h-px w-8 sm:w-12 md:w-16"
                style={{
                  background: `linear-gradient(to right, transparent, color-mix(in srgb, ${GOLD} 70%, transparent))`,
                }}
                aria-hidden
              />
              <span
                className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
                style={{ backgroundColor: GOLD }}
                aria-hidden
              />
              <span
                className="h-px w-8 sm:w-12 md:w-16"
                style={{
                  background: `linear-gradient(to left, transparent, color-mix(in srgb, ${GOLD} 70%, transparent))`,
                }}
                aria-hidden
              />
            </div>
            <p
              className={`font-goudy-italic mx-auto mt-3 max-w-2xl px-2 ${sectionType.textRelaxed}`}
              style={{ color: GOLD_SOFT }}
            >
              at the celebration of a love so dearly cherished
            </p>
          </div>

          <h1 className="hero-invite-names">
            <span className="sr-only">
              {groomName} & {brideName}
            </span>
            <span className="couple-name-lockup" aria-hidden="true" />
          </h1>

          <div className={`hero-invite-details ${cinzel.className}`}>
            <p className="hero-invite-date-month">{weddingMeta.month}</p>

            <div className="hero-invite-date-lockup">
              <div className="hero-invite-date-side">
                {weddingMeta.weekday ? (
                  <>
                    <span className="hero-invite-date-line" />
                    <span className="hero-invite-date-label">{weddingMeta.weekday}</span>
                    <span className="hero-invite-date-line" />
                  </>
                ) : null}
              </div>

              <span className="hero-invite-date-day">{weddingMeta.day}</span>

              <div className="hero-invite-date-side">
                {weddingMeta.time ? (
                  <>
                    <span className="hero-invite-date-line" />
                    <span className="hero-invite-date-label">AT {weddingMeta.time}</span>
                    <span className="hero-invite-date-line" />
                  </>
                ) : null}
              </div>
            </div>

            <p className="hero-invite-date-year">{weddingMeta.year}</p>

            {weddingMeta.venue ? (
              <p className="hero-invite-venue">{weddingMeta.venue}</p>
            ) : null}
          </div>

          <div className="mt-10 sm:mt-12">
            <a
              href="#guest-list"
              className={`${cinzel.className} group inline-flex items-center gap-4 rounded-full border py-1 pl-7 pr-1 text-[0.625rem] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:scale-[1.02] sm:gap-5 sm:py-1.5 sm:pl-9 sm:pr-1.5 sm:text-[0.6875rem] sm:tracking-[0.28em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent`}
              style={{
                backgroundColor: GOLD_SOFT,
                borderColor: `color-mix(in srgb, ${GOLD} 72%, #8a6a18)`,
                color: NAVY,
                boxShadow: `0 8px 22px color-mix(in srgb, ${GOLD} 28%, transparent)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = GOLD
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = GOLD_SOFT
              }}
            >
              <span>Confirm your attendance (RSVP)</span>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10"
                style={{
                  backgroundColor: NAVY,
                  boxShadow: `0 1px 0 color-mix(in srgb, ${GOLD} 18%, transparent)`,
                }}
              >
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                  strokeWidth={2.25}
                  style={{ color: GOLD_SOFT }}
                  aria-hidden
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
