'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Cinzel, Montserrat } from 'next/font/google';
import { useSiteConfig } from '@/hooks/use-site-config';
import { parseWeddingDate } from '@/lib/wedding-date';
import './loading-screen.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

interface LoadingScreenProps {
  onComplete: () => void;
  onFadeStart?: () => void;
}

const TOTAL_DURATION_MS = 9000;
const MESSAGE_HOLD_MS = TOTAL_DURATION_MS / 4;
const FADE_OUT_MS = 950;
const entryEase = [0.22, 1, 0.36, 1] as const;
const rollerEase = [0.16, 1, 0.3, 1] as const;
const ROLLER_TRANSITION_MS = 720;
const STATUS_LINE_HEIGHT_REM = 1.65;

const LOADING_MESSAGES = [
  'Preparing your invitation',
  'Gathering your memories',
  'Sealing with care',
  'Your invitation awaits',
] as const;

const DECO = {
  top: '/decoration/deco/top-center-decoration.png',
  bl: '/decoration/deco/left-bottom-small.png',
  br: '/decoration/deco/right-bottom-small.png',
  names: '/decoration/deco/couple name.png',
  monogram: '/decoration/deco/monogram.png',
} as const;

const BG_VIDEO =
  '/background_music/No Copyright Video, Background, Blue Screen, Motion Graphics, Animated Background.mp4';

function formatClockTime(raw: string) {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (!match) return trimmed.toUpperCase();

  let hour = Number(match[1]);
  const minutes = match[2] ?? '00';
  let meridiem = (match[3] || '').toUpperCase();

  if (!meridiem) {
    meridiem = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
  } else if (meridiem === 'PM' && hour > 12) {
    hour = hour % 12;
  } else if (meridiem === 'AM' && hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour = hour % 12;
  }

  return `${hour}:${minutes} ${meridiem}`;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  onFadeStart,
}) => {
  const siteConfig = useSiteConfig();
  const reduceMotion = useReducedMotion();
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const groomName = siteConfig.couple.groomNickname || 'Paul';
  const brideName = siteConfig.couple.brideNickname || 'Ana';

  const weddingMeta = useMemo(() => {
    const parsed = parseWeddingDate(
      siteConfig.ceremony.date ?? siteConfig.wedding.date,
    );
    const weekday = (
      parsed.dayOfWeek ||
      siteConfig.ceremony.day ||
      ''
    ).toUpperCase();
    const time = formatClockTime(
      siteConfig.ceremony.time ?? siteConfig.wedding.time ?? '',
    );
    const venue =
      siteConfig.ceremony.location || siteConfig.wedding.venue || '';

    return {
      weekday,
      time,
      month: parsed.month.toUpperCase(),
      day: parsed.day,
      year: parsed.year,
      venue,
    };
  }, [
    siteConfig.ceremony.date,
    siteConfig.ceremony.day,
    siteConfig.ceremony.location,
    siteConfig.ceremony.time,
    siteConfig.wedding.date,
    siteConfig.wedding.time,
    siteConfig.wedding.venue,
  ]);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const playLoop = () => {
      if (reduceMotion) return;
      video.muted = true;
      const playback = video.play();
      if (playback) playback.catch(() => {});
    };

    const restart = () => {
      if (reduceMotion) return;
      video.currentTime = 0.001;
      playLoop();
    };

    const keepAlive = () => {
      if (reduceMotion || !video.duration) return;
      if (video.currentTime >= video.duration - 0.05) {
        restart();
      }
    };

    if (reduceMotion) {
      video.pause();
      return;
    }

    playLoop();
    video.addEventListener('ended', restart);
    video.addEventListener('timeupdate', keepAlive);
    video.addEventListener('stalled', playLoop);

    return () => {
      video.removeEventListener('ended', restart);
      video.removeEventListener('timeupdate', keepAlive);
      video.removeEventListener('stalled', playLoop);
    };
  }, [reduceMotion]);

  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100));
    }, 40);

    const messageInterval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_HOLD_MS);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      onFadeStart?.();
      setFadeOut(true);
      setTimeout(onComplete, FADE_OUT_MS);
    }, TOTAL_DURATION_MS);

    return () => {
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete, onFadeStart]);

  const textDelay = reduceMotion ? 0 : 0.55;

  return (
    <motion.div
      className={`loading-screen fixed inset-0 z-50 flex items-stretch justify-center overflow-hidden overscroll-none h-dvh max-h-dvh w-screen ${montserrat.className}`}
      aria-live="polite"
      aria-busy={!fadeOut}
      aria-label="Loading invitation"
      initial={false}
      animate={
        fadeOut
          ? {
              opacity: 0,
              scale: reduceMotion ? 1 : 1.012,
              filter: reduceMotion ? 'blur(0px)' : 'blur(6px)',
            }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{
        duration: reduceMotion ? 0.2 : FADE_OUT_MS / 1000,
        ease: entryEase,
      }}
      style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
    >
      <video
        ref={videoRef}
        className="loading-screen__video"
        src={encodeURI(BG_VIDEO)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
      />

      <div className="loading-screen__frame" aria-hidden="true">
        <motion.span
          className="loading-screen__frame-arm loading-screen__frame-arm--top-left"
          initial={reduceMotion ? false : { opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.12 }}
        />
        <motion.span
          className="loading-screen__frame-arm loading-screen__frame-arm--top-right"
          initial={reduceMotion ? false : { opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.12 }}
        />
        <motion.span
          className="loading-screen__frame-arm loading-screen__frame-arm--left"
          initial={reduceMotion ? false : { opacity: 0, x: -18, y: 22 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.28 }}
        />
        <motion.span
          className="loading-screen__frame-arm loading-screen__frame-arm--right"
          initial={reduceMotion ? false : { opacity: 0, x: 18, y: 22 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.36 }}
        />
        <motion.span
          className="loading-screen__frame-arm loading-screen__frame-arm--bottom"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.32 }}
        />
      </div>

      <motion.div
        className="loading-screen__deco loading-screen__deco--top pointer-events-none"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.12 }}
      >
        <Image
          src={DECO.top}
          alt=""
          width={2078}
          height={598}
          priority
          sizes="(max-width: 768px) 90vw, 480px"
        />
      </motion.div>

      <motion.div
        className="loading-screen__deco loading-screen__deco--bl pointer-events-none"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, x: -18, y: 22 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.28 }}
      >
        <Image src={DECO.bl} alt="" width={851} height={1472} sizes="200px" />
      </motion.div>
      <motion.div
        className="loading-screen__deco loading-screen__deco--br pointer-events-none"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, x: 18, y: 22 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.36 }}
      >
        <Image src={DECO.br} alt="" width={851} height={1472} sizes="200px" />
      </motion.div>

      <div className="loading-screen__stage">
        <div className="loading-screen__panel">
          <motion.div
            className="loading-screen__monogram"
            role="img"
            aria-label="Wedding monogram"
            style={{
              WebkitMaskImage: `url("${encodeURI(DECO.monogram)}")`,
              maskImage: `url("${encodeURI(DECO.monogram)}")`,
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: entryEase, delay: textDelay }}
          />

          <motion.p
            className={`loading-screen__eyebrow ${cinzel.className}`}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: entryEase, delay: textDelay + 0.08 }}
          >
            Together with their families
          </motion.p>

          <motion.div
            className="loading-screen__names"
            role="img"
            aria-label={`${groomName} and ${brideName}`}
            style={{
              WebkitMaskImage: `url("${encodeURI(DECO.names)}")`,
              maskImage: `url("${encodeURI(DECO.names)}")`,
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: entryEase, delay: textDelay + 0.14 }}
          />

          <motion.p
            className="loading-screen__invite-line"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: entryEase, delay: textDelay + 0.22 }}
          >
            Invite you to celebrate their wedding
          </motion.p>

          <motion.div
            className="loading-screen__details"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: entryEase, delay: textDelay + 0.32 }}
          >
            <p className={`loading-screen__date-month ${cinzel.className}`}>
              {weddingMeta.month}
            </p>

            <div className={`loading-screen__date-lockup ${cinzel.className}`}>
              <div className="loading-screen__date-side">
                {weddingMeta.weekday ? (
                  <>
                    <span className="loading-screen__date-line" />
                    <span className="loading-screen__date-label">{weddingMeta.weekday}</span>
                    <span className="loading-screen__date-line" />
                  </>
                ) : null}
              </div>

              <span className="loading-screen__date-day">{weddingMeta.day}</span>

              <div className="loading-screen__date-side">
                {weddingMeta.time ? (
                  <>
                    <span className="loading-screen__date-line" />
                    <span className="loading-screen__date-label">AT {weddingMeta.time}</span>
                    <span className="loading-screen__date-line" />
                  </>
                ) : null}
              </div>
            </div>

            <p className={`loading-screen__date-year ${cinzel.className}`}>
              {weddingMeta.year}
            </p>

            {weddingMeta.venue ? (
              <p className={`loading-screen__venue ${cinzel.className}`}>
                {weddingMeta.venue}
              </p>
            ) : null}
          </motion.div>

          

          <div className="loading-screen__footer">
            <motion.div
              className="loading-screen__status"
              aria-live="polite"
              aria-atomic="true"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: entryEase, delay: textDelay + 0.58 }}
            >
            <motion.div
              className="loading-screen__status-roller"
              animate={{ y: `-${messageIndex * STATUS_LINE_HEIGHT_REM}rem` }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { duration: ROLLER_TRANSITION_MS / 1000, ease: rollerEase }
              }
            >
              {LOADING_MESSAGES.map((message) => (
                <p key={message} className="loading-screen__status-line">
                  {message}
                </p>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="loading-screen__track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Loading progress"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: entryEase, delay: textDelay + 0.62 }}
          >
            <div
              className="loading-screen__bar"
              style={{ width: `${progress}%` }}
            />
          </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
