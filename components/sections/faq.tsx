"use client"

import { useMemo, useState, type ReactNode } from "react"
import type { SiteConfig } from "@/lib/site-config"
import { Plus } from "lucide-react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { useSiteConfig } from "@/hooks/use-site-config"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"

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

const reminderInk = {
  navy: "#192030",
  deep: "#04103B",
  slate: "#364061",
  gold: "#AB832E",
  champagne: "#DDBA7A",
} as const

const paperWash = {
  cream: "#f7f3e9",
  lift: "#faf7ef",
  champagne: reminderInk.champagne,
  gold: reminderInk.gold,
  slate: reminderInk.slate,
} as const

const creamWash = `
  radial-gradient(920px 520px at 50% 8%, color-mix(in srgb, ${paperWash.champagne} 35%, transparent) 0%, transparent 55%),
  radial-gradient(640px 420px at 12% 88%, color-mix(in srgb, ${paperWash.slate} 16%, transparent) 0%, transparent 58%),
  radial-gradient(560px 380px at 92% 78%, color-mix(in srgb, ${paperWash.gold} 14%, transparent) 0%, transparent 55%),
  linear-gradient(180deg, ${paperWash.cream} 0%, ${paperWash.lift} 48%, ${paperWash.cream} 100%)
`

const palette = {
  body: "var(--color-welcome-text)",
  heading: "var(--color-welcome-navy)",
  label: "var(--color-welcome-heading)",
  accent: "var(--color-welcome-green)",
} as const

const faqPalette = {
  body: palette.body,
  heading: palette.heading,
  label: palette.label,
  accent: reminderInk.gold,
} as const

const headerDividerLineStyle = {
  background:
    "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-motif-deep) 38%, transparent), transparent)",
} as const

const ct = {
  label: sectionType.label,
  body: sectionType.textRelaxed,
  bodyLg: sectionType.textRelaxed,
  question: sectionType.text,
} as const

const linkClass =
  "underline font-semibold transition-colors hover:opacity-80"

function Note({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold not-italic" style={{ color: reminderInk.deep }}>
      {children}
    </strong>
  )
}

function GoldNote({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold not-italic" style={{ color: reminderInk.gold }}>
      {children}
    </strong>
  )
}

interface FAQItem {
  question: string
  answer: ReactNode
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={headerDividerLineStyle} />
      <span className="h-0.5 w-0.5 rounded-full bg-motif-deep/45 sm:h-1 sm:w-1" aria-hidden />
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background:
            "linear-gradient(to left, transparent, color-mix(in srgb, var(--color-motif-deep) 38%, transparent))",
        }}
      />
    </div>
  )
}

function FaqTitle() {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center mt-8 sm:mt-10 md:mt-12"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
          "--script-size": layeredSectionTitleSize.script,
        } as React.CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em] mt-4 pb-1 sm:mt-5 sm:pb-1.5 md:mt-6`}
        style={{
          fontSize: "var(--title-size)",
          color: "var(--color-welcome-navy)",
        }}
      >
        Frequently Asked Questions
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: "var(--color-welcome-green)",
        }}
      >
        Everything you need to know
      </span>
      <span className="sr-only">Everything you need to know</span>
    </h2>
  )
}

function getFaqItems(siteConfig: SiteConfig): FAQItem[] {
  const guestArrival = siteConfig.ceremony.guestsTime ?? "2:30 PM"
  const rsvpPhone = siteConfig.details.rsvp.phone.trim()
  const showRsvpPhone =
    rsvpPhone.length > 0 && !/to be announced/i.test(rsvpPhone)
  const rsvpDeadline = siteConfig.details.rsvp.deadline.replace(/\.\s*$/, "")

  return [
    {
      question: "When is the wedding?",
      answer: (
        <p>
          Our wedding will be held on{" "}
          <Note>
            {siteConfig.ceremony.date}, {siteConfig.ceremony.day}
          </Note>
          , at {siteConfig.ceremony.location}. The ceremony begins at{" "}
          <Note>{siteConfig.ceremony.time}</Note>, and the reception follows at{" "}
          <Note>{siteConfig.reception.time}</Note> at the same venue.
        </p>
      ),
    },
    {
      question: "What time should I arrive?",
      answer: (
        <p>
          Please arrive by <Note>{guestArrival}</Note> so you have time to find your seat and
          settle in. The ceremony will begin promptly at <Note>{siteConfig.ceremony.time}</Note>.
          Entourage members are requested to assemble at{" "}
          <Note>{siteConfig.ceremony.entourageTime}</Note>.
        </p>
      ),
    },
    {
      question: "Where will the ceremony and reception take place?",
      answer: (
        <p>
          Both the ceremony and reception will be held at{" "}
          <Note>
            {siteConfig.ceremony.location}, {siteConfig.ceremony.venue}
          </Note>
          . The ceremony begins at <Note>{siteConfig.ceremony.time}</Note>, and the reception
          follows at <Note>{siteConfig.reception.time}</Note>.{" "}
          <a
            href={siteConfig.ceremony.map}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            style={{ color: faqPalette.accent }}
          >
            Open in Google Maps
          </a>
          .
        </p>
      ),
    },
    {
      question: "How do I RSVP?",
      answer: (
        <>
          <p>
            Please RSVP using the{" "}
            <a
              href="#guest-list"
              className={linkClass}
              style={{ color: faqPalette.accent }}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              guest list
            </a>{" "}
            on this invitation: search for your name and confirm your attendance.
          </p>
          <p>
            Please respond by <Note>{rsvpDeadline}</Note>.
            {showRsvpPhone
              ? ` If you have questions, please contact ${siteConfig.details.rsvp.coordinator} at ${rsvpPhone}.`
              : ` If you have questions, please contact ${siteConfig.details.rsvp.coordinator}.`}
          </p>
        </>
      ),
    },
    {
      question: 'Do we really need to RSVP? We already said "Yes" to the couple.',
      answer: (
        <p>
          Yes, please. We will be needing your <Note>formal RSVP</Note> to consolidate guest
          details and finalize the headcount for <Note>catering and seating</Note>.
        </p>
      ),
    },
    {
      question: "Can I sit anywhere at the reception?",
      answer: (
        <p>
          Please don&apos;t. It took us a lot of effort and discussion to finish the{" "}
          <Note>seating arrangement</Note>, which is planned for everyone&apos;s convenience and
          preference.
        </p>
      ),
    },
    {
      question: 'Can I bring a "Plus One" to the event?',
      answer: (
        <p>
          As much as we would love to accommodate all our friends and family, we have a limited
          number of guests. Please understand that this event is{" "}
          <Note>strictly by invitation only</Note>.
        </p>
      ),
    },
    {
      question: "Can I bring my child to the event?",
      answer: (
        <p>
          While we adore your little ones, we have chosen to celebrate as an{" "}
          <Note>adults-only affair</Note>, other than the{" "}
          <Note>children who are part of the entourage</Note>. We hope this gives you a
          well-deserved night out.
        </p>
      ),
    },
    {
      question:
        'I said "No" to the RSVP but I had a change of plans. I can attend now! What should I do?',
      answer: (
        <p>
          Please check with us first, as we have a <Note>strict guest list</Note>. If seats become
          available, we will let you know as soon as possible. Please{" "}
          <Note>do not attend unannounced</Note>, as we may not have any available seats for you.
        </p>
      ),
    },
    {
      question: "What if I RSVP'd but cannot attend?",
      answer: (
        <p>
          We would love to have you at our wedding, but we understand that there are circumstances
          beyond our control. However, please <Note>let us know as soon as possible</Note> so we
          can reallocate your seat.
        </p>
      ),
    },
    {
      question: "Is there parking available?",
      answer: (
        <p>
          Yes, <Note>parking is available at the venue</Note>. Please arrive a little early so you
          have time to park comfortably.
        </p>
      ),
    },
    {
      question: "What is the dress code?",
      answer: (
        <>
          <p>
            Kindly follow the attire guide in{" "}
            <a
              href="#details"
              className={linkClass}
              style={{ color: faqPalette.accent }}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("details")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Event Details
            </a>
            . Our theme is <Note>Navy Blue</Note> and <GoldNote>Champagne Gold</GoldNote>, and
            guests are asked to wear <Note>modest and elegant formal attire</Note>.
          </p>
          <p>
            For our lovely ladies, please{" "}
            <Note>
              avoid wearing very short dresses, plunging necklines, backless dresses, or overly
              revealing outfits
            </Note>
            . We also kindly request that you{" "}
            <Note>refrain from wearing shiny or heavily embellished dresses</Note>.
          </p>
          <p>
            To keep our wedding color palette, please{" "}
            <Note>avoid wearing white, black, or red dresses</Note>.{" "}
            <Note>Strictly no casual clothes or shoes</Note>.
          </p>
        </>
      ),
    },
    {
      question: "Will the ceremony be unplugged?",
      answer: (
        <p>
          Yes. The greatest gift you can give us during our ceremony is your presence. Kindly{" "}
          <Note>keep phones and cameras away during the ceremony</Note> and let our photographers
          capture the moment. We promise to share the photos with you afterward.
        </p>
      ),
    },
    {
      question: "Can I take photos or videos during the reception?",
      answer: (
        <>
          <p>
            Absolutely! While our ceremony will be <Note>unplugged</Note>, you are more than
            welcome to take <Note>photos and videos during the reception</Note>. Capture the
            laughter, the dancing, and all the special moments, and feel free to{" "}
            <Note>share the memories with us</Note>.
          </p>
          <p>
            <Note>Be present for the vows.</Note> <Note>Capture the celebration.</Note>
          </p>
        </>
      ),
    },
    {
      question: "When is the appropriate time to leave?",
      answer: (
        <p>
          It took us some time to plan a heartfelt wedding that everyone would hopefully enjoy. We
          humbly request that you <Note>celebrate with us until the program ends</Note>. Let&apos;s
          laugh, take pictures, and have fun!
        </p>
      ),
    },
    {
      question: "What if I have dietary restrictions or allergies?",
      answer: (
        <p>
          Please let us know about any dietary restrictions or allergies{" "}
          <Note>when you RSVP</Note>. We want to ensure everyone can enjoy the celebration
          comfortably.
        </p>
      ),
    },
    {
      question: "How can I help the couple have a great time during their wedding?",
      answer: (
        <ul className="list-none space-y-2.5 text-left">
          <li>
            Pray with us for favorable weather and the continuous blessings of our Lord as we enter
            this new chapter of our lives as husband and wife.
          </li>
          <li>
            <Note>RSVP as soon as your schedule is cleared.</Note>
          </li>
          <li>
            Dress according to the <Note>attire guide and color palette</Note>.
          </li>
          <li>
            <Note>Arrive on time</Note> by {guestArrival}.
          </li>
          <li>
            Follow the <Note>seating arrangement</Note> at the reception.
          </li>
          <li>
            <Note>Stay until the end of the program.</Note>
          </li>
          <li>Join the activities and enjoy!</li>
        </ul>
      ),
    },
  ]
}

function FaqAnswer({ answer }: { answer: ReactNode }) {
  return (
    <div
      className={`font-goudy-italic ${ct.body} space-y-3`}
      style={{ color: faqPalette.body }}
    >
      {answer}
    </div>
  )
}

export function FAQ() {
  const siteConfig = useSiteConfig()
  const faqItems = useMemo(() => getFaqItems(siteConfig), [siteConfig])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative z-10 isolate overflow-hidden pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14`}
      style={{ background: creamWash }}
    >
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

      {/* Header */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center @container/faq sm:px-10 md:px-12">
        <div className="mx-auto mb-5 sm:mb-6 md:mb-7">
          <OrnamentalDivider />
        </div>
        <div className="mx-auto">
          <FaqTitle />
        </div>
        <p
          className={`font-goudy-italic mx-auto mt-4 max-w-2xl px-2 sm:mt-5 md:mt-6 ${ct.bodyLg}`}
          style={{ color: palette.body }}
        >
          Helpful notes so you can simply arrive, celebrate, and enjoy this new chapter with us.
        </p>
        <div className="flex items-center justify-center pt-3 sm:pt-4">
          <span className="h-px w-16 sm:w-24 md:w-32" style={headerDividerLineStyle} />
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="relative z-20 mx-auto mt-6 w-full max-w-3xl px-4 pb-2 sm:mt-8 sm:max-w-4xl sm:px-6 md:px-8 lg:max-w-5xl">
        <div className="space-y-2.5 sm:space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index
              const contentId = `faq-item-${index}`
              const number = String(index + 1).padStart(2, "0")
              return (
                <div
                  key={index}
                  className="relative z-20 overflow-hidden rounded-xl border transition-all duration-300"
                  style={{
                    borderColor: isOpen
                      ? `color-mix(in srgb, ${reminderInk.gold} 55%, transparent)`
                      : "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
                    backgroundColor: isOpen
                      ? `color-mix(in srgb, ${reminderInk.gold} 10%, ${paperWash.cream})`
                      : "var(--color-welcome-bg)",
                    boxShadow: isOpen
                      ? `inset 3px 0 0 ${reminderInk.gold}`
                      : "0 8px 28px color-mix(in srgb, var(--color-motif-deep) 7%, transparent), inset 0 1px 0 color-mix(in srgb, white 70%, transparent)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-start gap-3 px-3.5 py-3.5 text-left outline-none transition-colors duration-200 sm:gap-4 sm:px-5 sm:py-4 md:px-6"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                  >
                    <span
                      className={`${cinzel.className} mt-0.5 shrink-0 text-[10px] font-semibold tracking-[0.16em] sm:text-[11px]`}
                      style={{ color: isOpen ? faqPalette.accent : faqPalette.label }}
                    >
                      {number}
                    </span>
                    <span
                      className={`${cinzel.className} ${ct.question} min-w-0 flex-1 font-semibold leading-snug transition-colors duration-200`}
                      style={{ color: isOpen ? faqPalette.accent : faqPalette.heading }}
                    >
                      {item.question}
                    </span>
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center transition-colors duration-300 sm:h-8 sm:w-8"
                      style={{ color: isOpen ? faqPalette.accent : faqPalette.label }}
                      aria-hidden
                    >
                      <Plus
                        className={`h-3.5 w-3.5 transition-transform duration-300 sm:h-4 sm:w-4 ${isOpen ? "rotate-45" : ""}`}
                        strokeWidth={2.25}
                      />
                    </span>
                  </button>

                  <div
                    id={contentId}
                    role="region"
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="border-t px-3.5 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4 md:px-6"
                        style={{
                          borderColor: `color-mix(in srgb, ${reminderInk.gold} 28%, transparent)`,
                        }}
                      >
                        <FaqAnswer answer={item.answer} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}
