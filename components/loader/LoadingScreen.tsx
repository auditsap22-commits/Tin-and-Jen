'use client';

import React, { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useSiteConfig } from '@/hooks/use-site-config';
import { parseWeddingDate } from '@/lib/wedding-date';
import { splitVenueLines } from '@/lib/utils';
import { InviteParticles } from '@/components/loader/InviteParticles';
import './loading-screen.css';

interface LoadingScreenProps {
  onComplete: () => void;
  onFadeStart?: () => void;
}

const TOTAL_DURATION_MS = 9000;
const MESSAGE_HOLD_MS = TOTAL_DURATION_MS / 4;
const FADE_OUT_MS = 950;

const LOADING_MESSAGES = [
  'Preparing your invitation',
  'Gathering your memories',
  'Sealing with care',
  'Your invitation awaits',
] as const;

const entryEase = [0.22, 1, 0.36, 1] as const;
const rollerEase = [0.16, 1, 0.3, 1] as const;
const ROLLER_TRANSITION_MS = 680;
const STATUS_LINE_HEIGHT_REM = 2.85;
const SAVE_THE_DATE_IMAGE = '/decoration/saveTheDate.png';
const SAVE_THE_DATE_ASPECT = 637 / 108;
const COUPLE_NAME_IMAGE = '/decoration/new-couple-name.png';
const COUPLE_NAME_ASPECT = 1018 / 622;

const CORNER_DECO_CLASS =
  'block h-auto w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[280px] opacity-75';

function brandMaskStyle(src: string): CSSProperties {
  return {
    ['--brand-mask-image' as string]: `url("${src}")`,
  };
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, onFadeStart }) => {
  const siteConfig = useSiteConfig();
  const reduceMotion = useReducedMotion();
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const coupleNames = `${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname}`;
  const venue = siteConfig.ceremony.location ?? siteConfig.wedding.venue;
  const venueLines = useMemo(() => splitVenueLines(venue), [venue]);

  const weddingDateGhost = useMemo(() => {
    const parsed = parseWeddingDate(siteConfig.ceremony.date ?? siteConfig.wedding.date);
    const wedding = new Date(`${parsed.month} ${parsed.day}, ${parsed.year}`);
    if (Number.isNaN(wedding.getTime())) {
      const monthDate = new Date(`${parsed.month} 1, ${parsed.year}`);
      const month = Number.isNaN(monthDate.getTime())
        ? '00'
        : String(monthDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.day).padStart(2, '0');
      const year = String(parsed.year).slice(-2);
      return { month, day, year };
    }
    return {
      month: String(wedding.getMonth() + 1).padStart(2, '0'),
      day: String(wedding.getDate()).padStart(2, '0'),
      year: String(wedding.getFullYear()).slice(-2),
    };
  }, [siteConfig.ceremony.date, siteConfig.wedding.date]);

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
      const pct = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
      setProgress(pct);
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

  return (
    <motion.div
      className="loading-screen fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden overscroll-none h-dvh max-h-dvh"
      aria-live="polite"
      aria-busy={!fadeOut}
      aria-label="Loading invitation"
      initial={false}
      animate={
        fadeOut
          ? {
              opacity: 0,
              scale: reduceMotion ? 1 : 1.035,
              filter: reduceMotion ? 'blur(0px)' : 'blur(8px)',
            }
          : {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }
      }
      transition={{
        duration: reduceMotion ? 0.2 : FADE_OUT_MS / 1000,
        ease: entryEase,
      }}
      style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
    >
      {!reduceMotion && (
        <div className="loading-screen__particles absolute inset-0 pointer-events-none">
          <InviteParticles count={28} />
        </div>
      )}

      <div className="loading-screen__glow absolute inset-0 pointer-events-none" />

      <div className="loading-screen__corner loading-screen__corner--tl pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/deco/left-top-corner.png" alt="" className={CORNER_DECO_CLASS} />
      </div>
      <div className="loading-screen__corner loading-screen__corner--tr pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/deco/right-top-corner.png" alt="" className={CORNER_DECO_CLASS} />
      </div>
      <div className="loading-screen__corner loading-screen__corner--bl pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/deco/left-bottom-corner.png" alt="" className={CORNER_DECO_CLASS} />
      </div>
      <div className="loading-screen__corner loading-screen__corner--br pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/deco/right-bottom-corner.png" alt="" className={CORNER_DECO_CLASS} />
      </div>

      <div className="loading-screen__ghost-date pointer-events-none select-none" aria-hidden="true">
        <span className="loading-screen__ghost-date-part">{weddingDateGhost.month}</span>
        <span className="loading-screen__ghost-date-sep" aria-hidden="true" />
        <span className="loading-screen__ghost-date-part">{weddingDateGhost.day}</span>
        <span className="loading-screen__ghost-date-sep" aria-hidden="true" />
        <span className="loading-screen__ghost-date-part">{weddingDateGhost.year}</span>
      </div>

      <motion.div
        className="loading-screen__monogram-slot loading-screen__monogram-slot--top loading-screen__brand-mask"
        style={brandMaskStyle(siteConfig.couple.monogram)}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: entryEase, delay: reduceMotion ? 0 : 0.2 }}
        role="img"
        aria-label="Couple monogram"
      />

      <motion.div
        className="loading-screen__content relative px-6 text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: entryEase, delay: reduceMotion ? 0 : 0.12 }}
      >
        <motion.div
          className="loading-screen__save-date-slot loading-screen__brand-mask"
          style={{ aspectRatio: SAVE_THE_DATE_ASPECT, ...brandMaskStyle(SAVE_THE_DATE_IMAGE) }}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: entryEase, delay: reduceMotion ? 0 : 0.32 }}
          role="img"
          aria-label="Save the date"
        />

        <motion.div
          className="loading-screen__names-slot loading-screen__brand-mask"
          style={{ aspectRatio: COUPLE_NAME_ASPECT, ...brandMaskStyle(COUPLE_NAME_IMAGE) }}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: entryEase, delay: reduceMotion ? 0 : 0.44 }}
          role="img"
          aria-label={coupleNames}
        />

        <motion.div
          className="loading-screen__venue"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: entryEase, delay: reduceMotion ? 0 : 0.52 }}
        >
          <span className="loading-screen__venue-label">VENUE</span>
          <span className="loading-screen__venue-sep" aria-hidden="true" />
          <span className="loading-screen__venue-value">
            {venueLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        </motion.div>

        <div
          className="loading-screen__status-slot"
          aria-live="polite"
          aria-atomic="true"
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
        </div>

        <div className="loading-screen__track-slot">
          <div className="loading-screen__track">
            <div
              className="loading-screen__bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="loading-screen__progress-label" aria-hidden="true">
            {Math.round(progress)}%
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
