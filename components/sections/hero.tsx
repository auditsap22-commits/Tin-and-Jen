"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Cinzel } from "next/font/google"
import Image from "next/image"
import { useSiteConfig } from "@/hooks/use-site-config"
import { parseWeddingDate } from "@/lib/wedding-date"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const C = {
  forest: "#5d6f47",
  sage: "#949981",
  mustard: "#eec853",
  butter: "#f4dd97",
  cream: "#f7f3e9",
  ink: "#3a3128",
} as const

const DECO = {
  tl: "/decoration/left-top-corner.png",
  tr: "/decoration/right-top-corner.png",
  bl: "/decoration/left-bottom-corner.png",
  br: "/decoration/right-bottom-corner.png",
} as const

const entryEase = [0.22, 1, 0.36, 1] as const

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
  const siteConfig = useSiteConfig()
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 40)
    return () => window.clearTimeout(id)
  }, [])

  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride

  const parsedDate = useMemo(
    () => parseWeddingDate(siteConfig.ceremony.date ?? siteConfig.wedding.date),
    [siteConfig.ceremony.date, siteConfig.wedding.date],
  )

  const weekday = (
    siteConfig.ceremony.day ?? parsedDate.dayOfWeek
  ).toUpperCase()
  const month = parsedDate.month.toUpperCase()
  const dayNumber = parsedDate.day
  const year = parsedDate.year
  const ceremonyTime = formatClockTime(
    siteConfig.ceremony.time ?? siteConfig.wedding.time,
  )
  const venueTitle =
    siteConfig.ceremony.location || siteConfig.wedding.venue
  const venueAddress = siteConfig.ceremony.venue || ""

  const fadeUp = (delay: number) => {
    if (reduceMotion) {
      return { initial: false as const, animate: { opacity: 1, y: 0 } }
    }
    return {
      initial: { opacity: 0, y: 18 },
      animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
      transition: { duration: 0.85, delay, ease: entryEase },
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          radial-gradient(920px 520px at 50% 8%, color-mix(in srgb, ${C.butter} 35%, transparent) 0%, transparent 55%),
          radial-gradient(640px 420px at 12% 88%, color-mix(in srgb, ${C.sage} 16%, transparent) 0%, transparent 58%),
          radial-gradient(560px 380px at 92% 78%, color-mix(in srgb, ${C.mustard} 14%, transparent) 0%, transparent 55%),
          linear-gradient(180deg, ${C.cream} 0%, #faf7ef 48%, ${C.cream} 100%)
        `,
        color: C.ink,
      }}
    >
      {/* Corner florals — LoadingScreen deco */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        <Image
          src={DECO.tl}
          alt=""
          width={320}
          height={320}
          priority
          className="absolute left-0 top-0 h-auto w-[min(22vw,88px)] opacity-90 sm:w-[108px] md:w-[124px]"
        />
        <Image
          src={DECO.tr}
          alt=""
          width={320}
          height={320}
          priority
          className="absolute right-0 top-0 h-auto w-[min(22vw,88px)] opacity-90 sm:w-[108px] md:w-[124px]"
        />
        <Image
          src={DECO.bl}
          alt=""
          width={360}
          height={360}
          className="absolute bottom-0 left-0 h-auto w-[min(28vw,112px)] opacity-95 sm:w-[136px] md:w-[160px]"
        />
        <Image
          src={DECO.br}
          alt=""
          width={360}
          height={360}
          className="absolute bottom-0 right-0 h-auto w-[min(28vw,112px)] opacity-95 sm:w-[136px] md:w-[160px]"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 pb-[clamp(7rem,18vw,11rem)] pt-[clamp(7.5rem,18vw,11rem)] sm:px-10">
        <div className="flex w-full flex-col items-center text-center">
          <motion.p
            className={`${cinzel.className} text-[0.68rem] font-medium uppercase tracking-[0.28em] sm:text-[0.72rem] sm:tracking-[0.34em]`}
            style={{ color: C.forest }}
            {...fadeUp(0.05)}
          >
            Together with their families
          </motion.p>

          <motion.div
            className="mt-6 w-full max-w-[min(22rem,92%)] sm:mt-8 sm:max-w-[28rem] md:max-w-[32rem]"
            {...fadeUp(0.12)}
          >
            <div
              className="couple-name-lockup"
              role="img"
              aria-label={`${groomName} and ${brideName}`}
            />
          </motion.div>

          <motion.p
            className="mt-5 max-w-md text-[0.95rem] leading-relaxed sm:mt-6 sm:text-[1.05rem]"
            style={{
              color: `color-mix(in srgb, ${C.ink} 78%, white)`,
              fontFamily: '"SortsMillGoudy", Georgia, "Times New Roman", serif',
            }}
            {...fadeUp(0.2)}
          >
            joyfully invite you to the celebration of
            <br className="hidden sm:block" /> their marriage
          </motion.p>

          {/* Date block — month / weekday · day · time / year */}
          <motion.div
            className="mt-8 flex w-full max-w-md flex-col items-center gap-3 sm:mt-10 sm:gap-3.5"
            {...fadeUp(0.28)}
          >
            <span
              className={`${cinzel.className} text-[0.68rem] font-medium uppercase tracking-[0.34em] sm:text-[0.75rem] sm:tracking-[0.4em]`}
              style={{ color: C.forest }}
            >
              {month}
            </span>

            <div className="flex w-full items-center gap-3 sm:gap-5">
              <div className="flex flex-1 flex-col items-center gap-2">
                <span className="h-px w-full" style={{ background: `color-mix(in srgb, ${C.sage} 55%, transparent)` }} />
                <span
                  className={`${cinzel.className} text-[0.62rem] font-medium uppercase tracking-[0.22em] sm:text-[0.68rem] sm:tracking-[0.28em]`}
                  style={{ color: C.forest }}
                >
                  {weekday}
                </span>
                <span className="h-px w-full" style={{ background: `color-mix(in srgb, ${C.sage} 55%, transparent)` }} />
              </div>

              <span
                className={`${cinzel.className} min-w-[3.5rem] text-center text-[clamp(3.25rem,12vw,4.75rem)] font-medium leading-none tracking-wide`}
                style={{ color: C.forest }}
              >
                {dayNumber}
              </span>

              <div className="flex flex-1 flex-col items-center gap-2">
                <span className="h-px w-full" style={{ background: `color-mix(in srgb, ${C.sage} 55%, transparent)` }} />
                <span
                  className={`${cinzel.className} text-[0.62rem] font-medium uppercase tracking-[0.18em] sm:text-[0.68rem] sm:tracking-[0.22em]`}
                  style={{ color: C.forest }}
                >
                  {ceremonyTime}
                </span>
                <span className="h-px w-full" style={{ background: `color-mix(in srgb, ${C.sage} 55%, transparent)` }} />
              </div>
            </div>

            <span
              className={`${cinzel.className} text-[0.68rem] font-medium uppercase tracking-[0.34em] sm:text-[0.75rem] sm:tracking-[0.4em]`}
              style={{ color: C.forest }}
            >
              {year}
            </span>
          </motion.div>

          <motion.div className="mt-6 sm:mt-7" {...fadeUp(0.36)}>
            <p
              className={`${cinzel.className} text-[0.72rem] font-semibold uppercase tracking-[0.2em] sm:text-[0.8rem] sm:tracking-[0.24em]`}
              style={{ color: C.forest }}
            >
              {venueTitle}
            </p>
            {venueAddress ? (
              <p
                className="mt-1.5 text-[0.9rem] sm:text-[0.95rem]"
                style={{
                  color: `color-mix(in srgb, ${C.ink} 70%, white)`,
                  fontFamily: '"SortsMillGoudy", Georgia, "Times New Roman", serif',
                }}
              >
                {venueAddress}
              </p>
            ) : null}
          </motion.div>

          <motion.p
            className="mt-6 font-goudy-italic text-[0.92rem] italic sm:mt-7 sm:text-[1rem]"
            style={{ color: C.sage }}
            {...fadeUp(0.46)}
          >
            Dinner and dancing to follow
          </motion.p>

          <motion.a
            href="#guest-list"
            className={`${cinzel.className} mt-8 inline-flex min-h-11 items-center justify-center px-8 text-[0.62rem] font-semibold uppercase tracking-[0.28em] transition-[background,transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:mt-9 sm:min-h-12 sm:px-10 sm:text-[0.68rem]`}
            style={{
              backgroundColor: C.mustard,
              color: C.ink,
              boxShadow: `0 10px 24px color-mix(in srgb, ${C.mustard} 35%, transparent)`,
            }}
            {...fadeUp(0.52)}
          >
            Confirm Attendance
          </motion.a>
        </div>
      </div>
    </section>
  )
}
