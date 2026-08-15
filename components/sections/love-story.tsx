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
            src="/decoration/right-top-corner.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute left-0 top-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/left-top-corner.png"
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
  // title="Two Hearts, One Beginning"
  imageSrc="/mobile-background/couple (4).webp"
  text={
    <>
      <p className="mb-4">
      Every love story has a beginning, and theirs started the day Paul and Ana's paths first crossed.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couple (2).webp"
  // title="From Conversations to Connection"
  text={
    <>
      <p className="mb-4">
      What began as simple conversations slowly turned into something neither of them expected — a friendship built on laughter and understanding.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  imageSrc="/mobile-background/couple (21).webp"
  // title="A Bond That Kept Growing"
  text={
    <>
      <p>
      With every shared moment, big or small, their bond only grew deeper, until they knew this was something worth holding on to.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couple (22).webp"
  // title="Through Every Season"
  text={
    <>
      <p>
      Like every couple, Paul and Ana faced their own seasons of challenge and change — and through it all, they chose each other, again and again.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  imageSrc="/mobile-background/couple (23).webp"
  // title="Faith, Patience, and Love"
  text={
    <>
      <p>
      With faith, patience, and unwavering love, they proved that the right love is always worth the wait.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couple (9).webp"
  // title="The Question"
  text={
    <>
      <p className="mb-4">
      Then came the moment Paul had been waiting for — the moment to ask Ana the most important question of his life.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  imageSrc="/mobile-background/couple (15).webp"
  // title="A Heart Full of Love, and a Yes"
  text={
    <>
      <p className="mb-4">
      And with a heart full of love, Ana said yes.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couple (10).webp"
  // title="Surrounded by Those Who Matter Most"
  text={
    <>
      <p className="mb-4">
      Now, surrounded by the people who mean the most to them, Paul and Ana are ready to begin their forever.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  imageSrc="/mobile-background/couple (11).webp"
  // title="From Strangers to Best Friends"
  text={
    <>
      <p className="mb-4">
      From strangers, to best friends, to partners for life.
      </p>
    </>
  }
/>

<StorySection
  theme="dark"
  layout="image-right"
  imageSrc="/mobile-background/couple (12).webp"
  // title="Their Greatest Adventure Begins"
  text={
    <>
      <p className="mb-4">
      Their greatest adventure is just beginning — a lifetime of love, chosen again and again, every single day.
      </p>
    </>
  }
/>

<StorySection
  theme="light"
  layout="image-left"
  isLast={true}
  imageSrc="/mobile-background/couple (17).webp"
  // title="Habangbuhay"
  text={
    <>
      <p className="mb-4">
      From a chance beginning, through years of growth, patience, and love, to a heartfelt yes — Paul and Ana are ready to say "I do."
      </p>
      <p>
      Join us on November 6, 2026, as we begin forever.
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
            src="/decoration/left-bottom-corner.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 z-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/right-bottom-corner.png"
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
