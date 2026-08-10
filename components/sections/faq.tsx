"use client"

import { useMemo, useState, type ReactNode } from "react"
import type { SiteConfig } from "@/lib/site-config"
import { ChevronDown } from "lucide-react"
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
  "block h-auto w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[380px]"

const palette = {
  body: "var(--color-welcome-text)",
  heading: "var(--color-welcome-navy)",
  label: "var(--color-welcome-heading)",
  accent: "var(--color-welcome-green)",
} as const

const dividerLineStyle = {
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

const cardStyle = {
  background: "var(--color-welcome-bg)",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
  boxShadow:
    "0 8px 28px color-mix(in srgb, var(--color-motif-deep) 7%, transparent), inset 0 1px 0 color-mix(in srgb, white 70%, transparent)",
} as const

interface FAQItem {
  question: string
  answer: string | ReactNode
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={dividerLineStyle} />
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
  const guestArrival = siteConfig.ceremony.guestsTime ?? "30–45 minutes before the ceremony"
  const dressTheme = siteConfig.dressCode.theme

  return [
    {
      question: "When is the wedding?",
      answer: `Our wedding will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day}).`,
    },
    {
      question: "What time should I arrive for the ceremony?",
      answer: `Please arrive at ${guestArrival}. The ceremony will begin promptly at ${siteConfig.ceremony.time}.`,
    },
    {
      question: "Where will the ceremony take place?",
      answer: `Our ceremony will be held at ${siteConfig.ceremony.location}, located at ${siteConfig.ceremony.venue}.`,
    },
    {
      question: "How do I RSVP?",
      answer: (
        <>
          Please RSVP using the{" "}
          <a
            href="#guest-list"
            className={linkClass}
            style={{ color: palette.accent }}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            guest list
          </a>{" "}
          on this invitation: search for your name and confirm your attendance.
          {"\n\n"}
          Please respond by {siteConfig.details.rsvp.deadline.replace(/\.\s*$/, "")}.
          {"\n\n"}
          If you have questions, please contact {siteConfig.details.rsvp.coordinator} at{" "}
          {siteConfig.details.rsvp.phone}.
        </>
      ),
    },
    {
      question: 'Do we really need to RSVP? We already said "Yes" to the couple.',
      answer:
        "Yes, please. We will be needing your formal RSVP to consolidate guest details and finalize the headcount for catering and seating purposes.",
    },
    {
      question: "Can I sit anywhere at the reception?",
      answer:
        "Please don't. It took us a lot of effort and discussion to finish the seating arrangement, which is planned for everyone's convenience and preference.",
    },
    {
      question: 'Can I bring a "Plus One" to the event?',
      answer:
        "As much as we would love to accommodate all our friends and family, we have a limited number of guests. Please understand that this event is strictly by invitation only.",
    },
    {
      question: "Can I bring my child to the event?",
      answer:
        'As much as we each adore your little ones, we cannot include children at our ceremony and reception, other than those that are part of the entourage, due to constraints on our venue\'s capacity. We are looking forward to celebrating a Parents\' "Night Out" with you!',
    },
    {
      question:
        'I said "No" to the RSVP but I had a change of plans—I can attend now! What should I do?',
      answer:
        "Please check with us first as we have a strict guest list. If seats become available, we will let you know as soon as possible. Please do not attend unannounced, as we may not have any available seats for you.",
    },
    {
      question: "What if I RSVP'd but cannot attend?",
      answer:
        "We would love to have you at our wedding, but we understand that there are circumstances beyond our control. However, please let us know as soon as possible so we can reallocate your seat/s.",
    },
    {
      question: "Is there parking available?",
      answer:
        "Yes, parking is available at the venue, and parking attendants, along with our coordinators, will assist you on the day.",
    },
    {
      question: "What is the dress code?",
      answer: `${dressTheme}. ${siteConfig.dressCode.note} You can find outfit inspiration and palette details in the Event Details section above.`,
    },
    {
      question: "Unplugged Ceremony",
      answer:
        "EYES UP, PHONES DOWN, HEARTS OPEN.\n\nThe greatest gift you can give us during our ceremony is your presence. We respectfully request that guests refrain from taking photos or videos during the ceremony so our official photographers can capture every moment without distraction. We promise to share the beautiful photos with you afterward!\n\nOur professional photographers will be capturing every beautiful memory, and we promise to share the photos with everyone afterwards.",
    },
    {
      question: "Can I take photos or videos during the reception?",
      answer:
        "Yes! While our I DO's will be unplugged, our reception will not be. As a couple who loves photos and memories, we would love for you to capture the fun moments throughout the evening. We prepared this celebration wholeheartedly and we want everyone to enjoy it fully.",
    },
    {
      question: "When is the appropriate time to leave?",
      answer:
        "It took us some time to plan for a heartfelt wedding that everyone would hopefully enjoy. We humbly request that you celebrate with us until the program ends. Let's laugh, take pictures, sing, and have fun!",
    },
    {
      question: "What if I have dietary restrictions or allergies?",
      answer:
        "Please let us know about any dietary restrictions or allergies when you RSVP. We want to ensure everyone can enjoy the celebration comfortably.",
    },
    {
      question: "How can I help the couple have a great time during their wedding?",
      answer: `• Pray with us for favorable weather and the continuous blessings of our Lord as we enter this new chapter of our lives as husband and wife.\n\n• RSVP as soon as your schedule is cleared.\n\n• Dress appropriately and follow our ${dressTheme} dress code.\n\n• Be on time.\n\n• Follow the seating arrangement in the reception.\n\n• Stay until the end of the program.\n\n• Join the activities and enjoy!`,
    },
  ]
}

function FaqAnswer({ answer }: { answer: string | ReactNode }) {
  if (typeof answer !== "string") {
    return (
      <div
        className={`font-goudy-italic ${ct.body} whitespace-pre-line`}
        style={{ color: palette.body }}
      >
        {answer}
      </div>
    )
  }

  return (
    <p
      className={`font-goudy-italic ${ct.body} whitespace-pre-line`}
      style={{ color: palette.body }}
    >
      {answer}
    </p>
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
      style={{ background: "var(--color-welcome-bg)" }}
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
          <span className="h-px w-16 sm:w-24 md:w-32" style={dividerLineStyle} />
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="relative z-20 mx-auto my-6 mb-12 max-w-3xl px-4 sm:my-8 sm:px-6 md:my-10 md:mb-20 md:px-8">
        <div
          className="relative overflow-hidden rounded-xl border backdrop-blur-xl sm:rounded-2xl sm:backdrop-blur-2xl"
          style={cardStyle}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/35 via-white/8 to-transparent"
            aria-hidden
          />

          <div className="relative z-20 space-y-2 p-3 sm:space-y-2.5 sm:p-4 md:p-5">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index
              const contentId = `faq-item-${index}`
              return (
                <div
                  key={index}
                  className="relative z-20 rounded-xl border transition-all duration-300"
                  style={{
                    borderColor: isOpen
                      ? "color-mix(in srgb, var(--color-welcome-green) 35%, transparent)"
                      : "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
                    backgroundColor: "var(--color-welcome-bg-soft)",
                    boxShadow: isOpen
                      ? "0 4px 16px color-mix(in srgb, var(--color-motif-deep) 8%, transparent)"
                      : "none",
                  }}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="group flex w-full items-center justify-between px-3 py-2.5 text-left outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4 sm:py-3 md:px-5"
                    style={{ outlineColor: palette.accent }}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                  >
                    <span
                      className={`${cinzel.className} ${ct.question} pr-3 font-semibold leading-snug transition-colors duration-200`}
                      style={{ color: isOpen ? palette.accent : palette.heading }}
                    >
                      {item.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 sm:h-5 sm:w-5 ${isOpen ? "rotate-180" : ""}`}
                      style={{ color: isOpen ? palette.accent : palette.label }}
                      aria-hidden
                    />
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
                        className="border-t px-3 pb-3 pt-0 sm:px-4 sm:pb-4 md:px-5"
                        style={{
                          borderColor:
                            "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
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
      </div>
    </section>
  )
}
