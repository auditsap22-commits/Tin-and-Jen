"use client"

import { useEffect, useRef, useState } from "react"
import { Check, MoreHorizontal, Pause, Play, SkipBack, SkipForward } from "lucide-react"
import { useAudio } from "@/contexts/audio-context"

export type PlaylistTrack = {
  title: string
  artist: string
  duration: string
  uri: string
  previewUrl?: string
}

function SpotifyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function trackUrl(uri: string) {
  const id = uri.split(":").pop()
  return id ? `https://open.spotify.com/track/${id}` : uri
}

export function MobilePlaylistPlayer({
  title,
  curator,
  coverUrl,
  spotifyUrl,
  tracks,
}: {
  title: string
  curator: string
  coverUrl: string
  spotifyUrl: string
  tracks: PlaylistTrack[]
}) {
  const { pauseMusic, resumeMusic } = useAudio()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const current = tracks[currentIndex] ?? tracks[0]

  useEffect(() => {
    const audio = new Audio()
    audio.preload = "none"
    audioRef.current = audio

    const handleEnded = () => {
      setIsPlaying(false)
      resumeMusic()
    }

    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener("ended", handleEnded)
      audioRef.current = null
    }
  }, [resumeMusic])

  const playTrack = (index: number) => {
    const track = tracks[index]
    const audio = audioRef.current
    if (!track || !audio) return

    setCurrentIndex(index)

    if (!track.previewUrl) {
      window.open(trackUrl(track.uri), "_blank", "noopener,noreferrer")
      return
    }

    if (currentIndex === index && !audio.paused && audio.src) {
      audio.pause()
      resumeMusic()
      setIsPlaying(false)
      return
    }

    audio.src = track.previewUrl
    pauseMusic()
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false)
        window.open(spotifyUrl, "_blank", "noopener,noreferrer")
      })
  }

  const skip = (direction: -1 | 1) => {
    if (!tracks.length) return
    const next = (currentIndex + direction + tracks.length) % tracks.length
    playTrack(next)
  }

  return (
    <div
      className="overflow-hidden rounded-[18px]"
      style={{ backgroundColor: "#2b3330" }}
    >
      <div className="px-3 pt-3">
        <div className="flex items-start gap-3">
          <img
            src={coverUrl}
            alt={`${title} playlist cover`}
            width={86}
            height={86}
            className="h-[86px] w-[86px] shrink-0 rounded-[10px] object-cover"
          />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[1.05rem] font-bold leading-tight tracking-tight text-white">
                  {title}
                </p>
                <p className="mt-0.5 truncate text-[0.8rem] text-white/70">
                  {curator}
                </p>
              </div>
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in Spotify"
                className="mt-0.5 shrink-0 text-white"
              >
                <SpotifyMark className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              Saved on Spotify
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-black/35 px-2 py-0.5 text-[0.65rem] font-medium text-white/90">
            Preview
          </span>
          <div className="flex items-center gap-1.5 text-white">
            <button
              type="button"
              aria-label="Previous song"
              onClick={() => skip(-1)}
              className="flex h-8 w-8 items-center justify-center"
            >
              <SkipBack className="h-4 w-4 fill-white" />
            </button>
            <button
              type="button"
              aria-label="Next song"
              onClick={() => skip(1)}
              className="flex h-8 w-8 items-center justify-center"
            >
              <SkipForward className="h-4 w-4 fill-white" />
            </button>
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="More on Spotify"
              className="flex h-8 w-8 items-center justify-center"
            >
              <MoreHorizontal className="h-5 w-5" />
            </a>
            <button
              type="button"
              aria-label={isPlaying ? "Pause preview" : "Play preview"}
              onClick={() => playTrack(currentIndex)}
              className="ml-0.5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2b3330] shadow-md"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              )}
            </button>
          </div>
        </div>
      </div>

      <ol
        className="mt-3 max-h-[168px] overflow-y-auto overscroll-contain px-1.5 pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.28)_transparent]"
        aria-label="Track list"
      >
        {tracks.map((track, index) => {
          const active = index === currentIndex
          return (
            <li key={track.uri}>
              <button
                type="button"
                onClick={() => playTrack(index)}
                className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left"
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.06)" : "transparent",
                }}
              >
                <span className="w-4 shrink-0 text-center text-[0.7rem] text-white/45">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className="block truncate text-[0.8rem] font-semibold leading-tight"
                    style={{ color: active ? "#fff" : "rgba(255,255,255,0.94)" }}
                  >
                    {track.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.68rem] text-white/50">
                    {track.artist}
                  </span>
                </span>
                <span className="shrink-0 text-[0.72rem] tabular-nums text-white/80">
                  {track.duration}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      {current ? (
        <p className="sr-only">
          {isPlaying ? "Playing preview of" : "Selected"} {current.title} by{" "}
          {current.artist}
        </p>
      ) : null}
    </div>
  )
}
