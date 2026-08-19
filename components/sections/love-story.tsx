"use client"

import React from "react"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import { ArrowRight } from "lucide-react"
import { StorySection, lightSectionBg } from "@/components/StorySection"
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

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-motif-deep) 38%, transparent))",
        }}
      />
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

function LoveStoryTitle() {
  return (
    <h1
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
       Every love story is beautiful
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: "var(--color-welcome-navy)",
        }}
      >
          but ours is my favorite.
      </span>
      <span className="sr-only">but ours is my favorite</span>
    </h1>
  )
}

export function LoveStory() {
  return (
    <div className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative min-h-screen overflow-x-hidden`}>
      <div
        className="relative px-4 pb-2 pt-8 text-center sm:pt-10 md:pt-12"
        style={{ background: lightSectionBg, backgroundAttachment: "fixed" }}
      >
        <div className="pointer-events-none absolute right-0 top-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/right-top-corner.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute left-0 top-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/left-top-corner.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="relative z-20 mx-auto max-w-5xl @container/love-story">
          <div className="mx-auto mb-5 sm:mb-6 md:mb-7">
            <OrnamentalDivider />
          </div>
          <div className="mx-auto">
            <LoveStoryTitle />
            <p
              className={`font-goudy-italic mx-auto mt-4 max-w-xl px-2 sm:mt-5 md:mt-6 ${sectionType.textRelaxed}`}
              style={{ color: "var(--color-welcome-text)" }}
            >
           
            </p>
          </div>
        </div>
      </div>

      <StorySection
        theme="light"
        layout="image-left"
        isFirst={true}
        title="Love in  Gods Perfect  Time"
        imageSrc="/mobile-background/couple (1).jpeg"
        text={
          <>
            <p
              className={`${cinzel.className} mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.28em] sm:mb-4 sm:text-[0.7rem]`}
            >
           
            </p>
            <p className="mb-4">Every love story begins differently.</p>
            <p className="mb-4">Some start with a grand moment. Some with a single conversation.</p>
            <p className="mb-4">Ours started quietly.</p>
            <p>
              It was 2021. At that time, I was still healing from a heartbreak. Hindi ako naghahanap ng
              bagong relasyon. Sa totoo lang, mas gusto kong ayusin muna ang sarili ko at magpatuloy sa
              buhay.
            </p>
          </>
        }
      />

      <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/mobile-background/couple (1).jpg"
        text={
          <>
            <p className="mb-4">
              One day, I went to Binondo, where our Youth Pastor partner was staying.
            </p>
            <p className="mb-4">That was the first time I saw Christine.</p>
            <p className="mb-4">We didn&apos;t talk. We weren&apos;t introduced. She was simply there.</p>
            <p>
              I never imagined that years later, God would write a different ending to that ordinary
              day.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-left"
        imageSrc="/mobile-background/couple (2).jpeg"
        text={
          <>
            <p className="mb-4">Life went on.</p>
            <p className="mb-4">For almost three years, I remained single. I wasn&apos;t looking for someone else.</p>
            <p>
              I believed that if God had someone prepared for me, He would bring her into my life at
              the right time.
            </p>
          </>
        }
      />

      <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/mobile-background/couple (2).jpg"
        text={
          <>
            <p className="mb-4">Then came the day everything began to change.</p>
            <p className="mb-4">Christine got baptized at our church.</p>
            <p className="mb-4">
              Later that day, one of our churchmates casually asked if I could accompany her to the SM
              terminal.
            </p>
            <p>
              It seemed like a small favor. But looking back now, I believe God was quietly opening a
              door.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-left"
        imageSrc="/mobile-background/couple (3).jpeg"
        text={
          <>
            <p className="mb-4">That short trip became our very first real conversation.</p>
            <p className="mb-4">Nothing extraordinary. Just two people talking on the way to the terminal.</p>
            <p>After she got home, I sent her a simple message.</p>
          </>
        }
      />

      <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/mobile-background/couple (3).jpg"
        text={
          <>
            <p className="mb-4 italic">&ldquo;Ingat sa pag-uwi. 😊&rdquo;</p>
            <p className="mb-4">It wasn&apos;t a pickup line. It wasn&apos;t meant to impress her.</p>
            <p>It was simply genuine concern.</p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/mobile-background/couple (4).jpg"
        text={
          <>
            <p className="mb-4">Looking back now, I smile whenever I remember that message.</p>
            <p className="mb-4">Because I didn&apos;t know it then...</p>
            <p>
              That simple &ldquo;Ingat&rdquo; would become the beginning of the greatest love story God
              would ever write for us.
            </p>
          </>
        }
      />

      <div
        className="relative px-4 pb-16 pt-8 text-center sm:pb-20 sm:pt-10 md:pb-24 md:pt-12"
        style={{ background: lightSectionBg, backgroundAttachment: "fixed" }}
      >
        <div className="pointer-events-none absolute bottom-0 left-0 z-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/left-bottom-corner.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 z-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/right-bottom-corner.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="relative z-20">
          <div className="mx-auto mb-5 sm:mb-6">
            <OrnamentalDivider />
          </div>
          <blockquote className="mx-auto max-w-xl px-2">
            <p
              className={`${cinzel.className} mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.28em] sm:text-[0.7rem]`}
              style={{ color: "var(--color-welcome-green)" }}
            >
              Reflection
            </p>
            <p
              className="font-goudy-italic text-[11px] italic leading-[1.62] sm:text-[14px] sm:leading-[1.65] md:text-[16px] lg:text-[18px]"
              style={{ color: "var(--color-welcome-text)" }}
            >
              Sometimes God doesn&apos;t begin a love story with fireworks. Sometimes He begins it with a
              simple ride, a short conversation, and one sincere message. Because when the time is
              right... He makes everything happen.
            </p>
            <footer
              className={`font-goudy-italic mt-2 sm:mt-3 ${sectionType.label} not-italic tracking-wide`}
              style={{ color: "var(--color-welcome-green)" }}
            >
              — Isaiah 60:22
            </footer>
          </blockquote>

          <div className="mt-8 flex justify-center sm:mt-10 md:mt-12">
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
              <span>Join us</span>
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
    </div>
  )
}
