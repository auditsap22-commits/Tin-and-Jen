"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import { Play } from "lucide-react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import Image from "next/image"
import React from "react"
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

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

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

function CoupleVideoTitle() {
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
        A Glimpse of Our Love
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto mt-2 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2.5 sm:leading-[0.9] md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: GOLD,
        }}
      >
        Our Journey Together
      </span>
      <span className="sr-only">Our Journey Together</span>
    </h2>
  )
}

export function CoupleVideo() {
  const [hasClicked, setHasClicked] = useState(false)
  const playerRef = useRef<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { pauseMusic, resumeMusic } = useAudio()
  const videoId = "lgMX699OkO0"

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }
  }, [])

  useEffect(() => {
    if (!hasClicked || !iframeRef.current) return

    const initPlayer = () => {
      if (window.YT && window.YT.Player && iframeRef.current) {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (_event: any) => {
              pauseMusic()
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                pauseMusic()
              } else if (event.data === 2 || event.data === 0) {
                resumeMusic()
              }
            },
          },
        })
      }
    }

    const timer = setTimeout(() => {
      if (window.YT && window.YT.Player) {
        initPlayer()
      } else {
        window.onYouTubeIframeAPIReady = initPlayer
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy()
        } catch {
          // Ignore errors during cleanup
        }
      }
    }
  }, [hasClicked, pauseMusic, resumeMusic, videoId])

  const handleThumbnailClick = () => {
    setHasClicked(true)
    pauseMusic()
  }

  return (
    <section
      id="couple-video"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} hero-invite relative overflow-hidden`}
      style={{
        background: NAVY,
        paddingTop: "calc(var(--hero-deco-top) * 0.3 + 2.75rem)",
        paddingBottom: "calc(var(--hero-deco-sprig) * 1.2 + 3rem)",
        paddingLeft: "max(1.15rem, calc(var(--hero-frame-inset) + 0.7rem))",
        paddingRight: "max(1.15rem, calc(var(--hero-frame-inset) + 0.7rem))",
      }}
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

      <div className="relative z-20 mx-auto w-full max-w-4xl @container/couple-video md:max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 sm:mb-5">
            <OrnamentalDivider />
          </div>
          <p
            className={`${cinzel.className} mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.28em] sm:mb-2.5 sm:text-[0.7rem]`}
            style={{ color: GOLD }}
          >
            Our Story
          </p>
          <CoupleVideoTitle />
          <p
            className={`font-goudy-italic mx-auto mt-3 max-w-lg sm:mt-4 ${sectionType.textSnug}`}
            style={{ color: GOLD }}
          >
            Watch the journey that brought our hearts together
          </p>
        </div>

        <div className="mx-auto mt-8 w-full max-w-3xl sm:mt-10 md:mt-12 md:max-w-4xl">
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
              <div className="relative aspect-video w-full">
                {!hasClicked && (
                  <button
                    type="button"
                    onClick={handleThumbnailClick}
                    className="group absolute inset-0 z-20 flex cursor-pointer items-center justify-center overflow-hidden"
                    aria-label="Play couple video"
                  >
                    <Image
                      src="/Details/video.jpg"
                      alt="Video thumbnail"
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

                {hasClicked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <iframe
                      ref={iframeRef}
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=1&playsinline=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
                      className="absolute inset-0 h-full w-full"
                      style={{ border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title="Wedding Video"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mx-auto mt-8 max-w-lg text-center sm:mt-10 md:mt-12"
        >
          <div className="mb-3 sm:mb-3.5">
            <OrnamentalDivider />
          </div>
          <p
            className={`font-goudy-italic mx-auto px-2 ${sectionType.textSnug}`}
            style={{ color: GOLD }}
          >
            A glimpse into the moments that made our hearts one
          </p>
        </motion.div>
      </div>
    </section>
  )
}
