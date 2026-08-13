'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Cinzel } from 'next/font/google';
import { useSiteConfig } from '@/hooks/use-site-config';
import { parseWeddingDate } from '@/lib/wedding-date';
import './loading-screen.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

interface LoadingScreenProps {
  onComplete: () => void;
  onFadeStart?: () => void;
}

const TOTAL_DURATION_MS = 9000;
const MESSAGE_HOLD_MS = TOTAL_DURATION_MS / 4;
const PHOTO_HOLD_MS = 2200;
const FADE_OUT_MS = 950;
const entryEase = [0.22, 1, 0.36, 1] as const;
const rollerEase = [0.16, 1, 0.3, 1] as const;
const ROLLER_TRANSITION_MS = 720;
const STATUS_LINE_HEIGHT_REM = 1.75;

const COUPLE_SWEEP_PHOTOS = [
  '/envelope/box (1).JPG',
  '/envelope/box (2).JPG',
  '/envelope/box (3).JPG',
  '/envelope/box (4).JPG',
  '/envelope/box (5).JPG',
] as const;

const LOADING_MESSAGES = [
  'Preparing your invitation',
  'Gathering your memories',
  'Sealing with care',
  'Your invitation awaits',
] as const;

const C = {
  forest: '#5d6f47',
  sage: '#949981',
  mustard: '#eec853',
  butter: '#f4dd97',
  cream: '#f7f3e9',
  ink: '#3a3128',
} as const;

const ARCH_LABELS = [
  { id: 'entourage', text: 'the ENTOURAGE', tone: 'light' as const, offset: '66%' },
  { id: 'sponsors', text: 'the SPONSORS', tone: 'light' as const, offset: '65%' },
  { id: 'details', text: 'the FINER Details', tone: 'dark' as const, offset: '63%' },
  { id: 'date', text: 'save the DATE', tone: 'dark' as const, offset: '62%' },
] as const;

const ARCH_BANDS = [
  { x: 0, y: 0, w: 360, h: 640, r: 180 },
  { x: 22, y: 22, w: 316, h: 618, r: 158 },
  { x: 44, y: 44, w: 272, h: 596, r: 136 },
  { x: 64, y: 64, w: 232, h: 576, r: 116 },
] as const;

/* Cream doorway — keep content overlay locked to these coords */
const INNER = { x: 72, y: 72, w: 216, h: 568, r: 108 } as const;
const BAND_FILLS = [C.forest, C.sage, C.mustard, C.butter] as const;

const DECO = {
  tl: '/decoration/deco/left-top-corner.png',
  tr: '/decoration/deco/right-top-corner.png',
  bl: '/decoration/deco/left-bottom-corner.png',
  br: '/decoration/deco/right-bottom-corner.png',
} as const;

function archPath(x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2);
  return [
    `M ${x} ${y + h}`,
    `L ${x} ${y + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x + w} ${y + radius}`,
    `L ${x + w} ${y + h}`,
    'Z',
  ].join(' ');
}

function labelArcPath(x: number, y: number, w: number, r: number, ring = 18) {
  const outerR = Math.min(r, w / 2);
  const midR = Math.max(outerR - ring / 2, 20);
  const cx = x + w / 2;
  const cy = y + outerR;
  return `M ${cx - midR} ${cy} A ${midR} ${midR} 0 0 1 ${cx + midR} ${cy}`;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, onFadeStart }) => {
  const siteConfig = useSiteConfig();
  const reduceMotion = useReducedMotion();
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  const groomName = siteConfig.couple.groomNickname;
  const brideName = siteConfig.couple.brideNickname;

  const weddingMeta = useMemo(() => {
    const parsed = parseWeddingDate(siteConfig.ceremony.date ?? siteConfig.wedding.date);
    const wedding = new Date(`${parsed.month} ${parsed.day}, ${parsed.year}`);
    if (Number.isNaN(wedding.getTime())) {
      const monthDate = new Date(`${parsed.month} 1, ${parsed.year}`);
      const month = Number.isNaN(monthDate.getTime())
        ? '00'
        : String(monthDate.getMonth() + 1).padStart(2, '0');
      return {
        numeric: `${month}.${String(parsed.day).padStart(2, '0')}.${String(parsed.year).slice(-2)}`,
        day: parsed.dayOfWeek || siteConfig.ceremony.day || '',
      };
    }
    return {
      numeric: [
        String(wedding.getMonth() + 1).padStart(2, '0'),
        String(wedding.getDate()).padStart(2, '0'),
        String(wedding.getFullYear()).slice(-2),
      ].join('.'),
      day:
        wedding.toLocaleDateString('en-US', { weekday: 'long' }) ||
        siteConfig.ceremony.day ||
        '',
    };
  }, [siteConfig.ceremony.date, siteConfig.ceremony.day, siteConfig.wedding.date]);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100));
    }, 40);

    const messageInterval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_HOLD_MS);

    const photoInterval = setInterval(() => {
      setPhotoIndex((current) => (current + 1) % COUPLE_SWEEP_PHOTOS.length);
    }, PHOTO_HOLD_MS);

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
      clearInterval(photoInterval);
    };
  }, [onComplete, onFadeStart]);

  const textDelay = reduceMotion ? 0 : 0.72;

  return (
    <motion.div
      className="loading-screen fixed inset-0 z-50 flex items-stretch justify-center overflow-hidden overscroll-none h-dvh max-h-dvh w-screen"
      aria-live="polite"
      aria-busy={!fadeOut}
      aria-label="Loading invitation"
      initial={false}
      animate={
        fadeOut
          ? {
              opacity: 0,
              scale: reduceMotion ? 1 : 1.015,
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
      <div className="loading-screen__stage">
        <svg
          className="loading-screen__arch-svg"
          viewBox="0 0 360 640"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {ARCH_BANDS.map((band, index) => (
              <path
                key={`arc-${ARCH_LABELS[index].id}`}
                id={`ls-label-arc-${index}`}
                d={labelArcPath(band.x, band.y, band.w, band.r, index === 0 ? 24 : 20)}
                fill="none"
              />
            ))}
          </defs>

          {ARCH_BANDS.map((band, index) => (
            <motion.path
              key={ARCH_LABELS[index].id}
              d={archPath(band.x, band.y, band.w, band.h, band.r)}
              fill={BAND_FILLS[index]}
              initial={reduceMotion ? false : { opacity: 0, scaleY: 0.9 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{
                duration: 0.9,
                ease: entryEase,
                delay: reduceMotion ? 0 : 0.04 + index * 0.12,
              }}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
            />
          ))}

          <motion.path
            d={archPath(INNER.x, INNER.y, INNER.w, INNER.h, INNER.r)}
            fill={C.cream}
            initial={reduceMotion ? false : { opacity: 0, scaleY: 0.92 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.85, ease: entryEase, delay: reduceMotion ? 0 : 0.52 }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          />

          {ARCH_LABELS.map((label, index) => (
            <motion.text
              key={label.id}
              className={`loading-screen__arch-label loading-screen__arch-label--${label.tone} ${cinzel.className}`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.55,
                ease: entryEase,
                delay: reduceMotion ? 0 : 0.48 + index * 0.1,
              }}
            >
              <textPath
                href={`#ls-label-arc-${index}`}
                startOffset={label.offset}
                textAnchor="middle"
              >
                {label.text}
              </textPath>
            </motion.text>
          ))}
        </svg>

        <div className="loading-screen__threshold" aria-hidden="true" />

        {/* Content locked inside cream aisle of the arch */}
        <div
          className="loading-screen__aisle"
          style={{
            ['--ls-inner-x' as string]: INNER.x,
            ['--ls-inner-y' as string]: INNER.y,
            ['--ls-inner-w' as string]: INNER.w,
            ['--ls-view-w' as string]: 360,
            ['--ls-view-h' as string]: 640,
          }}
        >
          <div className="loading-screen__panel">
            <motion.div
              className="loading-screen__photo-frame"
              initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: entryEase, delay: textDelay }}
              aria-hidden="true"
            >
              <div className="loading-screen__photo-well">
                <AnimatePresence mode="sync" initial={false}>
                  <motion.div
                    key={COUPLE_SWEEP_PHOTOS[photoIndex]}
                    className="loading-screen__photo-slide"
                    initial={
                      reduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, scale: 1.08, x: '6%' }
                    }
                    animate={{ opacity: 1, scale: 1.02, x: '0%' }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 1.06, x: '-6%' }
                    }
                    transition={{ duration: reduceMotion ? 0.2 : 1.05, ease: entryEase }}
                  >
                    <Image
                      src={COUPLE_SWEEP_PHOTOS[photoIndex]}
                      alt=""
                      fill
                      priority={photoIndex === 0}
                      sizes="(max-width: 768px) 42vw, 220px"
                      className="loading-screen__photo-img"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="loading-screen__photo-sheen" />
              </div>
            </motion.div>

            <div className="loading-screen__invite">
              <motion.p
                className={`loading-screen__eyebrow ${cinzel.className}`}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: entryEase, delay: textDelay + 0.1 }}
              >
                With joy, we invite you
              </motion.p>

              <motion.div
                className="loading-screen__rule"
                aria-hidden="true"
                initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.65, ease: entryEase, delay: textDelay + 0.16 }}
              />

              <motion.div
                className="loading-screen__names"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: entryEase, delay: textDelay + 0.22 }}
              >
                <div
                  className="loading-screen__names-img"
                  role="img"
                  aria-label={`${groomName} and ${brideName}`}
                />
              </motion.div>
            </div>

            <div className={`loading-screen__footer ${cinzel.className}`}>
              <motion.div
                className="loading-screen__date-block"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: entryEase, delay: textDelay + 0.4 }}
              >
                {weddingMeta.day ? (
                  <span className="loading-screen__weekday">{weddingMeta.day}</span>
                ) : null}
                <span className="loading-screen__date">{weddingMeta.numeric}</span>
              </motion.div>

              <motion.div
                className="loading-screen__rule loading-screen__rule--soft"
                aria-hidden="true"
                initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: entryEase, delay: textDelay + 0.48 }}
              />

              <motion.div
                className="loading-screen__status"
                aria-live="polite"
                aria-atomic="true"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: entryEase, delay: textDelay + 0.52 }}
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
                transition={{ duration: 0.55, ease: entryEase, delay: textDelay + 0.56 }}
              >
                <div
                  className="loading-screen__bar"
                  style={{ width: `${progress}%` }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="loading-screen__deco loading-screen__deco--tl"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, x: -28, y: -28 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, ease: entryEase, delay: reduceMotion ? 0 : 0.65 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DECO.tl} alt="" />
      </motion.div>
      <motion.div
        className="loading-screen__deco loading-screen__deco--tr"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, x: 28, y: -28 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, ease: entryEase, delay: reduceMotion ? 0 : 0.78 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DECO.tr} alt="" />
      </motion.div>
      <motion.div
        className="loading-screen__deco loading-screen__deco--bl"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, x: -28, y: 32 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.86 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DECO.bl} alt="" />
      </motion.div>
      <motion.div
        className="loading-screen__deco loading-screen__deco--br"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, x: 28, y: 32 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.15, ease: entryEase, delay: reduceMotion ? 0 : 0.98 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DECO.br} alt="" />
      </motion.div>
    </motion.div>
  );
};
