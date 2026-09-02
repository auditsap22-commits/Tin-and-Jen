"use client"

import { Section } from "@/components/section"
import { useState, useEffect, type ReactNode } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useSiteConfig } from "@/hooks/use-site-config"
import Image from "next/image"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import {
  Shirt,
  Clock,
  Utensils,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  X,
  MapPin,
} from "lucide-react"

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

const CORNER_DECO_CLASS =
  "block h-auto w-auto max-w-[88px] sm:max-w-[108px] md:max-w-[124px] lg:max-w-[140px]"

const paperWash = {
  cream: "#f7f3e9",
  lift: "#faf7ef",
  champagne: "#DDBA7A",
  gold: "#AB832E",
  slate: "#364061",
} as const

const detailsBackground = `
  radial-gradient(920px 520px at 50% 8%, color-mix(in srgb, ${paperWash.champagne} 35%, transparent) 0%, transparent 55%),
  radial-gradient(640px 420px at 12% 88%, color-mix(in srgb, ${paperWash.slate} 16%, transparent) 0%, transparent 58%),
  radial-gradient(560px 380px at 92% 78%, color-mix(in srgb, ${paperWash.gold} 14%, transparent) 0%, transparent 55%),
  linear-gradient(180deg, ${paperWash.cream} 0%, ${paperWash.lift} 48%, ${paperWash.cream} 100%)
`

function CornerDecorations() {
  return (
    <>
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
    </>
  )
}

const detailText = {
  body: "var(--color-welcome-text)",
  heading: "var(--color-welcome-navy)",
  label: "var(--color-welcome-heading)",
  accent: "var(--color-welcome-green)",
} as const

const cardStyle = {
  background: "var(--color-welcome-bg)",
  borderColor: "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow:
    "0 8px 28px color-mix(in srgb, var(--color-motif-deep) 7%, transparent), inset 0 1px 0 color-mix(in srgb, white 70%, transparent)",
} as const

const softPanelStyle = {
  borderColor: "color-mix(in srgb, var(--color-motif-deep) 10%, transparent)",
  backgroundColor: "var(--color-welcome-bg-soft)",
} as const

const QR_FG = "var(--color-motif-deep)"
const QR_BG = "#FAF7F2"

function SectionIconDivider({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 pt-1 sm:pt-2">
      <span
        className="h-px w-8 sm:w-12 md:w-16"
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-motif-deep) 38%, transparent))",
        }}
      />
      {icon}
      <span
        className="h-px w-8 sm:w-12 md:w-16"
        style={{
          background:
            "linear-gradient(to left, transparent, color-mix(in srgb, var(--color-motif-deep) 38%, transparent))",
        }}
      />
    </div>
  )
}

function DetailsTitle() {
  return (
    <h2
      className="relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": "clamp(2.15rem, 11vw, 4.5rem)",
          "--script-size": "clamp(1.1rem, 4.5vw, 2.25rem)",
        } as React.CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.15em] md:tracking-[0.18em] pb-1 sm:pb-1.5`}
        style={{
          fontSize: "var(--title-size)",
          color: "var(--color-welcome-navy)",
        }}
      >
        Event Details
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: "var(--color-motif-accent)",
        }}
      >
        our special day
      </span>
      <span className="sr-only">our special day</span>
    </h2>
  )
}

// Slightly compact type inside card containers (not the page header)
const ct = {
  label: "text-[11px] sm:text-xs md:text-sm",
  labelSm: "text-[10px] sm:text-[11px] md:text-xs",
  body: "text-xs sm:text-sm md:text-base",
  bodyMd: "text-xs sm:text-sm md:text-base lg:text-lg",
  bodyLg: "text-sm sm:text-base md:text-lg",
  subhead: "text-xs sm:text-sm md:text-base lg:text-lg",
  time: "text-xs sm:text-sm md:text-base lg:text-xl",
  cardTitle: "text-sm sm:text-lg md:text-xl lg:text-2xl",
  overlayTitle: "text-sm sm:text-lg md:text-xl lg:text-2xl",
  overlaySub: "text-xs sm:text-sm md:text-base",
  month: "text-base sm:text-xl md:text-2xl lg:text-3xl",
  dayNum: "text-2xl sm:text-4xl md:text-5xl lg:text-6xl",
  year: "text-base sm:text-xl md:text-2xl lg:text-3xl",
  sectionTitle: "text-sm sm:text-lg md:text-xl lg:text-2xl",
  btn: "text-xs sm:text-sm md:text-base",
  noteTitle: "text-xl sm:text-2xl md:text-3xl",
  reminderHead: "text-base sm:text-lg md:text-xl",
  reminderBody: "text-xs sm:text-sm md:text-base lg:text-lg",
} as const

const reminderInk = {
  navy: "#192030",
  deep: "#04103B",
  slate: "#364061",
  gold: "#AB832E",
  champagne: "#DDBA7A",
} as const

const motifSwatches = [
  reminderInk.deep,
  // reminderInk.navy,
  reminderInk.slate,
  reminderInk.gold,
  reminderInk.champagne,
] as const

function ColorPalette({
  colors,
  frame = "white",
}: {
  colors: readonly string[]
  frame?: "white" | "gold"
}) {
  const widthClass = colors.length > 4 ? "max-w-md" : "max-w-xs sm:max-w-sm"

  return (
    <div
      className={`mx-auto flex h-8 w-full overflow-hidden rounded-full border-2 sm:h-9 ${widthClass}`}
      role="img"
      aria-label={`Color palette: ${colors.join(", ")}`}
      style={{
        borderColor: frame === "gold" ? reminderInk.champagne : "#FFFFFF",
      }}
    >
      {colors.map((color) => (
        <div
          key={color}
          className="min-w-0 flex-1"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  )
}

const INVITATION_WORD = "/decoration/deco/invitation-word-image.png"

function InvitationWordDeco({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute top-[7%] bottom-[7%] z-[5] w-[1.7rem] sm:w-[2.55rem] md:w-[3.4rem] lg:w-[4.15rem] ${
        side === "left"
          ? "left-2.5 sm:left-3.5 md:left-4"
          : "right-2.5 sm:right-3.5 md:right-4"
      }`}
      aria-hidden
    >
      <div
        className={`h-full w-full ${side === "right" ? "-scale-x-100" : ""}`}
        style={{
          backgroundColor: reminderInk.champagne,
          WebkitMaskImage: `url("${INVITATION_WORD}")`,
          maskImage: `url("${INVITATION_WORD}")`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </div>
  )
}

function ReminderTone({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-[34rem] space-y-2 text-center sm:space-y-2.5">
      <p
        className={`${cinzel.className} text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px] md:text-xs`}
        style={{ color: reminderInk.gold }}
      >
        {label}
      </p>
      <p
        className={`font-goudy-italic ${ct.reminderBody} mx-auto max-w-prose text-pretty leading-[1.75]`}
        style={{ color: reminderInk.champagne }}
      >
        {children}
      </p>
    </div>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold not-italic" style={{ color: reminderInk.champagne }}>
      {children}
    </strong>
  )
}

function ReminderCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <article className="mx-auto flex w-full max-w-[34rem] flex-col items-center text-center">
      <h4
        className={`${cinzel.className} mb-5 max-w-[18ch] text-balance font-bold uppercase tracking-[0.12em] sm:mb-7 md:mb-8`}
        style={{
          color: reminderInk.champagne,
          fontSize: "clamp(0.98rem, 4.2vw, 1.85rem)",
        }}
      >
        {title}
      </h4>
      <div className="flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-9">
        {children}
      </div>
    </article>
  )
}

function AttireRowLabel({ children }: { children: string }) {
  const line = {
    background: `linear-gradient(to right, transparent, ${reminderInk.gold}, transparent)`,
  }

  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-3.5">
      <span className="h-px w-10 sm:w-16 md:w-24" style={line} aria-hidden />
      <span
        className="h-1.5 w-1.5 rotate-45 sm:h-2 sm:w-2"
        style={{ backgroundColor: reminderInk.gold }}
        aria-hidden
      />
      <p
        className={`${cinzel.className} ${ct.label} shrink-0 font-semibold uppercase tracking-[0.28em] sm:tracking-[0.34em]`}
        style={{ color: reminderInk.deep }}
      >
        {children}
      </p>
      <span
        className="h-1.5 w-1.5 rotate-45 sm:h-2 sm:w-2"
        style={{ backgroundColor: reminderInk.gold }}
        aria-hidden
      />
      <span
        className="h-px w-10 sm:w-16 md:w-24"
        style={{
          background: `linear-gradient(to left, transparent, ${reminderInk.gold}, transparent)`,
        }}
        aria-hidden
      />
    </div>
  )
}

const attireLooks = [
  {
    label: "Sponsors",
    src: "/Details/sponsorsnew.png",
    alt: "Principal sponsors attire: formal navy, champagne, and silver looks for ninong and ninang",
    width: 543,
    height: 447,
  },
  {
    label: "Entourage",
    src: "/Details/entourage.png",
    alt: "Entourage attire: navy formalwear for the wedding party, including children",
    width: 1224,
    height: 1285,
  },
  {
    label: "Guests",
    src: "/Details/guest2.png",
    alt: "Guest attire: modest navy and champagne formal looks for ladies and gentlemen",
    width: 1536,
    height: 1024,
  },
] as const

const guestSwatches = [
  { color: "#04103B", name: "Navy Blue" },
  { color: "#F4EFE4", name: "Ivory" },
  { color: "#DDBA7A", name: "Champagne Gold" },
] as const

function GuestDressGuide() {
  const siteConfig = useSiteConfig()
  const coupleNames = `${siteConfig.couple.groomNickname || siteConfig.couple.groom} & ${siteConfig.couple.brideNickname || siteConfig.couple.bride}`
  const dateParts = siteConfig.ceremony.date.replace(",", "").split(" ")
  const monthNum =
    [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ].indexOf(dateParts[0]) + 1
  const dayNum = dateParts[1]
  const yearNum = dateParts[2]
  const dateMark =
    monthNum > 0 && dayNum && yearNum
      ? `${String(monthNum).padStart(2, "0")}  •  ${String(dayNum).padStart(2, "0")}  •  ${yearNum}`
      : siteConfig.ceremony.date

  return (
    <article
      className="relative mx-auto overflow-hidden rounded-xl border sm:rounded-2xl"
      style={{
        ...cardStyle,
        background: `linear-gradient(180deg, ${paperWash.lift} 0%, ${paperWash.cream} 48%, ${paperWash.lift} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-3 z-10 sm:inset-4 md:inset-5"
        aria-hidden
        style={{
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${reminderInk.gold} 55%, transparent)`,
        }}
      />

      <div className="relative z-20 px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">
        <header className="relative text-center">
          {siteConfig.couple.monogram ? (
            <div className="absolute left-0 top-0 hidden h-14 w-14 sm:block md:h-16 md:w-16">
              <Image
                src={siteConfig.couple.monogram}
                alt=""
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          ) : null}

          <p
            className={`${cinzel.className} text-[0.55rem] font-semibold uppercase tracking-[0.28em] sm:text-[0.625rem] sm:tracking-[0.34em] md:tracking-[0.4em]`}
            style={{ color: reminderInk.deep }}
          >
            Wedding Guest Dress Guide
          </p>
          <h4
            className={`${theSeasons.className} mt-1 lowercase leading-none tracking-[0.04em] sm:mt-1.5`}
            style={{
              fontSize: "clamp(2.4rem, 8vw, 4.75rem)",
              color: reminderInk.gold,
            }}
          >
            attire
          </h4>
          <div className="mt-3 flex items-center justify-center gap-2 sm:mt-4 sm:gap-3">
            <span
              className="h-px w-8 sm:w-12"
              style={{ backgroundColor: reminderInk.gold }}
              aria-hidden
            />
            <p
              className={`${cinzel.className} text-[0.55rem] font-semibold uppercase tracking-[0.22em] sm:text-[0.625rem] sm:tracking-[0.28em]`}
              style={{ color: reminderInk.deep }}
            >
              Soft • Warm • Nocturnal
            </p>
            <span
              className="h-px w-8 sm:w-12"
              style={{ backgroundColor: reminderInk.gold }}
              aria-hidden
            />
          </div>
        </header>

        <div className="mt-7 flex items-center justify-center gap-4 sm:mt-8 sm:gap-6 md:mt-10 md:gap-8">
          {guestSwatches.map((swatch) => (
            <div key={swatch.name} className="flex flex-col items-center gap-1.5">
              <span
                className="h-11 w-11 rounded-full shadow-inner sm:h-14 sm:w-14 md:h-16 md:w-16"
                style={{
                  backgroundColor: swatch.color,
                  boxShadow: `inset 0 1px 2px rgba(255,255,255,0.22), 0 4px 12px color-mix(in srgb, ${reminderInk.deep} 18%, transparent)`,
                  border: swatch.name === "Ivory" ? `1px solid color-mix(in srgb, ${reminderInk.gold} 45%, transparent)` : "none",
                }}
                title={swatch.name}
                aria-label={swatch.name}
              />
            </div>
          ))}
        </div>

        <p
          className={`font-goudy-italic mx-auto mt-6 max-w-xl text-center ${ct.body} leading-relaxed sm:mt-7`}
          style={{ color: reminderInk.navy }}
        >
          We&apos;re excited to enjoy this special event with you! Our theme is{" "}
          <strong className="font-semibold" style={{ color: reminderInk.deep }}>
            Navy Blue
          </strong>{" "}
          and{" "}
          <strong className="font-semibold" style={{ color: reminderInk.gold }}>
            Champagne Gold
          </strong>
          . We&apos;d love to see you in these colors as we celebrate this meaningful day.
        </p>

        <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-7 md:mt-12 md:space-y-8">
          {attireLooks.map((look) => (
            <div key={look.label} className="space-y-3.5 sm:space-y-4">
              <AttireRowLabel>{look.label}</AttireRowLabel>
              <div className="overflow-hidden">
                <Image
                  src={look.src}
                  alt={look.alt}
                  width={look.width}
                  height={look.height}
                  className="mx-auto h-auto w-full max-h-[min(72vw,28rem)] object-contain sm:max-h-[32rem] md:max-h-[36rem]"
                  sizes="(max-width: 768px) 100vw, 960px"
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className={`font-goudy-italic mx-auto mt-7 max-w-xl space-y-4 text-center ${ct.body} leading-relaxed sm:mt-8`}
          style={{ color: reminderInk.navy }}
        >
          <p className="font-semibold" style={{ color: reminderInk.deep }}>
            Dear Valued Guests,
          </p>
          <p>
            As we gather to celebrate our Christ-centered wedding, we kindly request everyone to
            wear modest and elegant attire as a sign of respect for the solemnity of the ceremony.
          </p>
          <p>
            For our lovely ladies, we respectfully ask that you{" "}
            <strong className="font-semibold not-italic" style={{ color: reminderInk.deep }}>
              avoid wearing very short dresses, plunging necklines, backless dresses, or overly
              revealing outfits
            </strong>
            . We also kindly request that you{" "}
            <strong className="font-semibold not-italic" style={{ color: reminderInk.deep }}>
              refrain from wearing shiny or heavily embellished dresses that may draw too much
              attention
            </strong>
            .
          </p>
          <p>
            To help us maintain our chosen wedding color palette, we kindly ask that guests{" "}
            <strong className="font-semibold not-italic" style={{ color: reminderInk.deep }}>
              avoid wearing white, black, or red dresses
            </strong>
            .
          </p>
          <p>
            Thank you for your understanding and for helping us create a beautiful, respectful, and
            God-honoring celebration.
          </p>
          <p>
            We are truly grateful for your love, support, and presence on our special day. We
            can&apos;t wait to celebrate with you! 💙
          </p>
        </div>

        <footer className="relative mt-8 flex flex-col items-center text-center sm:mt-10">
          <Heart
            className="mb-2 h-3.5 w-3.5 sm:h-4 sm:w-4"
            style={{ color: reminderInk.gold }}
            fill="currentColor"
            aria-hidden
          />
          <p
            className={`${aboveTheBeyond.className} leading-none`}
            style={{
              fontSize: "clamp(1.65rem, 5vw, 2.75rem)",
              color: reminderInk.gold,
            }}
          >
            Thank You!
          </p>
          <p
            className={`${cinzel.className} mt-2 text-[0.55rem] font-semibold uppercase tracking-[0.22em] sm:text-[0.625rem] sm:tracking-[0.28em]`}
            style={{ color: reminderInk.deep }}
          >
            We can&apos;t wait to celebrate with you!
          </p>
          <span
            className="mt-5 block aspect-[2078/363] w-[min(8.5rem,48%)] sm:mt-6"
            role="img"
            aria-label={coupleNames}
            style={{
              background: reminderInk.deep,
              WebkitMaskImage: 'url("/decoration/display-couple.png")',
              maskImage: 'url("/decoration/display-couple.png")',
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          <p
            className={`${cinzel.className} mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.28em] sm:tracking-[0.34em]`}
            style={{ color: reminderInk.gold }}
          >
            {dateMark}
          </p>
        </footer>
      </div>
    </article>
  )
}

type EventVenueCardProps = {
  badge: string
  images: string[]
  activeImageIndex: number
  locationName: string
  venueAddress: string
  venueDetail?: string
  day: string
  dateString: string
  time: string
  arrivalTime?: string
  venueSectionLabel: string
  mapsLink: string
  copyId: string
  fullVenue: string
  copiedItems: Set<string>
  onCopy: (text: string, id: string) => void
  onOpenMaps: (link: string) => void
  showDateDetails?: boolean
}

function EventVenueCard({
  badge,
  images,
  activeImageIndex,
  locationName,
  venueAddress,
  venueDetail,
  day,
  dateString,
  time,
  arrivalTime,
  venueSectionLabel,
  mapsLink,
  copyId,
  fullVenue,
  copiedItems,
  onCopy,
  onOpenMaps,
  showDateDetails = true,
}: EventVenueCardProps) {
  const eventDate = showDateDetails ? new Date(dateString) : null

  return (
    <div className="relative group">
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(to bottom right, color-mix(in srgb, var(--color-welcome-green) 15%, transparent), transparent)",
        }}
      />

      <div
        className="relative rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300"
        style={cardStyle}
      >
        <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
          {images.length === 1 ? (
            <Image
              src={images[0]}
              alt={locationName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
              priority
            />
          ) : (
            images.map((src, index) => {
              const isActive = index === activeImageIndex
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-[opacity,transform] duration-[1600ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] ${
                    isActive
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-[1.06] z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={src}
                    alt={locationName}
                    fill
                    className={`object-cover transition-transform duration-[9000ms] ease-out ${
                      isActive ? "scale-[1.08] group-hover:scale-[1.12]" : "scale-100"
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                    priority={index === 0}
                  />
                </div>
              )
            })
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20 pointer-events-none" />

          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6 z-30">
            <span className={`${cinzel.className} inline-block mb-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white border border-white/30`}>
              {badge}
            </span>
            <h3 className={`${theSeasons.className} text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white mb-1 sm:mb-1.5 drop-shadow-lg uppercase tracking-[0.12em] leading-tight`}>
              {locationName}
            </h3>
            <p className={`${theSeasons.className} text-[10px] sm:text-xs md:text-sm lg:text-base text-white/95 drop-shadow-md tracking-[0.06em] leading-snug`}>
              {venueAddress}
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-5 md:p-7 lg:p-9">
          <div className="text-center mb-5 sm:mb-8 md:mb-10 space-y-2 sm:space-y-2.5 md:space-y-3">
            {showDateDetails && eventDate && (
              <>
                <p
                  className={`${cinzel.className} ${ct.label} font-semibold uppercase tracking-[0.2em]`}
                  style={{ color: detailText.heading }}
                >
                  {day}
                </p>

                <p
                  className={`${cinzel.className} ${ct.month} font-semibold leading-none`}
                  style={{ color: detailText.heading }}
                >
                  {eventDate.toLocaleString("default", { month: "long" })}
                </p>

                <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 py-1 sm:py-2">
                  <p
                    className={`${cinzel.className} ${ct.dayNum} font-semibold leading-none`}
                    style={{ color: detailText.accent }}
                  >
                    {eventDate.getDate()}
                  </p>
                  <div
                    className="h-10 sm:h-12 md:h-14 w-[2px] rounded-full"
                    style={{ backgroundColor: "var(--color-welcome-green)" }}
                  />
                  <p
                    className={`${cinzel.className} ${ct.year} font-semibold leading-none`}
                    style={{ color: detailText.heading }}
                  >
                    {eventDate.getFullYear()}
                  </p>
                </div>
              </>
            )}

            {arrivalTime ? (
              <div className="space-y-1 sm:space-y-1.5">
                <p
                  className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-[0.1em] uppercase ${showDateDetails ? "" : "py-2 sm:py-3"}`}
                  style={{ color: detailText.heading }}
                >
                  Arrival: {arrivalTime}
                </p>
                <p
                  className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-[0.1em] uppercase`}
                  style={{ color: detailText.heading }}
                >
                  Ceremony: {time}
                </p>
              </div>
            ) : (
              <p
                className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-[0.14em] uppercase ${showDateDetails ? "" : "py-2 sm:py-3"}`}
                style={{ color: detailText.heading }}
              >
                At {time}
              </p>
            )}
          </div>

          <div className="rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border" style={softPanelStyle}>
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" style={{ color: detailText.accent }} />
              <div className="flex-1 min-w-0">
                <p className={`${cinzel.className} ${ct.label} font-semibold mb-1.5 sm:mb-2 uppercase tracking-wide`} style={{ color: detailText.label }}>
                  {venueSectionLabel}
                </p>
                <p className={`${theSeasons.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-snug tracking-[0.06em] uppercase`} style={{ color: detailText.heading }}>
                  {locationName}
                </p>
                {venueDetail && (
                  <p className={`${theSeasons.className} ${ct.body} leading-relaxed mt-1 tracking-wide`} style={{ color: detailText.label }}>
                    {venueDetail}
                  </p>
                )}
                <p className={`${theSeasons.className} ${ct.body} leading-relaxed mt-1 tracking-[0.04em]`} style={{ color: detailText.body }}>
                  {venueAddress}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div
                  className="p-1.5 sm:p-2 md:p-2.5 rounded-lg border shadow-sm"
                  style={{
                    backgroundColor: "var(--color-welcome-bg)",
                    borderColor: "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
                  }}
                >
                  <QRCodeSVG
                    value={mapsLink}
                    size={80}
                    level="M"
                    includeMargin={false}
                    fgColor={QR_FG}
                    bgColor={QR_BG}
                  />
                </div>
                <p className={`font-goudy-italic ${ct.label} text-center max-w-[90px]`} style={{ color: detailText.label }}>
                  Scan for directions
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => onOpenMaps(mapsLink)}
              className={`${cinzel.className} flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-full border font-semibold uppercase tracking-[0.12em] ${ct.btn} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
              style={{
                backgroundColor: "var(--color-welcome-green)",
                borderColor: "color-mix(in srgb, var(--color-welcome-navy) 35%, transparent)",
                color: "var(--color-welcome-bg)",
                boxShadow:
                  "0 6px 20px color-mix(in srgb, var(--color-welcome-green) 35%, transparent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-welcome-navy)"
                e.currentTarget.style.borderColor = "var(--color-welcome-green)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-welcome-green)"
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, var(--color-welcome-navy) 35%, transparent)"
              }}
              aria-label={`Get directions to ${badge.toLowerCase()} venue`}
            >
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span>Get Directions</span>
            </button>
            <button
              type="button"
              onClick={() => onCopy(fullVenue, copyId)}
              className={`${cinzel.className} flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border-2 rounded-full font-semibold uppercase tracking-[0.12em] ${ct.btn} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
              style={{
                color: detailText.heading,
                backgroundColor: "var(--color-welcome-bg-soft)",
                borderColor: "color-mix(in srgb, var(--color-motif-deep) 20%, transparent)",
              }}
              aria-label={`Copy ${badge.toLowerCase()} venue address`}
            >
              {copiedItems.has(copyId) ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" style={{ color: "var(--color-welcome-green)" }} />
              ) : (
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              )}
              <span>{copiedItems.has(copyId) ? "Copied!" : "Copy Address"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Colors sourced from globals.css @theme inline — edit there to update everywhere

export function Details() {
  const siteConfig = useSiteConfig()
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [currentCeremonyImageIndex, setCurrentCeremonyImageIndex] = useState(0)
  const [currentReceptionImageIndex, setCurrentReceptionImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)

  const ceremonyImages = siteConfig.ceremony.image
  const receptionImages = siteConfig.reception.image

  useEffect(() => {
    if (ceremonyImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentCeremonyImageIndex((prev) => (prev + 1) % ceremonyImages.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [ceremonyImages.length])

  useEffect(() => {
    if (receptionImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentReceptionImageIndex((prev) => (prev + 1) % receptionImages.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [receptionImages.length])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Venue information from site config
  const ceremonyVenueName = siteConfig.ceremony.location
  const ceremonyVenueDetail = ""
  const ceremonyAddress = siteConfig.ceremony.venue
  const ceremonyVenue = `${ceremonyVenueName}, ${ceremonyAddress}`
  const ceremonyMapsLink = siteConfig.ceremony.map

  const receptionVenueName = siteConfig.reception.location
  const receptionVenueDetail = ""
  const receptionAddress = siteConfig.reception.venue
  const receptionVenue = `${receptionVenueName}, ${receptionAddress}`
  const receptionMapsLink =
    siteConfig.reception.map ||
    `https://maps.google.com/?q=${encodeURIComponent(receptionVenue)}`

  // Aliases used in the image modal
  const ceremonyLocationFormatted = ceremonyVenueName
  const receptionLocationFormatted = receptionVenueName
  const ceremonyLocation = ceremonyVenue
  const receptionLocation = receptionVenue
  const formattedCeremonyDate = siteConfig.ceremony.date
  const formattedReceptionDate = siteConfig.reception.date

  const openInMaps = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }


  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative w-full`}
      style={{ background: detailsBackground }}
    >
      <Section
        id="details"
        className="relative z-10 pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14 overflow-hidden"
      >
        <CornerDecorations />

        {/* Header */}
        <div className="relative z-20 mb-6 px-6 text-center sm:mb-8 sm:px-10 md:mb-10 md:px-12">
          <p
            className={`${cinzel.className} mb-2 text-[0.525rem] font-semibold uppercase tracking-[0.34em] min-[400px]:text-[0.55rem] min-[400px]:tracking-[0.38em] sm:text-[0.575rem] sm:tracking-[0.44em]`}
            style={{ color: "var(--color-welcome-green)" }}
          >
            Our Celebration
          </p>
          <div className="my-4 sm:my-5 md:my-6">
            <DetailsTitle />
          </div>
          <p
            className="font-goudy-italic mx-auto max-w-2xl px-2 text-[0.75rem] leading-[1.62] sm:text-[0.8125rem] sm:leading-[1.65] md:text-[0.84375rem]"
            style={{ color: "var(--color-welcome-text)" }}
          >
            Everything you need to know about our special day.
          </p>

          <SectionIconDivider
            icon={
              <MapPin
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                style={{ color: "var(--color-welcome-green)" }}
                aria-hidden
              />
            }
          />
        </div>

      {/* Venue and Event Information */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 mb-8 sm:mb-10 md:mb-12 space-y-6 sm:space-y-10 md:space-y-14">
        <EventVenueCard
          badge="Ceremony & Reception"
          images={ceremonyImages}
          activeImageIndex={currentCeremonyImageIndex}
          locationName={ceremonyVenueName}
          venueAddress={ceremonyAddress}
          venueDetail={ceremonyVenueDetail}
          day={siteConfig.ceremony.day}
          dateString={siteConfig.ceremony.date}
          time={siteConfig.ceremony.time}
          arrivalTime={siteConfig.ceremony.guestsTime}
          venueSectionLabel="Ceremony & Reception"
          mapsLink={ceremonyMapsLink}
          copyId="ceremony & reception"
          fullVenue={ceremonyVenue}
          copiedItems={copiedItems}
          onCopy={copyToClipboard}
          onOpenMaps={openInMaps}
        />

        {/* <EventVenueCard
          badge="Reception"
          images={receptionImages}
          activeImageIndex={currentReceptionImageIndex}
          locationName={receptionVenueName}
          venueAddress={receptionAddress}
          venueDetail={receptionVenueDetail}
          day={siteConfig.reception.day}
          dateString={siteConfig.reception.date}
          time={siteConfig.reception.time}
          showDateDetails={false}
          venueSectionLabel="Reception Venue"
          mapsLink={receptionMapsLink}
          copyId="reception"
          fullVenue={receptionVenue}
          copiedItems={copiedItems}
          onCopy={copyToClipboard}
          onOpenMaps={openInMaps}
        /> */}
       
      </div>

      {/* Attire Guidelines */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <SectionIconDivider
            icon={
              <Shirt
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                style={{ color: "var(--color-welcome-green)" }}
                aria-hidden
              />
            }
          />
          <h3
            className={`${theSeasons.className} ${ct.sectionTitle} mt-3 font-semibold uppercase leading-tight tracking-[0.12em] sm:mt-4 md:tracking-[0.15em]`}
            style={{ color: "var(--color-welcome-navy)" }}
          >
            Attire Guidelines
          </h3>
        </div>

        <GuestDressGuide />

        {/* Gentle Reminders */}
        <div className="relative z-20 mx-auto mt-6 w-full max-w-3xl px-3 pb-2 sm:mt-8 sm:max-w-4xl sm:px-6 md:px-8 lg:max-w-5xl">
          <div
            className="relative overflow-hidden"
            style={{
              backgroundColor: reminderInk.deep,
              backgroundImage: `radial-gradient(90% 48% at 50% 0%, color-mix(in srgb, ${reminderInk.gold} 18%, transparent) 0%, transparent 62%)`,
              boxShadow: `0 18px 48px color-mix(in srgb, ${reminderInk.deep} 34%, transparent)`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-[0.7rem] z-20 sm:inset-4 md:inset-[1.15rem]"
              aria-hidden
              style={{
                boxShadow: `
                  inset 0 0 0 1px ${reminderInk.gold},
                  inset 0 0 0 5px ${reminderInk.deep},
                  inset 0 0 0 6px ${reminderInk.champagne}
                `,
              }}
            />

            <InvitationWordDeco side="left" />
            <InvitationWordDeco side="right" />

            <div className="relative z-10 mx-auto flex w-full max-w-[40rem] flex-col items-center px-[3.15rem] py-11 text-center sm:max-w-[42rem] sm:px-16 sm:py-14 md:px-[4.75rem] md:py-16">
              <p
                className={`${cinzel.className} mb-8 text-[10px] font-semibold uppercase tracking-[0.32em] text-balance sm:mb-10 sm:text-[11px] md:mb-12`}
                style={{ color: reminderInk.gold }}
              >
                Gentle Reminders
              </p>

              <div className="flex w-full flex-col items-center gap-11 sm:gap-14 md:gap-16">
                <ReminderCard title="Adults-Only Celebration">
                  <ReminderTone label="Formal">
                    While we adore your little ones, we have chosen to celebrate as an{" "}
                    <Note>adults-only affair</Note>, other than the{" "}
                    <Note>children who are part of the entourage</Note>. We hope this gives you a
                    well-deserved night out.
                  </ReminderTone>
                  <ReminderTone label="Warm">
                    We love your kids, but consider this your night off! Please note that our
                    celebration is <Note>adults-only</Note>.
                  </ReminderTone>
                  <ReminderTone label="Tagalog">
                    Bagama&apos;t mahal namin ang inyong mga anak, ang aming pagdiriwang ay{" "}
                    <Note>para lamang sa mga bisitang may sapat na gulang</Note>. Maraming salamat
                    sa inyong pag-unawa.
                  </ReminderTone>
                </ReminderCard>

                <div
                  className="h-px w-14 sm:w-20"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${reminderInk.gold}, transparent)`,
                  }}
                  aria-hidden
                />

                <ReminderCard title="Unplugged Ceremony">
                  <ReminderTone label="Formal">
                    We invite you to be fully present as we exchange our vows. Kindly{" "}
                    <Note>keep phones and cameras away during the ceremony</Note> and let our
                    photographers capture the moment.
                  </ReminderTone>
                  <ReminderTone label="Warm">
                    Be present, <Note>not on your phones</Note>! Enjoy our{" "}
                    <Note>unplugged ceremony</Note> and let our photographers do the clicking.
                  </ReminderTone>
                  <ReminderTone label="Tagalog">
                    Hangga&apos;t maaari,{" "}
                    <Note>iwasan muna ang paggamit ng cellphone at camera</Note> upang lubos
                    nating mapahalagahan ang sagradong seremonya ng aming pag-iisang dibdib.
                  </ReminderTone>
                </ReminderCard>

                <div
                  className="h-px w-14 sm:w-20"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${reminderInk.gold}, transparent)`,
                  }}
                  aria-hidden
                />

                <ReminderCard title="Strictly Formal">
                  <ReminderTone label="Attire">
                    Kindly follow our suggested <Note>attire and color palette</Note> above to
                    match our wedding theme.{" "}
                    <Note>Strictly no casual clothes, shoes, or white-colored attire</Note>. Please
                    also <Note>avoid wearing white, black, or red dresses</Note>.
                  </ReminderTone>
                  <ColorPalette colors={motifSwatches} frame="gold" />
                </ReminderCard>

                <div
                  className="h-px w-14 sm:w-20"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${reminderInk.gold}, transparent)`,
                  }}
                  aria-hidden
                />

                <ReminderCard title="Arrival">
                  <ReminderTone label="Punctuality">
                    To ensure everything runs smoothly, please arrive at{" "}
                    <Note>{siteConfig.ceremony.guestsTime}</Note>. This will give you enough time to
                    find your seat, settle in comfortably, and fully enjoy the beautiful ceremony
                    before it begins at <Note>{siteConfig.ceremony.time}</Note>. We truly
                    appreciate your punctuality and look forward to celebrating this special moment
                    with you.
                  </ReminderTone>
                </ReminderCard>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500"
          onClick={() => setShowImageModal(null)}
          style={{ backgroundColor: "rgba(91,102,85,0.96)" }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "var(--color-motif-cream)", opacity: 0.12 }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "var(--color-motif-cream)", opacity: 0.14, animationDelay: "1s" }}
            />
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] bg-motif-deep rounded-3xl overflow-hidden shadow-2xl border-2 animate-in zoom-in-95 duration-500 group"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: "var(--color-motif-cream)" }}
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{ background: "linear-gradient(to right, var(--color-motif-cream), var(--color-motif-cream), var(--color-motif-deep))" }}
            />

            {/* Enhanced close button */}
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 hover:bg-motif-accent backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 border-2 group/close"
              title="Close (ESC)"
              style={{ backgroundColor: "var(--color-motif-deep)", borderColor: "var(--color-motif-cream)", color: "var(--color-motif-cream)" }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover/close:text-[#E1D5C7] transition-colors" />
            </button>

            {/* Venue badge */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-20">
              <div
                className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border-2"
                style={{ backgroundColor: "var(--color-motif-deep)", borderColor: "var(--color-motif-cream)" }}
              >
                {showImageModal === "ceremony" ? (
                  <>
                    <Heart className="w-4 h-4" fill="var(--color-motif-cream)" style={{ color: "var(--color-motif-cream)" }} />
                    <span className="text-xs sm:text-sm font-bold text-motif-cream">
                      Ceremony Venue
                    </span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4 text-motif-cream" />
                    <span className="text-xs sm:text-sm font-bold text-motif-cream">
                      Reception Venue
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Image section with enhanced effects */}
            <div
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden"
              style={{ backgroundColor: "var(--color-motif-deep)" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

              <Image
                src={
                  showImageModal === "ceremony"
                    ? ceremonyImages[currentCeremonyImageIndex] ?? ceremonyImages[0]
                    : receptionImages[currentReceptionImageIndex] ?? receptionImages[0]
                }
                alt={showImageModal === "ceremony" ? ceremonyLocationFormatted : receptionLocationFormatted}
                fill
                className="object-contain p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="95vw"
                priority
              />
            </div>

            {/* Enhanced content section */}
            <div
              className="relative border-t-2 p-5 sm:p-6 md:p-8 bg-motif-deep backdrop-blur-sm"
              style={{ borderColor: "var(--color-motif-cream)" }}
            >
              {/* Decorative line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-motif-cream/30 to-transparent" />

              <div className="space-y-5">
                {/* Header with venue info */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-3`}
                      style={{ color: "var(--color-motif-cream)" }}
                    >
                      {showImageModal === "ceremony" ? (
                        <Heart className="w-6 h-6 text-motif-cream" fill="var(--color-motif-cream)" />
                      ) : (
                        <Utensils className="w-6 h-6 text-motif-cream" />
                      )}
                      {showImageModal === "ceremony" ? siteConfig.ceremony.venue : siteConfig.reception.venue}
                    </h3>
                    <div className="flex items-center gap-2 text-sm opacity-70 text-motif-cream">
                      <MapPin className="w-4 h-4 text-motif-cream" />
                      <span>
                        {showImageModal === "ceremony"
                          ? ceremonyLocationFormatted
                          : receptionLocationFormatted}
                      </span>
                    </div>

                    {/* Date & Time info */}
                    {showImageModal === "ceremony" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "var(--color-motif-cream)",
                          backgroundColor: "var(--color-motif-deep)",
                          opacity: 0.9,
                          borderColor: "var(--color-motif-cream)",
                        }}
                      >
                        <Clock className="w-4 h-4 text-motif-cream shrink-0" />
                        <span>
                          {formattedCeremonyDate} at {siteConfig.ceremony.time}
                        </span>
                      </div>
                    )}
                    {showImageModal === "reception" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "var(--color-motif-cream)",
                          backgroundColor: "var(--color-motif-deep)",
                          opacity: 0.9,
                          borderColor: "var(--color-motif-cream)",
                        }}
                      >
                        <Clock className="w-4 h-4 text-motif-cream" />
                        <span>
                          {formattedReceptionDate} - {siteConfig.reception.time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          showImageModal === "ceremony"
                            ? ceremonyLocation
                            : receptionLocation,
                          `modal-${showImageModal}`,
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-motif-deep border-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md hover:bg-motif-accent whitespace-nowrap text-motif-cream"
                      title="Copy address"
                      style={{ borderColor: "var(--color-motif-cream)" }}
                    >
                      {copiedItems.has(`modal-${showImageModal}`) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        openInMaps(showImageModal === "ceremony" ? ceremonyMapsLink : receptionMapsLink)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg whitespace-nowrap bg-motif-cream text-motif-deep"
                    >
                      <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>

                {/* Additional info */}
                  <div className="flex items-center gap-2 text-xs opacity-65 text-motif-cream">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    Click outside to close
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </Section>
    </div>
  )
}