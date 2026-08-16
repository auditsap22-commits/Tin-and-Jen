"use client"

import React, { useRef, useState } from "react"
import { motion } from "motion/react"
import { Play } from "lucide-react"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import Image from "next/image"
import { useAudio } from "@/contexts/audio-context"
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

const NAVY = "#04103B"
const GOLD = "#AB832E"

const DECO = {
  top: "/decoration/deco/top-center-decoration.png",
  bl: "/decoration/deco/left-bottom-small.png",
  br: "/decoration/deco/right-bottom-small.png",
} as const

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background: `linear-gradient(to right, transparent, ${GOLD})`,
        }}
      />
      <span
        className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
        style={{ backgroundColor: GOLD }}
        aria-hidden
      />
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background: `linear-gradient(to left, transparent, ${GOLD})`,
        }}
      />
    </div>
  )
}

function ProposalTitle() {
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
          color: GOLD,
        }}
      >
        The Proposal
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto mt-2 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2.5 sm:leading-[0.9] md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: GOLD,
        }}
      >
        The moment she said yes
      </span>
      <span className="sr-only">The moment she said yes</span>
    </h2>
  )
}

export function ProposalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const { pauseMusic, resumeMusic } = useAudio()

  const handlePlayClick = () => {
    setHasStarted(true)
    pauseMusic()
    const video = videoRef.current
    if (!video) return
    const play = video.play()
    if (play) {
      play.catch(() => {
        resumeMusic()
      })
    }
  }

  return (
    <section
      id="proposal"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} hero-invite relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 md:pb-28 md:pt-24`}
      style={{ background: NAVY }}
    >
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
          sizes="(max-width: 768px) 90vw, 480px"
        />
      </div>
      <div className="hero-invite-deco hero-invite-deco--bl" aria-hidden="true">
        <Image src={DECO.bl} alt="" width={851} height={1472} sizes="200px" />
      </div>
      <div className="hero-invite-deco hero-invite-deco--br" aria-hidden="true">
        <Image src={DECO.br} alt="" width={851} height={1472} sizes="200px" />
      </div>

      <div className="relative z-20 mx-auto max-w-5xl @container/proposal">
        <div className="text-center">
          <div className="mx-auto mb-5 sm:mb-6 md:mb-7">
            <OrnamentalDivider />
          </div>
          <p
            className={`${cinzel.className} mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.28em] sm:mb-4 sm:text-[0.7rem]`}
            style={{ color: GOLD }}
          >
            Our Love Story
          </p>
          <ProposalTitle />
          <p
            className={`font-goudy-italic mx-auto mt-4 max-w-xl sm:mt-5 md:mt-6 ${sectionType.textSnug}`}
            style={{ color: GOLD }}
          >
            Watch the moment God turned our quiet beginning into a forever promise.
          </p>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div
              className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl"
              style={{
                background: NAVY,
                border: `1px solid ${GOLD}`,
              }}
            >
              <div className="relative h-[min(72dvh,36rem)] w-full sm:h-[min(64dvh,38rem)] md:h-auto md:aspect-video">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  src="/background_music/proposal.mp4"
                  playsInline
                  preload="none"
                  controls={hasStarted}
                  onPlay={pauseMusic}
                  onPause={resumeMusic}
                  onEnded={resumeMusic}
                  aria-label="The proposal video"
                />

                {!hasStarted && (
                  <button
                    type="button"
                    onClick={handlePlayClick}
                    className="group absolute inset-0 z-20 flex cursor-pointer items-center justify-center overflow-hidden"
                    aria-label="Play proposal video"
                  >
                    <Image
                      src="/Details/couple.jpeg"
                      alt="Proposal video thumbnail"
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 64rem"
                      priority
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, color-mix(in srgb, ${NAVY} 35%, transparent), transparent 55%)`,
                      }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20 md:h-24 md:w-24"
                      style={{
                        backgroundColor: GOLD,
                        border: `1px solid ${GOLD}`,
                      }}
                    >
                      <Play
                        className="ml-1 h-8 w-8 fill-current sm:h-10 sm:w-10 md:h-12 md:w-12"
                        style={{ color: NAVY }}
                      />
                    </motion.div>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-center sm:mt-8 md:mt-10"
          >
            <div className="mx-auto mb-4 sm:mb-5">
              <OrnamentalDivider />
            </div>
            <p
              className={`font-goudy-italic mx-auto max-w-lg px-4 ${sectionType.textSnug}`}
              style={{ color: GOLD }}
            >
              From a simple &ldquo;Ingat&rdquo; to the question that changed everything.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
