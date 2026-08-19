"use client"

import { useEffect, useState } from "react"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "@/content/site"
import { sectionType, welcomeTitleSize } from "@/lib/section-typography"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const C = {
  cream: "#f7f3e9",
  lift: "#faf7ef",
  champagne: "#DDBA7A",
  gold: "#AB832E",
  slate: "#364061",
} as const

const theSeasons = localFont({
  src: "../../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const aboveTheBeyond = localFont({
  src: "../../Font/above-the-beyond-script.otf",
  display: "swap",
  variable: "--font-above-beyond",
})

const CORNER_DECO_CLASS =
  "block h-auto w-auto max-w-[88px] sm:max-w-[108px] md:max-w-[124px] lg:max-w-[140px]"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 150)
    return () => clearTimeout(t)
  }, [])

  const ceremonyDay = siteConfig.ceremony.day ?? "Saturday"
  const ceremonyTime = siteConfig.ceremony.time
  const ceremonyDate = siteConfig.ceremony.date
  const groomName = siteConfig.couple.groomNickname ?? siteConfig.couple.groom
  const brideName = siteConfig.couple.brideNickname ?? siteConfig.couple.bride

  return (
    <section
      id="home"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative min-h-screen flex items-center justify-center overflow-hidden`}
      style={{
        background: `
          radial-gradient(920px 520px at 50% 8%, color-mix(in srgb, ${C.champagne} 35%, transparent) 0%, transparent 55%),
          radial-gradient(640px 420px at 12% 88%, color-mix(in srgb, ${C.slate} 16%, transparent) 0%, transparent 58%),
          radial-gradient(560px 380px at 92% 78%, color-mix(in srgb, ${C.gold} 14%, transparent) 0%, transparent 55%),
          linear-gradient(180deg, ${C.cream} 0%, ${C.lift} 48%, ${C.cream} 100%)
        `,
      }}
    >
      {/* Date watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className={`${theSeasons.className} text-[clamp(5.5rem,18vw,12rem)] font-extralight tracking-[0.25em] opacity-[0.07]`}
          style={{ color: "var(--color-welcome-navy)" }}
        />
      </div>

      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-0 top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/deco/left-top-corner.png"
          alt=""
          className={CORNER_DECO_CLASS}
        />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/deco/right-top-corner.png"
          alt=""
          className={CORNER_DECO_CLASS}
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/deco/left-bottom-corner.png"
          alt=""
          className={CORNER_DECO_CLASS}
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/deco/right-bottom-corner.png"
          alt=""
          className={CORNER_DECO_CLASS}
        />
      </div>

      <div className="relative z-20 w-full container mx-auto px-5 sm:px-8 md:px-10 flex flex-col items-center justify-center min-h-screen pt-20 sm:pt-24 pb-20 sm:pb-24">
        <div
          className={`w-full max-w-xl text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p
            className={`font-goudy-italic mx-auto max-w-2xl px-2 ${sectionType.textRelaxed}`}
            style={{ color: "var(--color-welcome-text)" }}
          >
            With grateful hearts, together with our families, we warmly invite you to celebrate with us as we say “I do”
          </p>

          <div className="my-6 sm:my-8">
            <div className="flex items-center justify-center gap-2 pt-1 sm:pt-2">
              <span
                className="h-px w-8 sm:w-12 md:w-16"
                style={{
                  background:
                    "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-welcome-navy) 38%, transparent))",
                }}
                aria-hidden
              />
              <span
                className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
                style={{ backgroundColor: "var(--color-welcome-green)" }}
                aria-hidden
              />
              <span
                className="h-px w-8 sm:w-12 md:w-16"
                style={{
                  background:
                    "linear-gradient(to left, transparent, color-mix(in srgb, var(--color-welcome-navy) 38%, transparent))",
                }}
                aria-hidden
              />
            </div>
            <p
              className={`font-goudy-italic mx-auto mt-3 max-w-2xl px-2 ${sectionType.textRelaxed}`}
              style={{ color: "var(--color-welcome-text)" }}
            >
              at the celebration of a love so dearly cherished
            </p>
          </div>

          <h1
            className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
            style={
              {
                "--title-size": welcomeTitleSize.main,
                "--script-size": welcomeTitleSize.script,
              } as React.CSSProperties
            }
          >
            <span
              className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em] pb-1 sm:pb-1.5`}
              style={{
                fontSize: "var(--title-size)",
                color: "var(--color-welcome-navy)",
              }}
            >
              <span className="inline-block align-baseline text-[1.18em] leading-none">
                {groomName[0]}
              </span>
              <span className="inline-block align-baseline ml-1">
                {groomName.slice(1)}
              </span>
            </span>
            <span
              aria-hidden
              className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] my-2 sm:my-2.5 md:my-3`}
              style={{
                fontSize: "var(--script-size)",
                color: "var(--color-welcome-green)",
              }}
            >
              &
            </span>
            <span
              className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em] pb-1 sm:pb-1.5`}
              style={{
                fontSize: "var(--title-size)",
                color: "var(--color-welcome-navy)",
              }}
            >
              <span className="inline-block align-baseline text-[1.18em] leading-none">
                {brideName[0]}
              </span>
              <span className="inline-block align-baseline ml-1">
                {brideName.slice(1)}
              </span>
            </span>
          </h1>

          <div
            className="mt-8 sm:mt-10 space-y-2 sm:space-y-2.5"
            style={{ color: "var(--color-welcome-navy)" }}
          >
            <p
              className={`${cinzel.className} ${sectionType.label} uppercase tracking-[0.18em] leading-relaxed max-w-sm mx-auto font-semibold`}
            >
              {siteConfig.ceremony.location}
            </p>
            <p
              className={`${cinzel.className} ${sectionType.label} uppercase tracking-[0.22em]`}
              style={{ color: "var(--color-welcome-heading)" }}
            >
              Ceremony &amp; Reception
            </p>
          </div>

          <div
            className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t"
            style={{
              borderColor: "color-mix(in srgb, var(--color-welcome-navy) 18%, transparent)",
              color: "var(--color-welcome-navy)",
            }}
          >
            <p
              className={`${cinzel.className} ${sectionType.label} uppercase tracking-[0.2em] font-semibold`}
            >
              {ceremonyDay} · {ceremonyTime}
            </p>
            <p
              className={`font-goudy-italic ${sectionType.text} mt-1.5`}
              style={{ color: "var(--color-welcome-text)" }}
            >
              {ceremonyDate}
            </p>
          </div>

          <div className="mt-10 sm:mt-12">
            <a
              href="#guest-list"
              className={`${cinzel.className} group inline-flex items-center gap-4 rounded-full border py-1 pl-7 pr-1 text-[0.625rem] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:scale-[1.02] sm:gap-5 sm:py-1.5 sm:pl-9 sm:pr-1.5 sm:text-[0.6875rem] sm:tracking-[0.28em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4`}
              style={{
                backgroundColor: "#04103B",
                borderColor: "color-mix(in srgb, #04103B 35%, transparent)",
                color: "var(--color-welcome-bg)",
                boxShadow: "0 6px 20px color-mix(in srgb, #04103B 35%, transparent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#192030"
                e.currentTarget.style.borderColor = "#04103B"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#04103B"
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, #04103B 35%, transparent)"
              }}
            >
              <span>Confirm your attendance (RSVP)</span>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10"
                style={{
                  backgroundColor: "var(--color-welcome-bg)",
                  boxShadow: "0 1px 0 color-mix(in srgb, var(--color-welcome-navy) 10%, transparent)",
                }}
              >
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                  strokeWidth={2.25}
                  style={{ color: "#04103B" }}
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
