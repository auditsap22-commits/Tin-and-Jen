'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from 'motion/react';
import { useSiteConfig } from '@/hooks/use-site-config';
import { parseWeddingDate } from '@/lib/wedding-date';
import { anastasiaScript } from '@/lib/fonts';
import { InviteParticles } from '@/components/loader/InviteParticles';
import './envelope-invite.css';

interface HeroProps {
  onOpen: () => void;
  onTransitionStart?: () => void;
  visible: boolean;
  enterFromLoading?: boolean;
}

const POLAROID_PHOTOS = [
  { src: '/envelope/box (1).JPG', side: 'left' as const },
  { src: '/envelope/box (5).JPG', side: 'center' as const },
  { src: '/envelope/box (4).JPG', side: 'right' as const },
];

const CORNER_DECO_CLASS =
  'block h-auto w-auto max-w-[200px] sm:max-w-[245px] md:max-w-[280px] opacity-75';

const photoInteractEase: Transition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] };
const focusLiftEase: Transition = { duration: 1.15, ease: [0.22, 1, 0.36, 1] };
const revealEntryEase: Transition = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
const buttonEntryEase: Transition = { duration: 0.95, ease: [0.16, 1, 0.3, 1] };

type PhotoSide = 'left' | 'center' | 'right';

type EnvelopePhase =
  | 'idle'
  | 'seal-press'
  | 'seal-break'
  | 'flap-open'
  | 'rising'
  | 'photos'
  | 'revealed'
  | 'cta';

function getFocusLiftPhase(phase: EnvelopePhase): 'idle' | 'opening' | 'photos' | 'revealed' | 'cta' {
  if (phase === 'idle') return 'idle';
  if (
    phase === 'seal-press' ||
    phase === 'seal-break' ||
    phase === 'flap-open' ||
    phase === 'rising'
  ) {
    return 'opening';
  }
  if (phase === 'photos') return 'photos';
  if (phase === 'revealed') return 'revealed';
  return 'cta';
}

const photoEmergenceEase: Transition = { duration: 3.2, ease: [0.08, 1, 0.2, 1] };
const letterEmergenceEase: Transition = { duration: 2.85, ease: [0.08, 1, 0.2, 1] };
const flapEase: Transition = { duration: 1.1, ease: [0.65, 0, 0.35, 1] };
const envelopeEase: Transition = { duration: 0.85, ease: [0.22, 1, 0.36, 1] };
const inviteExitEase: Transition = { duration: 1.75, ease: [0.22, 1, 0.36, 1] };
const inviteEnterEase: Transition = { duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.06 };
const letterExitEase: Transition = { duration: 1.35, ease: [0.16, 1, 0.3, 1] };
const INVITE_EXIT_MS = 1850;

export const Hero: React.FC<HeroProps> = ({
  onOpen,
  onTransitionStart,
  visible,
  enterFromLoading = false,
}) => {
  const siteConfig = useSiteConfig();
  const reduceMotion = useReducedMotion();
  const sealId = useId().replace(/:/g, '');
  const sealWaxGrad = `env-seal-wax-${sealId}`;
  const sealFaceGrad = `env-seal-face-${sealId}`;
  const sealSoftFilter = `env-seal-soft-${sealId}`;
  const openedRef = useRef(false);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<EnvelopePhase>('idle');
  const [liveMessage, setLiveMessage] = useState('');
  const [liftedPhoto, setLiftedPhoto] = useState<PhotoSide | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const groomName = siteConfig.couple.groomNickname;
  const brideName = siteConfig.couple.brideNickname;
  const coupleNames = `${groomName} & ${brideName}`;

  const letterDateNumeric = useMemo(() => {
    const parsed = parseWeddingDate(siteConfig.ceremony.date ?? siteConfig.wedding.date);
    const wedding = new Date(`${parsed.month} ${parsed.day}, ${parsed.year}`);
    if (Number.isNaN(wedding.getTime())) {
      const monthDate = new Date(`${parsed.month} 1, ${parsed.year}`);
      const month = Number.isNaN(monthDate.getTime())
        ? '00'
        : String(monthDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.day).padStart(2, '0');
      const year = String(parsed.year).slice(-2);
      return `${month} | ${day} | ${year}`;
    }
    const month = String(wedding.getMonth() + 1).padStart(2, '0');
    const day = String(wedding.getDate()).padStart(2, '0');
    const year = String(wedding.getFullYear()).slice(-2);
    return `${month} | ${day} | ${year}`;
  }, [siteConfig.ceremony.date, siteConfig.wedding.date]);

  const weddingDateGhost = useMemo(() => {
    const [month, day, year] = letterDateNumeric.split(' | ');
    return { month, day, year };
  }, [letterDateNumeric]);

  const daysToGo = useMemo(() => {
    const parsed = parseWeddingDate(siteConfig.wedding.date);
    const wedding = new Date(`${parsed.month} ${parsed.day}, ${parsed.year}`);
    if (Number.isNaN(wedding.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    wedding.setHours(0, 0, 0, 0);

    const diff = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [siteConfig.wedding.date]);

  const daysToGoLabel =
    daysToGo === null
      ? null
      : daysToGo === 1
        ? '1 day to go'
        : `${daysToGo} days to go`;

  const flapIsOpen =
    phase === 'flap-open' ||
    phase === 'rising' ||
    phase === 'photos' ||
    phase === 'revealed' ||
    phase === 'cta';

  const contentsVisible =
    phase === 'rising' ||
    phase === 'photos' ||
    phase === 'revealed' ||
    phase === 'cta';

  const sealGone =
    phase === 'seal-break' ||
    phase === 'flap-open' ||
    phase === 'rising' ||
    phase === 'photos' ||
    phase === 'revealed' ||
    phase === 'cta';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      openedRef.current = false;
      setPhase('idle');
      setLiveMessage('');
      setLiftedPhoto(null);
      setIsExiting(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || isExiting) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [visible, isExiting]);

  useEffect(() => {
    if (phase === 'cta') {
      enterBtnRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  useEffect(() => {
    if (
      phase === 'idle' ||
      phase === 'seal-press' ||
      phase === 'seal-break' ||
      phase === 'flap-open' ||
      phase === 'rising'
    ) {
      setLiftedPhoto(null);
    }
  }, [phase]);

  const toggleLiftedPhoto = useCallback((side: PhotoSide) => {
    setLiftedPhoto((current) => (current === side ? null : side));
  }, []);

  const handleEnterInvitation = useCallback(async () => {
    if (isExiting || phase !== 'cta') return;

    setIsExiting(true);
    setLiveMessage('Opening your invitation.');
    onTransitionStart?.();

    if (reduceMotion) {
      onOpen();
      return;
    }

    await wait(INVITE_EXIT_MS);
    onOpen();
  }, [isExiting, onOpen, onTransitionStart, phase, reduceMotion]);

  const runOpenSequence = useCallback(async () => {
    if (reduceMotion) {
      setPhase('cta');
      setLiveMessage('Invitation opened.');
      return;
    }

    setLiveMessage('Pressing seal.');
    setPhase('seal-press');
    await wait(180);

    setLiveMessage('Breaking seal.');
    setPhase('seal-break');
    await wait(320);

    setLiveMessage('Opening envelope.');
    setPhase('flap-open');
    await wait(1100);

    setLiveMessage('Invitation rising.');
    setPhase('rising');
    await wait(3000);

    setLiveMessage('Photos revealing.');
    setPhase('photos');
    await wait(3600);

    setPhase('revealed');
    await wait(650);

    setPhase('cta');
    setLiveMessage('Invitation ready.');
  }, [reduceMotion]);

  const handleSealClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (openedRef.current || phase !== 'idle') return;
      openedRef.current = true;
      void runOpenSequence();
    },
    [phase, runOpenSequence]
  );

  /* Keep envelope tilt on Y only — parent rotateX breaks the flap hinge in 3D */
  const envelopeVariants: Variants = {
    idle: { rotateX: 0, rotateY: -2, scale: 1, y: 0 },
    press: { rotateX: 0, rotateY: -2, scale: 0.988, y: 1 },
    opening: { rotateX: 0, rotateY: 0, scale: 1.012, y: 3 },
    open: { rotateX: 0, rotateY: 0, scale: 1, y: 6 },
  };

  /* Match reference sample: single flap, rotateX(180deg) positive, origin top center */
  const flapVariants: Variants = {
    closed: { rotateX: 0 },
    open: { rotateX: 180 },
  };

  const sealVariants: Variants = {
    idle: { scale: 1, opacity: 1, rotate: 0, y: 0 },
    press: { scale: 0.94, opacity: 1, rotate: 0, y: 2 },
    break: { scale: 0.2, opacity: 0, rotate: 12, y: -4 },
  };

  /*
    Letter emerges like the polaroids — anchored at the pocket floor,
    slides upward through the lip. Positive y = inside; negative y = above pocket.
  */
  const letterVariants: Variants = {
    hidden: { y: '6%', scale: 0.86, opacity: 1, rotate: -0.5 },
    rising: { y: '-56%', scale: 1, opacity: 1, rotate: 0 },
    out: { y: '-56%', scale: 1, opacity: 1, rotate: 0 },
    exitPortal: {
      y: '-122%',
      scale: 2.75,
      opacity: 1,
      rotate: 0,
      zIndex: 48,
    },
  };

  /*
    Photos stay anchored at the card bottom (y ≥ 0) so nothing slips below the edge.
    They rise upward and fan out from behind the letter.
  */
  const photoLeftVariants: Variants = {
    hidden: { y: '7%', x: '2%', rotate: -2, scale: 0.86, opacity: 0, zIndex: 18 },
    emerge: { y: '-50%', x: '-8%', rotate: -6, scale: 1, opacity: 1, zIndex: 18 },
    hover: { y: '-56%', x: '-8%', rotate: -7, scale: 1.04, opacity: 1, zIndex: 24 },
    press: { y: '-53%', x: '-8%', rotate: -6.5, scale: 1.02, opacity: 1, zIndex: 22 },
    lifted: { y: '-64%', x: '-8%', rotate: -7, scale: 1.06, opacity: 1, zIndex: 28 },
    exit: { y: '-18%', x: '-108%', rotate: -24, scale: 0.68, opacity: 0, zIndex: 10 },
  };

  const photoCenterVariants: Variants = {
    hidden: { y: '6%', x: '0%', rotate: 0, scale: 0.84, opacity: 0, zIndex: 18 },
    emerge: { y: '-46%', x: '0%', rotate: 1, scale: 1, opacity: 1, zIndex: 19 },
    hover: { y: '-52%', x: '0%', rotate: 1.5, scale: 1.04, opacity: 1, zIndex: 25 },
    press: { y: '-49%', x: '0%', rotate: 1.2, scale: 1.02, opacity: 1, zIndex: 23 },
    lifted: { y: '-60%', x: '0%', rotate: 2, scale: 1.06, opacity: 1, zIndex: 29 },
    exit: { y: '-108%', x: '0%', rotate: 10, scale: 0.72, opacity: 0, zIndex: 10 },
  };

  const photoRightVariants: Variants = {
    hidden: { y: '7%', x: '-2%', rotate: 2, scale: 0.86, opacity: 0, zIndex: 18 },
    emerge: { y: '-50%', x: '8%', rotate: 6, scale: 1, opacity: 1, zIndex: 18 },
    hover: { y: '-56%', x: '8%', rotate: 7, scale: 1.04, opacity: 1, zIndex: 24 },
    press: { y: '-53%', x: '8%', rotate: 6.5, scale: 1.02, opacity: 1, zIndex: 22 },
    lifted: { y: '-64%', x: '8%', rotate: 7, scale: 1.06, opacity: 1, zIndex: 28 },
    exit: { y: '-18%', x: '108%', rotate: 24, scale: 0.68, opacity: 0, zIndex: 10 },
  };

  const revealCopyContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.16, delayChildren: 0.1 },
    },
    exit: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const revealCopyItemVariants: Variants = {
    hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: revealEntryEase,
    },
    exit: {
      opacity: 0,
      y: 28,
      filter: 'blur(6px)',
      transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
    },
  };

  const buttonRevealVariants: Variants = {
    hidden: { opacity: 0, y: 28, x: '-50%', scale: 0.92, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      x: '-50%',
      scale: 1,
      filter: 'blur(0px)',
      transition: buttonEntryEase,
    },
    exit: {
      opacity: 0,
      y: 36,
      x: '-50%',
      scale: 0.9,
      filter: 'blur(6px)',
      transition: { duration: 0.36, ease: [0.4, 0, 1, 1] },
    },
  };

  const focusLiftVariants: Variants = {
    idle: { y: 'clamp(3.75rem, 9dvh, 5.25rem)' },
    opening: { y: 'clamp(3.75rem, 9dvh, 5.25rem)' },
    photos: { y: 'clamp(3.75rem, 9dvh, 5.25rem)' },
    revealed: { y: 'clamp(3.75rem, 9dvh, 5.25rem)' },
    cta: { y: 'clamp(3.75rem, 9dvh, 5.25rem)' },
  };

  const daysToGoVariants: Variants = {
    hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { ...revealEntryEase, delay: 0.05 },
    },
    exit: { opacity: 0, y: -12, scale: 0.94, filter: 'blur(4px)' },
  };

  if (!mounted) return null;

  const letterState =
    phase === 'idle' ||
    phase === 'seal-press' ||
    phase === 'seal-break' ||
    phase === 'flap-open'
      ? 'hidden'
      : phase === 'rising'
        ? 'rising'
        : 'out';

  const photoState =
    phase === 'idle' ||
    phase === 'seal-press' ||
    phase === 'seal-break' ||
    phase === 'flap-open' ||
    phase === 'rising'
      ? 'hidden'
      : 'emerge';

  const photosInteractive = photoState === 'emerge';

  const envelopeState =
    phase === 'idle'
      ? 'idle'
      : phase === 'seal-press' || phase === 'seal-break' || phase === 'flap-open'
        ? 'press'
        : phase === 'rising'
          ? 'opening'
          : 'open';

  const sealState =
    phase === 'idle' ? 'idle' : phase === 'seal-press' ? 'press' : 'break';

  return (
    <motion.div
      className={`env-invite-screen ${visible ? '' : 'is-hidden'}`}
      data-phase={isExiting ? 'exiting' : phase}
      aria-hidden={!visible}
      initial={
        enterFromLoading && !reduceMotion
          ? { opacity: 0, scale: 1.04, y: 12, filter: 'blur(10px)' }
          : false
      }
      animate={
        isExiting
          ? {
              opacity: 0,
              scale: 1.08,
              y: '-4%',
              filter: 'blur(16px)',
            }
          : {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
            }
      }
      transition={
        isExiting ? inviteExitEase : enterFromLoading ? inviteEnterEase : { duration: 0.01 }
      }
      style={{
        pointerEvents: isExiting ? 'none' : undefined,
        transformOrigin: '50% 38%',
      }}
    >
      {!reduceMotion && (
        <div className="env-invite-particles pointer-events-none" aria-hidden="true">
          <InviteParticles count={28} />
        </div>
      )}

      <div className="env-invite-bg-glow pointer-events-none" aria-hidden="true" />

      <div className="env-invite-corner env-invite-corner--tl pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/deco/left-top-corner.png" alt="" className={CORNER_DECO_CLASS} />
      </div>
      <div className="env-invite-corner env-invite-corner--tr pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/deco/right-top-corner.png" alt="" className={CORNER_DECO_CLASS} />
      </div>
      <div className="env-invite-corner env-invite-corner--bl pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/deco/left-bottom-corner.png" alt="" className={CORNER_DECO_CLASS} />
      </div>
      <div className="env-invite-corner env-invite-corner--br pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/deco/right-bottom-corner.png" alt="" className={CORNER_DECO_CLASS} />
      </div>

      <div className="env-invite-ghost-date pointer-events-none select-none" aria-hidden="true">
        <span className="env-invite-ghost-date-part">{weddingDateGhost.month}</span>
        <span className="env-invite-ghost-date-sep" aria-hidden="true" />
        <span className="env-invite-ghost-date-part">{weddingDateGhost.day}</span>
        <span className="env-invite-ghost-date-sep" aria-hidden="true" />
        <span className="env-invite-ghost-date-part">{weddingDateGhost.year}</span>
      </div>

      {isExiting && !reduceMotion && (
        <>
          <motion.div
            className="env-invite-exit-ring"
            aria-hidden="true"
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{ scale: 3.2, opacity: [0, 0.55, 0] }}
            transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1], times: [0, 0.32, 1] }}
          />
          <motion.div
            className="env-invite-exit-bloom"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: [0, 0.92, 0.65, 0], scale: [0.35, 1.15, 1.45, 1.65] }}
            transition={{
              duration: 1.55,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.28, 0.62, 1],
              delay: 0.08,
            }}
          />
          <motion.div
            className="env-invite-exit-shimmer"
            aria-hidden="true"
            initial={{ x: '-130%', opacity: 0 }}
            animate={{ x: '130%', opacity: [0, 0.75, 0] }}
            transition={{ duration: 1.15, ease: 'easeInOut', delay: 0.18 }}
          />
          <motion.div
            className="env-invite-exit-curtain env-invite-exit-curtain--left"
            aria-hidden="true"
            initial={{ x: '-105%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.div
            className="env-invite-exit-curtain env-invite-exit-curtain--right"
            aria-hidden="true"
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: [0.65, 0, 0.35, 1] }}
          />
        </>
      )}

      <p className="env-invite-live" aria-live="polite">
        {liveMessage}
      </p>

      <div className="env-invite-stage">
        <div className="env-invite-cluster">
          <motion.div
            className="env-invite-focus"
            variants={focusLiftVariants}
            initial="idle"
            animate={getFocusLiftPhase(phase)}
            transition={reduceMotion ? { duration: 0.01 } : focusLiftEase}
          >
          <motion.div
            className="env-invite-scene"
            animate={
              isExiting
                ? { opacity: 0, scale: 0.9, filter: 'blur(10px)' }
                : { opacity: 1, scale: 1, filter: 'blur(0px)' }
            }
            transition={
              isExiting
                ? { duration: 1.05, delay: 0.62, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.01 }
            }
          >
          <div className="env-invite-ground-shadow" aria-hidden="true" />
          <div className="env-invite-ground-contact" aria-hidden="true" />

          <div className="env-invite-envelope">
            {/* Flap behind body when open — rendered first in paint order */}
            <div className="env-invite-flap-shadow" aria-hidden="true" />
            <motion.div
              className="env-invite-flap"
              variants={flapVariants}
              initial="closed"
              animate={flapIsOpen ? 'open' : 'closed'}
              transition={flapEase}
              style={{ transformOrigin: 'top center' }}
              aria-hidden="true"
            />

            <motion.div
              className="env-invite-envelope-body"
              variants={envelopeVariants}
              initial="idle"
              animate={envelopeState}
              transition={envelopeEase}
            >
              {/* Back panel */}
              <div className="env-invite-back" aria-hidden="true" />

              {/* Interior shadow — only visible once contents rise */}
              <div className="env-invite-interior" aria-hidden="true" />

              {/* Contents — clipped inside pocket */}
              <div className="env-invite-contents-clip" aria-hidden={!contentsVisible}>
              <div className="env-invite-contents">
                <div className="env-invite-emerge-stack">
                  <motion.div
                    className="env-invite-letter"
                    variants={letterVariants}
                    initial="hidden"
                    animate={isExiting ? 'exitPortal' : letterState}
                    transition={
                      isExiting
                        ? { ...letterExitEase, delay: 0.06 }
                        : letterState === 'rising'
                          ? {
                              ...letterEmergenceEase,
                              opacity: { duration: 0 },
                            }
                          : { duration: 0.01 }
                    }
                  >
                    <div className="env-invite-letter-frame" aria-hidden="true" />
                    <div className="env-invite-letter-inner">
                      <span className="env-invite-letter-label">Save the Date</span>
                      <span className="env-invite-letter-date">{letterDateNumeric}</span>
                      <span className="env-invite-letter-invited">You are Invited</span>
                      <div
                        className="env-invite-letter-names"
                        role="img"
                        aria-label={coupleNames}
                      />
                    </div>
                  </motion.div>

                  <div className="env-invite-photos-emerge">
                    <PolaroidPhoto
                      side="left"
                      src={POLAROID_PHOTOS[0].src}
                      alt={coupleNames}
                      variants={photoLeftVariants}
                      photoState={photoState}
                      liftedPhoto={liftedPhoto}
                      onToggle={toggleLiftedPhoto}
                      interactive={photosInteractive}
                      emergenceDelay={0.55}
                      reduceMotion={reduceMotion}
                      isExiting={isExiting}
                    />
                    <PolaroidPhoto
                      side="center"
                      src={POLAROID_PHOTOS[1].src}
                      alt={coupleNames}
                      variants={photoCenterVariants}
                      photoState={photoState}
                      liftedPhoto={liftedPhoto}
                      onToggle={toggleLiftedPhoto}
                      interactive={photosInteractive}
                      emergenceDelay={1.0}
                      reduceMotion={reduceMotion}
                      isExiting={isExiting}
                    />
                    <PolaroidPhoto
                      side="right"
                      src={POLAROID_PHOTOS[2].src}
                      alt={coupleNames}
                      variants={photoRightVariants}
                      photoState={photoState}
                      liftedPhoto={liftedPhoto}
                      onToggle={toggleLiftedPhoto}
                      interactive={photosInteractive}
                      emergenceDelay={1.45}
                      reduceMotion={reduceMotion}
                      isExiting={isExiting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Closed front skin — solid cover, hides when open */}
            <div className="env-invite-front-closed" aria-hidden="true">
              <div className="env-invite-fold env-invite-fold--tl" />
              <div className="env-invite-fold env-invite-fold--bl" />
              <div className="env-invite-fold env-invite-fold--br" />
              <div className="env-invite-fold env-invite-fold--b" />
              <svg
                className="env-invite-creases"
                viewBox="0 0 460 297"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="0" x2="230" y2="172" />
                <line x1="460" y1="0" x2="230" y2="172" />
                <line x1="0" y1="297" x2="230" y2="172" />
                <line x1="460" y1="297" x2="230" y2="172" />
              </svg>
            </div>

            {/* Front pocket — solid panel + side folds, ALWAYS above contents */}
            <div className="env-invite-pocket" aria-hidden="true">
              <div className="env-invite-pocket-front" />
              <div className="env-invite-pocket-left" />
              <div className="env-invite-pocket-right" />
            </div>

            <div className="env-invite-hinge" aria-hidden="true" />
            </motion.div>

            {/* Wax seal — centered on flap junction */}
            <div
              className="env-invite-seal-wrap"
              style={{
                display: sealGone && phase !== 'seal-break' ? 'none' : undefined,
              }}
            >
              <motion.button
                type="button"
                className="env-invite-seal-btn"
                variants={sealVariants}
                initial="idle"
                animate={sealState}
                transition={
                  sealState === 'break'
                    ? { duration: 0.28, ease: 'easeIn' }
                    : { duration: 0.16, ease: 'easeOut' }
                }
                onClick={handleSealClick}
                disabled={phase !== 'idle'}
                aria-label="Break the wax seal to open the invitation"
              >
                <svg
                  className="env-invite-seal-svg"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id={sealWaxGrad} cx="32%" cy="26%" r="78%">
                      <stop offset="0%" stopColor="#C4CDC0" />
                      <stop offset="28%" stopColor="#A8B3A4" />
                      <stop offset="58%" stopColor="#9BA996" />
                      <stop offset="82%" stopColor="#84917E" />
                      <stop offset="100%" stopColor="#667463" />
                    </radialGradient>
                    <radialGradient id={sealFaceGrad} cx="50%" cy="36%" r="68%">
                      <stop offset="0%" stopColor="#A6B1A2" />
                      <stop offset="42%" stopColor="#95A290" />
                      <stop offset="100%" stopColor="#7A8974" />
                    </radialGradient>
                    <radialGradient id={`${sealId}-rim`} cx="38%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#B8C2B4" />
                      <stop offset="45%" stopColor="#9BA996" />
                      <stop offset="100%" stopColor="#6F7D69" />
                    </radialGradient>
                    <filter id={sealSoftFilter} x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="2.2" stdDeviation="1.6" floodColor="#1a2218" floodOpacity="0.35" />
                    </filter>
                    <filter id={`${sealId}-inset`} x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="b" />
                      <feOffset dy="1.2" result="o" />
                      <feComposite in="o" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="s" />
                      <feColorMatrix
                        in="s"
                        type="matrix"
                        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.28 0"
                        result="shadow"
                      />
                      <feBlend in="SourceGraphic" in2="shadow" mode="normal" />
                    </filter>
                  </defs>

                  {/* Poured-wax outer blob — scalloped irregular rim */}
                  <path
                    className="env-invite-seal-blob"
                    d="M59.5 4.2
                       C66.8 3.1 73.2 5.4 78.8 8.6
                       C84.6 12 91.8 14.2 96.8 19.8
                       C102.2 25.8 107.4 31.2 109.8 39.2
                       C112.4 47.8 113.6 56.4 111.6 65.2
                       C109.8 73.4 106.2 81.6 100.2 87.8
                       C94.6 93.6 88.4 99.4 80.2 102.8
                       C72.4 106 63.8 108.6 55.2 107.4
                       C46.2 106.2 38.4 101.8 31.6 96.2
                       C24.4 90.2 17.8 83.6 14.2 74.8
                       C10.4 65.4 7.8 55.2 9.6 45
                       C11.2 36.2 15.8 28.4 22.4 22
                       C29.2 15.4 36.8 10.8 45.6 7.6
                       C50.8 5.6 55.2 4.8 59.5 4.2 Z"
                    fill={`url(#${sealWaxGrad})`}
                    filter={`url(#${sealSoftFilter})`}
                  />

                  {/* Raised wax lip (ring between outer edge and face) */}
                  <path
                    fill={`url(#${sealId}-rim)`}
                    fillRule="evenodd"
                    d="M60 14.5
                       C69.2 13.2 78 16.4 84.8 21.8
                       C92 27.6 98.6 33.2 101.4 42.2
                       C104.4 51.6 105.2 61.2 102.2 70.4
                       C99.6 78.6 94.4 86.2 86.8 91.2
                       C79.6 96 70.6 99.2 61.2 98.6
                       C51.6 98 42.8 93.8 36.2 87.4
                       C29.2 80.6 24.4 72.2 23.2 62.4
                       C22 52.4 25.2 42.6 31.2 35
                       C37.4 27.2 47.2 16.2 60 14.5 Z
                       M60 26.5
                       C70.2 25.4 79.4 31.2 84.2 39.6
                       C89.2 48.4 88.6 59.8 82.6 67.8
                       C76.8 75.6 66.8 80.2 57.2 78.8
                       C47.4 77.4 39.2 70.4 36.4 61
                       C33.6 51.4 37.8 40.8 45.8 35.2
                       C50.2 32.2 55.2 27.2 60 26.5 Z"
                  />
                  {/* Rim highlight + shadow for 3D lip */}
                  <ellipse
                    cx="52"
                    cy="28"
                    rx="22"
                    ry="10"
                    fill="rgba(255,255,255,0.18)"
                    style={{ mixBlendMode: 'soft-light' }}
                  />
                  <path
                    d="M28 70 C34 88 52 98 72 96 C88 94 100 82 104 68"
                    fill="none"
                    stroke="rgba(0,0,0,0.12)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Recessed stamped face */}
                  <circle
                    cx="60"
                    cy="59.5"
                    r="28.5"
                    fill={`url(#${sealFaceGrad})`}
                    filter={`url(#${sealId}-inset)`}
                  />
                  <circle
                    cx="60"
                    cy="59.5"
                    r="28.5"
                    fill="none"
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="60"
                    cy="59.5"
                    r="26"
                    fill="none"
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="0.85"
                  />
                  <circle
                    cx="60"
                    cy="59.5"
                    r="24.4"
                    fill="none"
                    stroke="rgba(255,255,255,0.28)"
                    strokeWidth="0.5"
                  />

                  {/* Left botanical sprig */}
                  <g
                    fill="rgba(255,255,255,0.95)"
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M39.5 74.5 C35.5 66 34.2 55.5 37.5 44" fill="none" />
                    <path d="M37.8 61 C33.2 59.2 30.2 55.5 29.2 51.5" fill="none" />
                    <path d="M36.8 54.5 C32.4 52 30.6 47.5 31.2 43.5" fill="none" />
                    <path d="M37.2 49 C34 46 33.2 42 34.4 38.5" fill="none" />
                    <path d="M38.2 67.5 C34.2 66.2 31.5 63.2 30.5 59.8" fill="none" />
                    <ellipse cx="29.4" cy="51.2" rx="1.7" ry="2.7" transform="rotate(-32 29.4 51.2)" />
                    <ellipse cx="31.4" cy="43.8" rx="1.55" ry="2.5" transform="rotate(-20 31.4 43.8)" />
                    <ellipse cx="34.6" cy="38.8" rx="1.4" ry="2.3" transform="rotate(-10 34.6 38.8)" />
                    <ellipse cx="30.8" cy="59.5" rx="1.5" ry="2.4" transform="rotate(-38 30.8 59.5)" />
                    <ellipse cx="33.2" cy="66.2" rx="1.25" ry="2" transform="rotate(-42 33.2 66.2)" />
                  </g>

                  {/* Right botanical sprig */}
                  <g
                    fill="rgba(255,255,255,0.95)"
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M80.5 74.5 C84.5 66 85.8 55.5 82.5 44" fill="none" />
                    <path d="M82.2 61 C86.8 59.2 89.8 55.5 90.8 51.5" fill="none" />
                    <path d="M83.2 54.5 C87.6 52 89.4 47.5 88.8 43.5" fill="none" />
                    <path d="M82.8 49 C86 46 86.8 42 85.6 38.5" fill="none" />
                    <path d="M81.8 67.5 C85.8 66.2 88.5 63.2 89.5 59.8" fill="none" />
                    <ellipse cx="90.6" cy="51.2" rx="1.7" ry="2.7" transform="rotate(32 90.6 51.2)" />
                    <ellipse cx="88.6" cy="43.8" rx="1.55" ry="2.5" transform="rotate(20 88.6 43.8)" />
                    <ellipse cx="85.4" cy="38.8" rx="1.4" ry="2.3" transform="rotate(10 85.4 38.8)" />
                    <ellipse cx="89.2" cy="59.5" rx="1.5" ry="2.4" transform="rotate(38 89.2 59.5)" />
                    <ellipse cx="86.8" cy="66.2" rx="1.25" ry="2" transform="rotate(42 86.8 66.2)" />
                  </g>

                  {/* GK monogram */}
                  <g className="env-invite-seal-mono">
                    <text
                      className="env-invite-seal-letter env-invite-seal-letter-g"
                      x="50"
                      y="64"
                      textAnchor="middle"
                    >
                      G
                    </text>
                    <text
                      className="env-invite-seal-letter env-invite-seal-letter-k"
                      x="71"
                      y="71"
                      textAnchor="middle"
                    >
                      K
                    </text>
                  </g>
                </svg>
              </motion.button>
            </div>

            {phase === 'seal-break' && !reduceMotion && (
              <>
                <motion.span
                  className="env-invite-seal-shard"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: -28, y: -30, opacity: 0, scale: 0.35 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  aria-hidden="true"
                />
                <motion.span
                  className="env-invite-seal-shard"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: 30, y: 18, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                  aria-hidden="true"
                />
                <motion.span
                  className="env-invite-seal-shard"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: 14, y: -24, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        </motion.div>

          <p className="env-invite-hint">
            Tap the Seal to Open
          </p>

          {daysToGoLabel && (
            <motion.p
              className="env-invite-days-to-go"
              variants={daysToGoVariants}
              initial="hidden"
              animate={
                isExiting
                  ? 'exit'
                  : phase === 'revealed' || phase === 'cta'
                    ? 'visible'
                    : 'hidden'
              }
              transition={
                isExiting
                  ? { duration: 0.42, ease: [0.4, 0, 1, 1] }
                  : reduceMotion
                    ? { duration: 0.01 }
                    : { ...revealEntryEase, delay: 0.05 }
              }
            >
              {daysToGoLabel}
            </motion.p>
          )}

          </motion.div>
        </div>
      </div>

      <motion.div
        className="env-invite-reveal-copy"
        variants={revealCopyContainerVariants}
        initial="hidden"
        animate={
          isExiting
            ? 'exit'
            : phase === 'revealed' || phase === 'cta'
              ? 'visible'
              : 'hidden'
        }
      >
        <motion.h2 variants={revealCopyItemVariants}>
          We can't wait to celebrate with you!
        </motion.h2>
        <motion.span
          className={`script ${anastasiaScript.className}`}
          variants={revealCopyItemVariants}
        >
          With love, {coupleNames}
        </motion.span>
      </motion.div>

      <motion.button
        ref={enterBtnRef}
        type="button"
        className="env-invite-enter-btn"
        variants={buttonRevealVariants}
        initial="hidden"
        animate={
          isExiting
            ? 'exit'
            : phase === 'cta'
              ? 'visible'
              : 'hidden'
        }
        whileHover={
          phase === 'cta' && !isExiting && !reduceMotion
            ? { y: -2, x: '-50%', scale: 1.02 }
            : undefined
        }
        whileTap={
          phase === 'cta' && !isExiting && !reduceMotion
            ? { y: 0, x: '-50%', scale: 0.98 }
            : undefined
        }
        onClick={handleEnterInvitation}
        disabled={phase !== 'cta' || isExiting}
      >
        View the Invitation
      </motion.button>
    </motion.div>
  );
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

interface PolaroidPhotoProps {
  side: PhotoSide;
  src: string;
  alt: string;
  variants: Variants;
  photoState: 'hidden' | 'emerge';
  liftedPhoto: PhotoSide | null;
  onToggle: (side: PhotoSide) => void;
  interactive: boolean;
  emergenceDelay: number;
  reduceMotion: boolean | null;
  isExiting?: boolean;
}

function PolaroidPhoto({
  side,
  src,
  alt,
  variants,
  photoState,
  liftedPhoto,
  onToggle,
  interactive,
  emergenceDelay,
  reduceMotion,
  isExiting = false,
}: PolaroidPhotoProps) {
  const canInteract = interactive && !reduceMotion && !isExiting;

  const animateState = isExiting
    ? 'exit'
    : photoState === 'hidden'
      ? 'hidden'
      : liftedPhoto === side
        ? 'lifted'
        : 'emerge';

  return (
    <motion.button
      type="button"
      className={`env-invite-polaroid env-invite-polaroid--${side}${liftedPhoto === side ? ' is-lifted' : ''}`}
      variants={variants}
      initial="hidden"
      animate={animateState}
      whileHover={canInteract && liftedPhoto !== side ? 'hover' : undefined}
      whileTap={canInteract ? 'press' : undefined}
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : isExiting
            ? { duration: 0.85, ease: [0.4, 0, 0.2, 1], delay: 0.12 }
            : photoState === 'hidden'
              ? { duration: 0.01 }
              : animateState === 'emerge' && liftedPhoto === null
                ? { ...photoEmergenceEase, delay: emergenceDelay }
                : photoInteractEase
      }
      onClick={(e) => {
        e.stopPropagation();
        if (interactive) onToggle(side);
      }}
      disabled={!interactive}
      aria-label={`View photo ${side}`}
      aria-pressed={liftedPhoto === side}
    >
      <div className="env-invite-polaroid-photo">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover env-invite-polaroid-img"
          sizes="112px"
          priority
        />
      </div>
    </motion.button>
  );
}
