"use client"

import React from "react"
import localFont from "next/font/local"
import { StorySection } from "@/components/StorySection"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"

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
  "block h-auto w-auto max-w-[120px] sm:max-w-[160px] md:max-w-[220px] lg:max-w-[260px]"

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
       Our Love Story
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: "var(--color-welcome-green)",
        }}
      >
        Our Journey to Forever
      </span>
      <span className="sr-only">Our Journey to Forever</span>
    </h1>
  )
}

export function LoveStory() {
  return (
    <div className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative min-h-screen overflow-x-hidden`}>
      <div
        className="relative px-4 pb-2 pt-8 text-center sm:pt-10 md:pt-12"
        style={{ background: "var(--color-welcome-bg)" }}
      >
        <div className="pointer-events-none  absolute right-0 top-0 z-10">
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
          </div>
        </div>
{/* 
        <p
          className="font-goudy-italic mx-auto mt-4 max-w-xl text-[0.75rem] leading-snug sm:mt-5 sm:text-[0.8125rem] md:mt-6 md:text-[0.84375rem]"
          style={{ color: "var(--color-welcome-text)" }}
        >
          &ldquo;11 Years of Love, Now Forever&rdquo;
        </p> */}
      </div>

      <StorySection
  theme="light"
  layout="image-left"
  isFirst={true}
  // title="Two Strangers, One Unexpected Journey"
  imageSrc="/mobile-background/couples (1).webp"
  text={
    <>
      <p className="mb-4">
      In 2018, what started as two strangers meeting turned into a beautiful journey neither of them expected.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couples (2).webp"
  // title="Endless Teasing, Growing Friendship"
  text={
    <>
      <p className="mb-4">
      From playful conversations and Gilbert's endless teasing of Kameel, a friendship slowly grew into something deeper.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  imageSrc="/mobile-background/couples (3).webp"
  // title="A Love That Grew Stronger"
  text={
    <>
      <p>
      Behind the jokes and little arguments was a love that continued to grow stronger every day.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couples (4).webp"
  // title="The Season of Distance"
  text={
    <>
      <p>
      Then in 2024, came the season of distance. As they began their long-distance relationship, they learned that love is not measured by the miles between them, but by the choice to keep choosing each other.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  imageSrc="/mobile-background/couples (5).webp"
  // title="Calls, Prayers, and Patience"
  text={
    <>
      <p>
      Through countless calls, prayers, patience, and waiting, they proved that love can overcome any distance.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couples (6).webp"
  // title="The Question, in Taiwan"
  text={
    <>
      <p className="mb-4">
      In 2025, in Taiwan, Gilbert asked Kameel the most important question of their lives.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  imageSrc="/mobile-background/couples (7).webp"
  // title="A Heart Full of Love, and a Yes"
  text={
    <>
      <p className="mb-4">
      And with a heart full of love, Kameel said yes.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couples (8).webp"
  // title="Surrounded by Those Who Matter Most"
  text={
    <>
      <p className="mb-4">
      Now in 2026, surrounded by the people who mean the most to them, they begin their forever.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  imageSrc="/mobile-background/couples (9).webp"
  // title="From Strangers to Best Friends"
  text={
    <>
      <p className="mb-4">
      From strangers, to best friends, to forever partners.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couples (10).webp"
  // title="Their Greatest Adventure Begins"
  text={
    <>
      <p className="mb-4">
      Their greatest adventure begins — a lifetime of love, chosen again and again, no matter the distance.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  isLast={true}
  imageSrc="/mobile-background/couples (11).webp"
  // title="Habangbuhay"
  text={
    <>
      <p className="mb-4">
      From two strangers meeting in 2018, through years of teasing, laughter, distance, and prayer, to a yes in Taiwan — Gilbert and Kameel are ready to say "I do."
      </p>
      <p>
      Join us as we begin forever.
      </p>
    </>
  }
/>
<div
        className="relative px-4 pb-16 pt-8 text-center sm:pb-20 sm:pt-10 md:pb-24 md:pt-12"
        style={{ background: "var(--color-welcome-bg)" }}
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
              className={`font-goudy-italic ${sectionType.textRelaxed} italic leading-relaxed`}
              style={{ color: "var(--color-welcome-text)" }}
            >
              &ldquo;I have found the one whom my soul loves.&rdquo;
            </p>
            <footer
              className={`font-goudy-italic mt-2 sm:mt-3 ${sectionType.label} not-italic tracking-wide`}
              style={{ color: "var(--color-welcome-green)" }}
            >
              — Song of Solomon 3: 4
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
