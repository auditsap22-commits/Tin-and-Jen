"use client"

import type React from "react"
import { useSiteConfig } from "@/hooks/use-site-config"
import type { SiteConfig } from "@/lib/site-config"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"
import { motion } from "motion/react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import Image from "next/image"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

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

const OUTSIDE_TEXT = "#FFFFFF"
const OUTSIDE_TEXT_MUTED = "rgba(255, 255, 255, 0.88)"
const OUTSIDE_TITLE_SHADOW =
  "0 2px 6px rgba(0, 0, 0, 0.28), 0 0 18px rgba(0, 0, 0, 0.12)"

const TIMELINE_TEXT = OUTSIDE_TEXT
const TIMELINE_SVG_STROKE = "#FFFFFF"
const READABLE_SHADOW = "0 1px 3px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.35)"
const ICON_SHADOW = "drop-shadow(0 2px 6px rgba(0,0,0,0.55)) drop-shadow(0 0 10px rgba(0,0,0,0.35))"

const SECTION_GRADIENT =
  "linear-gradient(180deg, transparent 0%, color-mix(in srgb, #1a1510 18%, transparent) 18%, color-mix(in srgb, #1a1510 38%, transparent) 50%, color-mix(in srgb, #1a1510 18%, transparent) 82%, transparent 100%)"

const outsideDividerLineStyle = {
  background:
    "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.55), transparent)",
} as const

type TimelineIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

interface TimelineEvent {
  time: string
  title: string
  description?: string
  location?: string
  icon: TimelineIcon
  imageSrc?: string
}

function OutsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={outsideDividerLineStyle} />
      <span className="h-0.5 w-0.5 rounded-full bg-white/50 sm:h-1 sm:w-1" aria-hidden />
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(255, 255, 255, 0.55), transparent)",
        }}
      />
    </div>
  )
}

function TimelineTitle() {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
          "--script-size": layeredSectionTitleSize.script,
        } as React.CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em] pb-1 sm:pb-1.5`}
        style={{
          fontSize: "var(--title-size)",
          color: OUTSIDE_TEXT,
          textShadow: OUTSIDE_TITLE_SHADOW,
        }}
      >
        Wedding Timeline
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: OUTSIDE_TEXT_MUTED,
          textShadow: OUTSIDE_TITLE_SHADOW,
        }}
      >
        Our day, moment by moment
      </span>
      <span className="sr-only">Our day, moment by moment</span>
    </h2>
  )
}

function buildTimelineEvents(siteConfig: SiteConfig): TimelineEvent[] {
  const receptionVenue = siteConfig.reception.location

  return [
    // {
    //   time: "2:30 PM",
    //   title: "Arrival",
    //   location: siteConfig.ceremony.location,
    //   icon: GuestsIcon,
    //   imageSrc: "/weddingtimeline/assemble.png",
    // },
    {
      time: "3:30 PM",
      title: "Assembly  ",
      location: siteConfig.ceremony.location,
      icon: GuestsIcon,
      imageSrc: "/weddingtimeline/arrivalimage.png",
    },
    {
      time: "4:00 PM",
      title: "Processional ",
      location: siteConfig.ceremony.location,
      icon: RingsIcon,
      imageSrc: "/weddingtimeline/WeddingCeremony.png",
    }, 
    {
      time: "5:00 PM",
      title: "Photos",
      location: siteConfig.ceremony.location,
      icon: RingsIcon,
      imageSrc: "/weddingtimeline/PhotoSession.png",
    },

    {
      time: "5:30 PM",
      title: "Cocktail Hour",
      location: siteConfig.ceremony.location,
      icon: CocktailIcon,
      imageSrc: "/weddingtimeline/CockTailHour.png",
    },

    {
      time: "6:00 PM",
      title: "Reception",
      location: siteConfig.ceremony.location,
      icon: DinnerIcon,
      imageSrc: "/weddingtimeline/reception welcom.png",
    },
    // {
    //   time: "7:00 PM",
    //   title: "Reception Program",
    //   location: siteConfig.reception.location,
    //   icon: FireworksIcon,
    //   imageSrc: "/weddingtimeline/dance.png",
    // },
    {
      time: "7:00 PM",
      title: "Dinner",
      location: siteConfig.ceremony.location,
      icon: DinnerIcon,
      imageSrc: "/weddingtimeline/DinnerService.png",
    },
     {
      time: "8:30 PM",
       title: "End of Program",
     location: siteConfig.ceremony.location,
     icon: DanceIcon,
     imageSrc: "/weddingtimeline/SendOff.png",
  },
  ]
}

export function WeddingTimeline() {
  const siteConfig = useSiteConfig()
  const timelineEvents = buildTimelineEvents(siteConfig)

  return (
    <section
      id="wedding-timeline"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative z-10 overflow-hidden bg-transparent py-10 sm:py-12 md:py-16 lg:py-20`}
    >
      {/* Soft dark veil for white text readability over silk */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-[2] w-screen -translate-x-1/2"
        aria-hidden
        style={{ background: SECTION_GRADIENT }}
      />

      {/* Header */}
      <div className="relative z-10 mx-auto mb-8 max-w-5xl px-3 text-center @container/timeline sm:mb-10 sm:px-4 md:mb-12">
        <div className="mx-auto mb-5 sm:mb-6 md:mb-7">
          <OutsideDivider />
        </div>
        <div className="mx-auto mt-2 sm:mt-3 md:mt-4">
          <TimelineTitle />
        </div>
        <p
          className={`font-goudy-italic mx-auto mt-4 max-w-xl px-2 sm:mt-5 md:mt-6 ${sectionType.textRelaxed}`}
          style={{ color: OUTSIDE_TEXT_MUTED }}
        >
          A simple overview of the key moments of our day, from arrival to farewell.
        </p>
        <div className="mt-4 flex items-center justify-center sm:mt-5">
          <span className="h-px w-16 sm:w-24 md:w-32 bg-white/50" />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 mx-auto max-w-6xl px-3 sm:px-5 lg:px-8">
        <div
          className="absolute inset-y-0 left-1/2 z-0 w-[2px] -translate-x-1/2 pointer-events-none sm:w-px opacity-80"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-motif-cream) 60%, transparent), transparent)",
          }}
        />

        <div className="space-y-7 sm:space-y-8 md:space-y-10 lg:space-y-12">
          {timelineEvents.map((event, index) => (
            <TimelineItem key={`${event.title}-${event.time}-${index}`} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const Icon = event.icon
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative z-10"
    >
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-x-10 lg:gap-x-14">
        <div className={isEven ? "" : "text-right"}>
          <div className="flex items-center justify-end gap-4">
            {!isEven ? (
              <TimelineText event={event} align="right" />
            ) : (
              <IconMark Icon={Icon} imageSrc={event.imageSrc} />
            )}
            <div
              className="hidden h-px w-10 opacity-70 lg:block"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 65%, transparent)",
              }}
            />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: TIMELINE_TEXT }} />
        </div>

        <div>
          <div className="flex items-center justify-start gap-4">
            <div
              className="hidden h-px w-10 opacity-70 lg:block"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 65%, transparent)",
              }}
            />
            {isEven ? (
              <TimelineText event={event} align="left" />
            ) : (
              <IconMark Icon={Icon} imageSrc={event.imageSrc} />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-6 md:hidden">
        <div className={isEven ? "" : "text-right"}>
          <div className="flex items-center justify-end gap-3">
            {!isEven ? (
              <TimelineText event={event} align="right" />
            ) : (
              <IconMark Icon={Icon} imageSrc={event.imageSrc} mobile />
            )}
            <div
              className="h-px w-6 opacity-70"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 65%, transparent)",
              }}
            />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: TIMELINE_TEXT }} />
        </div>

        <div>
          <div className="flex items-center justify-start gap-3">
            <div
              className="h-px w-6 opacity-70"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 65%, transparent)",
              }}
            />
            {isEven ? (
              <TimelineText event={event} align="left" />
            ) : (
              <IconMark Icon={Icon} imageSrc={event.imageSrc} mobile />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TimelineText({
  event,
  align,
}: {
  event: TimelineEvent
  align: "left" | "right"
}) {
  const textAlign = align === "right" ? "text-right" : "text-left"

  return (
    <div className={`max-w-md ${textAlign} ${align === "right" ? "ml-auto" : "mr-auto"}`}>
      <p
        className={`${cinzel.className} ${sectionType.label} tracking-[0.22em] uppercase`}
        style={{ color: TIMELINE_TEXT, textShadow: READABLE_SHADOW }}
      >
        {event.title}
      </p>
      <p
        className={`font-goudy-italic ${sectionType.textSnug} mt-0.5 opacity-95`}
        style={{ color: TIMELINE_TEXT, textShadow: READABLE_SHADOW }}
      >
        at {event.time}
      </p>

      {event.description && (
        <p
          className={`font-goudy-italic ${sectionType.textRelaxed} mt-1.5 opacity-90`}
          style={{ color: TIMELINE_TEXT, textShadow: READABLE_SHADOW }}
        >
          {event.description}
        </p>
      )}

      {event.location && (
        <p
          className={`font-goudy-italic ${sectionType.text} mt-1.5 leading-relaxed opacity-90`}
          style={{ color: TIMELINE_TEXT, textShadow: READABLE_SHADOW }}
        >
          {event.location}
        </p>
      )}
    </div>
  )
}

function IconMark({
  Icon,
  mobile,
  imageSrc,
}: {
  Icon: TimelineIcon
  mobile?: boolean
  imageSrc?: string
}) {
  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt=""
        width={96}
        height={96}
        className={`${
          mobile ? "h-16 w-16" : "h-18 w-18 lg:h-22 lg:w-22"
        } object-contain`}
        style={{ filter: `${ICON_SHADOW} brightness(0) invert(1)` }}
      />
    )
  }

  return (
    <div
      className={`${
        mobile ? "h-14 w-14" : "h-16 w-16 lg:h-18 lg:w-18"
      } flex items-center justify-center rounded-full border bg-white/15`}
      style={{
        borderColor: "color-mix(in srgb, var(--color-motif-cream) 45%, transparent)",
        filter: ICON_SHADOW,
      }}
    >
      <Icon
        className={`${mobile ? "h-7 w-7" : "h-8 w-8 lg:h-9 lg:w-9"}`}
        style={{ color: TIMELINE_TEXT }}
      />
    </div>
  )
}

const iconStroke = TIMELINE_SVG_STROKE

function GuestsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 16a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M21 16a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 21 16Z" />
      <path d="M4 24.5c1.2-3 3.9-4.5 7-4.5s5.8 1.5 7 4.5" />
      <path d="M17.5 19.5A6 6 0 0 1 26 24" />
    </svg>
  )
}

function RingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="20" r="6" />
      <circle cx="20" cy="20" r="6" />
      <path d="M14 9 16 5l2 4" />
      <path d="M13 7h6" />
    </svg>
  )
}

function FireworksIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 5v4" />
      <path d="M9 7l2.5 2.5" />
      <path d="M23 7 20.5 9.5" />
      <path d="M8 14h4" />
      <path d="M20 14h4" />
      <path d="M11 21 8 24" />
      <path d="M21 21 24 24" />
      <circle cx="16" cy="14" r="3" />
    </svg>
  )
}

function DinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="16" cy="16" r="7" />
      <path d="M7 8v12" />
      <path d="M9.5 8v12" />
      <path d="M23 8v12" />
      <path d="M5 24h22" />
    </svg>
  )
}

function CocktailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 28h16" />
      <path d="M16 28V12" />
      <path d="M10 12h12l-1-4H11l-1 4Z" />
      <circle cx="16" cy="8" r="2" />
      <path d="M12 16h8" />
    </svg>
  )
}

function DanceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke={iconStroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10" cy="12" r="3" />
      <circle cx="22" cy="12" r="3" />
      <path d="M10 15v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
      <path d="M12 23v2" />
      <path d="M20 23v2" />
      <path d="M8 18h16" />
      <path d="M16 5v4" />
      <path d="M13 7l3-2 3 2" />
    </svg>
  )
}
