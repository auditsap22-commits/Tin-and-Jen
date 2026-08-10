# PROJECT BLUEPRINT — Gilbert & Kameel Wedding Invitation Platform

> **Version:** Reverse-engineered from repository `gilbert-and-jesie` (August 2026)  
> **Platform policy:** No paid database or paid CDN. Data lives in **Google Sheets + Apps Script**; messages via **Google Forms**; images in **`/public`** until an equally free storage option is adopted. This applies to **all projects** cloned from this blueprint.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Folder Structure](#3-folder-structure)
4. [Routing](#4-routing)
5. [Components](#5-components)
6. [Features](#6-features)
7. [Google Apps Script](#7-google-apps-script)
8. [APIs](#8-apis)
9. [Database](#9-database)
10. [UI Design System](#10-ui-design-system)
11. [Theme System](#11-theme-system)
12. [Dashboard Architecture](#12-dashboard-architecture)
13. [Media Manager](#13-media-manager)
14. [Customization Engine](#14-customization-engine)
15. [Performance Improvements](#15-performance-improvements)
16. [Better Architecture](#16-better-architecture)
17. [Suggested New Features](#17-suggested-new-features)
18. [Future SaaS Architecture](#18-future-saas-architecture)
19. [Step-by-Step Recreation Prompt](#19-step-by-step-recreation-prompt)

---

# 1. Project Overview

## Purpose

A **premium digital wedding invitation website** for **Gilbert Kiling Pinongcos II** and **Jesie Kameel E. Erojo**, wedding date **October 11, 2026**, venue **Greenleaf Hotel Gensan — Pandan Hall A**, General Santos City, Philippines.

The site delivers a cinematic guest experience (loading screen → interactive envelope → full invitation) while giving the couple an admin dashboard to manage guests, messages, entourage, sponsors, and wedding details — all backed by **Google Sheets** via **Google Apps Script** web apps.

## Business Goals

- Provide a beautiful, shareable digital invitation replacing or supplementing physical invites
- Enable RSVP lookup, attendance confirmation, and guest-request workflows
- Collect guest messages, photo/video uploads (Google Drive), and proposal responses for entourage roles
- Allow non-technical editing of wedding details via Google Sheets + dashboard
- Optimize for mobile sharing (OG previews, hashtags, QR codes)
- Support SEO and social discovery (sitemap, JSON-LD Event schema, robots.txt)

## Target Audience

| Audience | Needs |
|----------|-------|
| **Wedding guests** | View details, RSVP, leave messages, browse gallery, find venue/maps, dress code |
| **Couple / coordinators** | Manage guest list, approve requests, track proposals, edit content |
| **Entourage / sponsors** | Accept/decline personalized role invitations via proposal pages |
| **Future SaaS customers** | Same platform, different couple/event, white-label themes |

## Main User Journey (Guest)

```
Share link / QR → Loading screen (9s branded intro)
  → Envelope invite (wax seal animation, polaroid photos)
  → "Open invitation" CTA
  → Full site with navbar + sections
  → Search name in Guest List → Confirm/decline attendance
  → Optional: message wall, gallery, Spotify playlist, snap & share uploads
```

## Main User Journey (Admin)

```
/dashboard → Password gate (client-side) → Sidebar tabs
  → Overview stats
  → Guest CRUD (search, filter, companions, VIP, table numbers)
  → Approve guest requests (WishGuest sheet)
  → View messages
  → Manage entourage + principal sponsors
  → Track proposal responses (auto-fills sheet slots on confirm)
```

## Application States (Home Page)

Three-phase client state machine (`AppState` in `components/types.ts`):

| State | UI |
|-------|-----|
| `LOADING` | `LoadingScreen` — progress bar, rotating status messages, particles |
| `LANDING` | `loader/Hero` — 3D envelope, wax seal, polaroids, CTA |
| `DETAILS` | Navbar + all sections + optional WebGL Silk backdrop |

**Special:** Returning from `/gallery` skips loading via `sessionStorage.returnFromGallery`.

---

## Platform Constraints (Non-Negotiable)

These rules apply to **this project and every future clone**:

| Layer | Solution | Why |
|-------|----------|-----|
| **Database** | Google Sheets (Excel) | Free, familiar to clients, no server cost |
| **Backend API** | Google Apps Script web apps | Free, binds to Sheets, same stack as spreadsheet |
| **Guest messages (submit)** | Google Forms → Sheet | Free, no custom form backend needed |
| **Guest messages (read)** | GAS web app on Messages sheet | Same pattern as guests/entourage |
| **Guest uploads (photos/videos)** | Google Drive shared folders | Free 15 GB, already used for snap & share |
| **Site images/audio** | `/public` folder | Free with Vercel/Next.js; optimize locally with Sharp/WebP |
| **Hosting** | Vercel hobby / static export | Free tier sufficient for wedding traffic |

**Explicitly excluded unless user opts in later:**
- PostgreSQL, Supabase, Neon, Firebase, MongoDB Atlas (paid tiers)
- Cloudinary, AWS S3, Vercel Blob (paid at scale)
- Clerk, Auth0 (paid auth) — use sheet-backed dashboard password or free Google OAuth if needed

**Multi-project pattern:** Each wedding/event gets its **own Google Spreadsheet** + set of deployed GAS web apps. Copy `content/site.ts`, paste new deployment URLs, deploy site. No shared paid infrastructure required.

---

# 2. Technology Stack

## Core Framework

| Technology | Version | Why |
|------------|---------|-----|
| **Next.js** | 15.2.6 | App Router, SSR/SSG, API routes, image optimization, SEO |
| **React** | 19 | UI rendering, hooks, client components |
| **TypeScript** | 5.x | Type safety across config, API, components |
| **Node.js** | 22+ | Build tooling, scripts |

## Styling & UI

| Package | Why |
|---------|-----|
| **Tailwind CSS** 4.1.9 | Utility-first styling, `@theme inline`, responsive design |
| **tw-animate-css** | Animation utilities |
| **tailwindcss-animate** | shadcn animation classes |
| **class-variance-authority (cva)** | Variant-based component styling |
| **clsx** + **tailwind-merge** | Conditional class merging (`cn()` in `lib/utils.ts`) |
| **Radix UI** (20+ primitives) | Accessible dialogs, tabs, accordion, select, etc. |
| **shadcn/ui** | Pre-built components in `components/ui/` |
| **lucide-react** | Icon set |
| **next-themes** | Dark mode provider (present but not wired to root layout) |
| **vaul** | Drawer component |
| **cmdk** | Command palette |
| **sonner** | Toast notifications |

## Animation & Visual Effects

| Package | Why |
|---------|-----|
| **motion** (Framer Motion v12) | Page transitions, scroll reveals, loader animations |
| **gsap** | StaggeredMenu mobile nav timelines |
| **three** + **@react-three/fiber** | WebGL Silk fabric shader backdrop |
| **embla-carousel-react** | Carousels (UI primitive) |
| **@emotion/is-prop-valid** | Motion prop validation |

## Forms & Validation

| Package | Why |
|---------|-----|
| **react-hook-form** | Form state (dashboard, messages) |
| **@hookform/resolvers** | Zod integration |
| **zod** | Schema validation |
| **input-otp** | OTP inputs (UI) |
| **react-day-picker** | Calendar picker |

## Data & Backend Integration

| Technology | Why |
|------------|-----|
| **Google Apps Script** | Serverless CRUD on Google Sheets (guests, entourage, details) |
| **Google Sheets** | Primary database (spreadsheet ID in `content/site.ts`) |
| **Google Forms** | Message submission (`messageForm` URL) |
| **Google Drive** | Guest photo/video upload folder |
| **Next.js API Routes** | Proxy layer hiding GAS URLs, normalizing responses |

## Media & CDN

| Package | Why |
|---------|-----|
| **sharp** | WebP conversion via `npm run images:webp` (local pre-deploy optimization) |

## Utilities

| Package | Why |
|---------|-----|
| **date-fns** | Date formatting/parsing |
| **qrcode.react** | QR codes (details section, snap & share) |
| **@vercel/analytics** | Usage analytics on Vercel |

## Fonts

**Google Fonts (next/font):** Inter, Great Vibes, Imperial Script, Cinzel  
**Local fonts:** Brittany Signature, Playlist Script, Sorts Mill Goudy, Hello Paris Sans, Brightwall, Beautiful Malera, The Seasons, Above the Beyond

## Media & Asset Strategy

**Current approach:** All site images, audio, and static assets are served directly from the **`/public` folder** via Next.js static file serving and the built-in **`next/image`** optimizer (Sharp on Vercel).

| Asset type | Location | How it is referenced |
|------------|----------|----------------------|
| Hero backgrounds | `public/desktop-background/`, `public/mobile-background/` | `next/image` with paths like `/desktop-background/photo.webp` |
| Love story | `public/LoveStory/` | StorySection `imageSrc` |
| Details / dress code | `public/Details/` | Details, registry, FAQ sections |
| Monogram | `public/monogram/` | `siteConfig.couple.monogram` |
| Gallery | `public/gallery/` + background folders | `fetchGalleryImages()`, MasonryGallery |
| Background music | `public/background_music/` | `<audio src="...">` |
| QR codes | `public/QR/` | Registry, snap & share |
| OG preview | `public/Details/newLinkPreview.png` | `app/layout.tsx` metadata |

**Guest-uploaded content** already uses **Google Drive** (snap & share folder, video message links) — not hosted in `/public`.

### Future media options (free only — same philosophy as Apps Script)

| Option | Cost | Best for | Notes |
|--------|------|----------|-------|
| **`/public` + Vercel** | Free | **Current default** — all static site assets | Run `npm run images:webp` before deploy; keep repo under ~100 MB |
| **Google Drive** | Free (15 GB) | Guest uploads + optional hosted hero/gallery URLs | Store share links in `WeddingDetails` sheet columns; use `lh3.googleusercontent.com` in `next/image` remotePatterns |
| **Cloudflare R2** | Free tier (10 GB) | Many events, high bandwidth | S3-compatible; only if `/public` or Drive limits hit |
| **GitHub repo assets** | Free | Backup of `/public` | Not a runtime CDN replacement |

**Recommended path (free stack only):**
1. **Now:** Keep all invitation images in `/public`; reference as `/Details/photo.webp`
2. **Optional:** Add `MediaAssets` sheet tab listing Drive URLs for images the couple changes often (monogram, hero) without redeploying
3. **Only if needed:** Cloudflare R2 free tier — store public URLs in a Google Sheet tab, not a separate database

---

## DevOps & Quality

| Tool | Why |
|------|-----|
| **Vercel** | Hosting (inferred from Analytics, cache headers) |
| **@next/bundle-analyzer** | Bundle size analysis (`npm run analyze`) |
| **lighthouse** + **@lhci/cli** | Performance audits |
| **source-map-explorer** | Chunk analysis |
| **husky** | Git hooks |
| **eslint** | Linting |
| **tsx** | TypeScript script execution |

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, OG metadata |
| `NEXT_PUBLIC_ENABLE_DECOR` | Toggle Silk backdrop + decor (`!== 'false'` = on) |
| `NEXT_PUBLIC_GUEST_API_URL` | Direct GAS for `/dashboard-improved` |
| `NEXT_PUBLIC_WEDDING_API_URL` | Legacy (superseded by `/api/wedding-details`) |
| `ANALYZE=true` | Enable bundle analyzer |

**Note:** Most GAS URLs are hardcoded in `content/site.ts`, not env vars.

---

# 3. Folder Structure

```
gilbert-and-jesie/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout: fonts, SEO, JSON-LD, ClientLayout
│   ├── page.tsx                  # Home: 3-state invitation flow
│   ├── globals.css               # Tailwind v4 theme, motif colors, animations
│   ├── sitemap.ts                # /sitemap.xml
│   ├── robots.ts                 # /robots.txt
│   ├── api/                      # Server-side API proxies → Google Apps Script
│   │   ├── guests/route.ts
│   │   ├── guest-requests/route.ts
│   │   ├── messages/route.ts
│   │   ├── entourage/route.ts
│   │   ├── principal-sponsor/route.ts
│   │   ├── wedding-details/route.ts
│   │   ├── proposal-responses/route.ts
│   │   └── rsvp/route.ts         # In-memory only (not production-ready)
│   ├── gallery/
│   │   ├── layout.tsx            # Hides navbar, back-to-main link
│   │   └── page.tsx              # Static masonry gallery
│   ├── dashboard/
│   │   ├── layout.tsx            # Hides root navbar
│   │   ├── page.tsx              # ACTIVE admin dashboard
│   │   ├── page-backup.tsx       # Legacy (NOT routed)
│   │   ├── page-old.tsx          # Legacy (NOT routed)
│   │   └── page-new.tsx          # Skeleton (NOT routed)
│   ├── dashboard-improved/
│   │   └── page.tsx              # Alternate guest dashboard (direct GAS)
│   └── will-you-be-proposal/
│       ├── layout.tsx
│       └── [roleId]/page.tsx     # Dynamic proposal pages
│
├── components/
│   ├── client-layout.tsx         # SiteConfigProvider + AudioProvider + BackgroundMusic
│   ├── navbar.tsx                # Fixed nav + StaggeredMenu mobile
│   ├── types.ts                  # AppState enum
│   ├── loader/                   # Cinematic intro components
│   ├── sections/                 # Page sections (hero, countdown, RSVP, etc.)
│   ├── ui/                       # shadcn/Radix primitives (~60 files)
│   ├── dashboard-*.tsx           # Admin dashboard components
│   ├── improved-guest-list.tsx   # Advanced guest CRUD UI
│   ├── proposal-page.tsx         # Proposal accept/decline flow
│   ├── masonry-gallery.tsx       # Full gallery page
│   ├── silk.tsx                  # Three.js backdrop
│   └── wedding-details-editor.tsx # CMS-style editor (built, not wired to dashboard)
│
├── content/
│   ├── site.ts                   # PRIMARY CONFIG: couple, APIs, static content
│   └── proposal-roles.ts         # 13 proposal role definitions
│
├── contexts/
│   ├── site-config-context.tsx   # Client fetch + merge wedding details
│   └── audio-context.tsx         # Background music pause/resume
│
├── hooks/
│   ├── use-site-config.ts        # Re-export from context
│   ├── use-mobile.ts             # <768px breakpoint
│   └── use-toast.ts              # Toast state
│
├── lib/
│   ├── site-config.ts            # Server merge logic + getSiteConfig()
│   ├── wedding-details-types.ts  # WeddingDetails interface
│   ├── wedding-date.ts           # Date parsing/normalization
│   ├── fetch-gallery-images.ts   # Reads public/ background folders
│   ├── section-typography.ts     # Responsive typography tokens
│   ├── proposal-types.ts         # Proposal TypeScript types
│   ├── proposal-roles.ts         # Role resolution helpers
│   ├── proposal-metadata.ts      # OG metadata for proposal pages
│   ├── coastal-palette.ts        # Coastal color palette (alternate)
│   ├── content.ts                # getSiteContent() wrapper
│   ├── wedding-api.ts            # Legacy client (unused in main flow)
│   └── utils.ts                  # cn(), splitVenueLines()
│
├── google-apps-script/           # Deployable GAS source (5 scripts)
│   ├── guest-management.js
│   ├── entourage-management.js
│   ├── principal-sponsor-management.js
│   ├── wedding-details-single-row.js
│   └── migration-helper.js
│
├── scripts/                      # Build/maintenance CLI tools
│   ├── convert-to-webp.ts        # Convert JPG/PNG/HEIC → WebP via Sharp
│
├── public/                       # Static assets
│   ├── Details/                  # Ceremony/reception/dress code images
│   ├── desktop-background/       # Hero slideshow (desktop)
│   ├── mobile-background/        # Hero slideshow (mobile)
│   ├── LoveStory/                # Love story chapter images
│   ├── gallery/                  # Full gallery photos
│   ├── monogram/                 # Monogram PNG
│   ├── QR/                       # Payment/registry QR codes
│   ├── background_music/         # MP3 autoplay track
│   └── fonts/                    # Local font files
│
├── Font/                         # Additional local fonts
├── styles/globals.css            # Alternate global styles (legacy)
├── next.config.mjs               # Images, headers, bundle analyzer
├── components.json               # shadcn config
├── lighthouserc.json             # Lighthouse CI config
└── package.json
```

### Key File Responsibilities

| File | Responsibility |
|------|----------------|
| `content/site.ts` | Single source of static config + all GAS deployment URLs |
| `lib/site-config.ts` | Merges Google Sheet wedding details over static defaults |
| `contexts/site-config-context.tsx` | Client-side fetch on mount, exposes `useSiteConfig()` |
| `app/page.tsx` | Orchestrates loading → envelope → full site |
| `app/api/*/route.ts` | Validates input, proxies to GAS, normalizes responses |
| `google-apps-script/*.js` | Sheet CRUD logic deployed as separate web apps |

---

# 4. Routing

## Public Pages

### `/` — Home (Main Invitation)

- **Type:** Client Component (`"use client"`)
- **Purpose:** Full wedding invitation SPA with cinematic entry
- **Components:** LoadingScreen, InvitationHero, Navbar, Hero, Welcome, CoupleVideo, LoveStory, Countdown, Gallery, VideoMessage, Messages, Details, WeddingTimeline, Entourage, GuestList (dynamic), BookOfGuests, WeddingPlaylist, FAQ, Registry, SnapShare, Footer, Silk (optional)
- **Data:** `useSiteConfig()` (merged static + Google), `/api/guests`, `/api/messages`, `/api/entourage`, `/api/principal-sponsor`
- **Interactions:** Envelope open, scroll nav, hash anchors (`#gallery`, `#rsvp`), gallery lightbox, RSVP search, message form, Spotify/YouTube embeds pause background music

### `/gallery` — Full Photo Gallery

- **Type:** Server Component, `force-static`
- **Purpose:** Masonry layout of all wedding photos
- **Components:** `MasonryGallery`, sticky header with back link
- **Data:** `getSiteConfig()`, `fetchGalleryImages()` from `public/desktop-background` + `public/mobile-background`
- **Interactions:** Image lightbox, back to `/#gallery` sets sessionStorage flag

### `/will-you-be-proposal/[roleId]` — Proposal Pages

- **Type:** Server Component (dynamic)
- **Purpose:** Personalized entourage/sponsor invitation
- **Params:** `roleId` — one of 13 roles (e.g. `best-man`, `honor-attendant`, `principal-sponsor-ninong`)
- **Components:** `ProposalPage` (reuses LoadingScreen, Silk)
- **Data:** `content/proposal-roles.ts`, `POST /api/proposal-responses`
- **Interactions:** Accept/Decline → logs to sheet + auto-fills entourage/sponsor slot

## Admin Pages

### `/dashboard` — Primary Admin Panel

- **Type:** Client Component
- **Auth:** Password `"2026"` → `sessionStorage.dashboardAuth`
- **Tabs:** dashboard, guests, requests, messages, entourage, proposals
- **Components:** DashboardSidebar, DashboardOverview, ImprovedGuestList, GuestRequests, GuestMessages, EntourageSponsors, ProposalDashboard
- **Data:** All `/api/*` routes

### `/dashboard-improved` — Alternate Guest Dashboard

- **Auth:** Password `"wedding2025"`
- **Purpose:** Demo calling GAS directly via `NEXT_PUBLIC_GUEST_API_URL`
- **Components:** ImprovedGuestList only

## Special Routes

| Route | File | Output |
|-------|------|--------|
| `/sitemap.xml` | `app/sitemap.ts` | Base URL + hash anchors |
| `/robots.txt` | `app/robots.ts` | Allow all, sitemap link |

## API Routes (Summary)

See [Section 8](#8-apis) for full request/response specs.

---

# 5. Components

## Loader Components

### `LoadingScreen` (`components/loader/LoadingScreen.tsx`)

| Aspect | Detail |
|--------|--------|
| **Purpose** | 9-second branded intro before envelope |
| **Props** | `onComplete`, `onFadeStart?` |
| **State** | `fadeOut`, `progress` (0–100), `messageIndex` |
| **Dependencies** | motion, useSiteConfig, InviteParticles, loading-screen.css |
| **Animations** | Fade-out scale/blur; staggered monogram/names/venue; progress bar; particle float |
| **Responsive** | `h-dvh`, corner deco scales sm/md; respects `prefers-reduced-motion` |

### `Hero` / Invitation Envelope (`components/loader/Hero.tsx`)

| Aspect | Detail |
|--------|--------|
| **Purpose** | Interactive wax-seal envelope → polaroids → enter site CTA |
| **Props** | `onOpen`, `onTransitionStart?`, `visible`, `enterFromLoading?` |
| **State** | 8-phase state machine: idle → seal-press → … → cta → exiting |
| **Animations** | 3D flap rotateX, seal shards, letter rise, polaroid hover/lift, exit bloom |
| **Responsive** | CSS `clamp()` positioning; scroll locked until exit |

### `InviteParticles` (`components/loader/InviteParticles.tsx`)

- Floating ambient dots; props: `count?` (28), `palette?`; CSS keyframe animation

## Shell Components

### `Navbar` (`components/navbar.tsx`)

- Fixed top nav; IntersectionObserver for active section; desktop links + GSAP StaggeredMenu mobile
- Links: Home, Welcome, Countdown, Gallery, Messages, Details, Timeline, Entourage, Guest List, FAQ

### `ClientLayout` (`components/client-layout.tsx`)

- Wraps: SiteConfigProvider → AudioProvider → BackgroundMusic → children

### `BackgroundMusic` (`components/background-music.tsx`)

- Hidden `<audio>` from `siteConfig.couple.backgroundMusic`; autoplay with user-interaction fallback

### `Silk` (`components/silk.tsx`)

- WebGL shader fabric via Three.js; props: speed, scale, color, noiseIntensity, rotation
- Dynamic import `ssr: false`; gated by `NEXT_PUBLIC_ENABLE_DECOR`

### `Counter` (`components/Counter.tsx`)

- Odometer-style animated digits; used in Countdown section

## Section Components (Active on Home)

| Component | Section ID | Purpose | Key State/API |
|-----------|------------|---------|---------------|
| `Hero` | `#home` | Slideshow hero, couple names, RSVP CTA | Image index, mobile detection |
| `Welcome` | `#welcome` | Scripture + welcome letter | useSiteConfig |
| `CoupleVideo` | `#couple-video` | YouTube embed (ID: nhzVs-HhId4) | hasClicked, pauses music |
| `LoveStory` | — | 11 StorySection chapters | Static content |
| `Countdown` | `#countdown` | Live countdown + monogram | timeLeft (1s interval) |
| `Gallery` | `#gallery` | 11-photo preview + lightbox | selectedImage, pinch zoom |
| `VideoMessage` | `#video-message` | Google Drive upload CTA | snapShare.googleDriveLink |
| `Messages` | `#messages` | Message form + wall | `/api/messages` GET/POST |
| `Details` | `#details` | Venues, dress code, QR, reminders | Image carousels, QRCodeSVG |
| `WeddingTimeline` | `#wedding-timeline` | Day-of schedule | siteConfig events |
| `Entourage` | `#entourage` | Wedding party from API | `/api/entourage`, `/api/principal-sponsor` |
| `GuestList` | `#guest-list` | RSVP search + confirmation | `/api/guests`, `/api/guest-requests` |
| `BookOfGuests` | — | RSVP stats + name carousel | `/api/guests` polling |
| `WeddingPlaylist` | — | Spotify embed | Pauses background music |
| `FAQ` | `#faq` | Accordion from config | openIndex |
| `Registry` | `#registry` | Gift guide + QR payment | giftRegistry config |
| `SnapShare` | — | Hashtag copy, social share, Drive QR | QRCodeCanvas |
| `Footer` | — | Monogram, typewriter quotes, links | Typewriter effect |

## Commented-Out Sections (Present in Codebase)

- `Accommodation` — hotel/car rental list
- `GuestInformation` — travel info
- `PrincipalSponsors` — merged into Entourage section
- `Rsvp` — standalone RSVP (guest list handles RSVP instead)

## Dashboard Components

| Component | Purpose |
|-----------|---------|
| `DashboardSidebar` | Tab navigation |
| `DashboardOverview` | Stats cards (guests, confirmed, pending, proposals) |
| `ImprovedGuestList` | Full CRUD table with search, filters, companions editor |
| `GuestRequests` | WishGuest approval workflow |
| `GuestMessages` | Read-only message wall admin view |
| `EntourageSponsors` | Entourage + principal sponsor CRUD |
| `ProposalDashboard` | Proposal response tracking |
| `WeddingDetailsEditor` | Tabbed editor for all wedding details (built, not in dashboard tabs yet) |

## UI Primitives Used on Public Site

`Button`, `Card`, `CardContent`, `Input`, `Textarea`, `Skeleton`, `Image` (next/image)

## Supporting Components

| Component | Purpose |
|-----------|---------|
| `StorySection` | Alternating image/text love story chapter with torn paper edges |
| `TornPaperEdge` | SVG torn paper divider |
| `MessageWallDisplay` | Animated message cards with skeleton loading |
| `MasonryGallery` | Full gallery masonry + lightbox |
| `ProposalPage` | Proposal accept/decline UI |
| `Section` | Reusable section shell with title/subtitle |
| `StaggeredMenu` | GSAP mobile nav drawer |

---

# 6. Features

## 6.1 Cinematic Loading Experience

- **9-second branded loading screen** with progress bar, rotating messages, monogram, couple names, venue, save-the-date mask
- **Particle effects** (InviteParticles) with reduced-motion fallback
- **Body scroll lock** during loading and envelope phases

## 6.2 Interactive Envelope Invitation

- Multi-phase 3D CSS envelope animation (wax seal break, letter rise, polaroid emergence)
- Polaroid hover/lift interactions
- Cinematic circle-reveal transition into main site
- Reduced motion: skip to CTA instantly

## 6.3 Hero Slideshow

- Separate desktop/mobile background image sets (`public/desktop-background`, `public/mobile-background`)
- 5-second crossfade between images
- Couple name PNG overlay, wedding date block, RSVP scroll CTA
- Optional butterfly SVG paths (disabled: `SHOW_BUTTERFLIES = false`)

## 6.4 Countdown Timer

- Live countdown to ceremony date (days, hours, minutes, seconds)
- Animated odometer digits via `Counter` component
- Monogram image, formatted date display
- Updates every 1 second via `setInterval`

## 6.5 Gallery

**Home preview (`#gallery`):**
- 11 curated photos in responsive grid (mobile: horizontal snap carousel)
- Lightbox with swipe navigation, pinch-to-zoom on mobile
- Link to full `/gallery` page

**Full gallery (`/gallery`):**
- Static masonry layout from all background folder images
- Portrait/landscape categorization
- Back link preserves scroll position via sessionStorage

## 6.6 Message Wall

- **Submit:** POST to `/api/messages` → Google Apps Script (also Google Form URL available)
- **Display:** GET `/api/messages` → animated card grid with staggered fade-in
- Form validation: name + message required
- Toast feedback on success

## 6.7 Guest List & RSVP

- **Search:** Guest finds their name in invited list (`/api/guests`)
- **Confirm/Decline:** Updates guest status via PUT `/api/guests`
- **Companions:** Add plus-one names with relationships
- **Not on list:** Modal to submit guest request → POST `/api/guest-requests` → `WishGuest` sheet
- **Dynamic import:** `ssr: false` to avoid hydration issues with portals/modals

## 6.8 Book of Guests

- Live stats: total invited, confirmed, declined, pending
- Rotating carousel of confirmed guest names
- Auto-refresh from `/api/guests`

## 6.9 Wedding Details Section

- Ceremony + reception venue cards with image carousels (4.5s auto-rotate)
- Google Maps links (QR codes via `qrcode.react`)
- Dress code palette cards: Ninang, Ninong, Bridesmaids, Groomsmen, Guests
- Color swatches with descriptions
- Gentle reminders list
- Couple photo wobble carousel

## 6.10 Entourage Display

- Fetches live data from `/api/entourage` + `/api/principal-sponsor`
- Falls back to static arrays in `content/site.ts`
- Complex grouped layouts: parents, bridesmaids, groomsmen, flower girls, bearers, sponsors
- Scroll-triggered reveal animations

## 6.11 Wedding Timeline

- Vertical alternating timeline (left/right on desktop, compact grid on mobile)
- Events from siteConfig: entourage arrival, ceremony, reception, etc.
- Custom SVG icons per event type

## 6.12 Love Story

- 11 chapters via `StorySection` components
- Alternating image-left/image-right layouts
- Torn paper edge transitions between sections
- IntersectionObserver scroll reveals

## 6.13 Couple Video

- YouTube IFrame API with thumbnail-first click-to-play
- Pauses/resumes background music on play/pause/end

## 6.14 Wedding Playlist

- Spotify embed playlist (`siteConfig.playlist.embedUrl`)
- Coordinates with background music (pauses site audio when Spotify plays)

## 6.15 FAQ

- Accordion from site config
- Single open item at a time
- Chevron rotation animation

## 6.16 Gift Registry

- QR code images for BPI, MariBank payment accounts
- Registry links and account numbers from `siteConfig.giftRegistry`

## 6.17 Snap & Share

- Wedding hashtag copy-to-clipboard (`#KAMEELfoundherforeBERT`)
- Social share buttons (Web Share API on mobile)
- Google Drive upload QR for guest photos/videos
- Album QR image

## 6.18 Video Message Upload

- CTA linking to Google Drive folder for guest video messages

## 6.19 Background Music

- Autoplay MP3 from `/background_music/`
- User-interaction fallback for iOS autoplay restrictions
- Pause/resume API via AudioContext for video/Spotify conflicts

## 6.20 Proposal System ("Will You Be My…")

- 13 personalized role pages at `/will-you-be-proposal/[roleId]`
- Roles: Best Man, Honor Attendant (Matron/Maid), Bridesmaid, Groomsman, Flower Girl, Ring Bearer, Coin Bearer, Little Bride, Candle/Veil/Cord Sponsors, Ninong, Ninang
- Accept → logs response + auto-fills empty sheet slot (bottom-up scan)
- Decline → logs only
- Dashboard tracks fill progress via `countFilledNamesByProposalRoles()`

## 6.21 Admin Dashboard

- Password-protected tabs for guests, requests, messages, entourage, proposals
- Guest CRUD: create, update, delete, bulk operations
- Approve guest requests → create guest + delete request
- Refresh all data button
- Success/error toast messages

## 6.22 SEO & Social

- Rich metadata: title, description, keywords, OG, Twitter cards
- JSON-LD Event schema (note: date mismatch — schema says April 18, config says October 11)
- Sitemap with hash anchors
- robots.txt allows Facebook crawler
- Canonical URL from env

## 6.23 QR Codes

- Venue maps in Details section
- Payment registry QR codes
- Google Drive upload QR in Snap & Share

## 6.24 Theme / Visual System

- Motif color CSS variables (cream, gold, dusty rose, olive, orchid)
- WebGL Silk animated backdrop (toggle via env)
- Layered typography: "The Seasons" + "Above the Beyond" script pairing
- Corner decorative SVG elements on sections

---

# 7. Google Apps Script

## 7.1 Architecture

Each feature deploys as a **separate Google Apps Script Web App** bound to one shared Google Spreadsheet:

**Spreadsheet ID:** `1qFMmYURdS98lp_Ngwg43l1P3K7ce4AwrQDn1f3_KpJk`

**Deployment settings (all scripts):**
- Execute as: **Me**
- Who has access: **Anyone** (required for public website POST/GET)

## 7.2 Sheet Tabs & Schemas

### `Guests` (14 columns)

| Col | Field | Type |
|-----|-------|------|
| A | ID | UUID string (auto) |
| B | Name | string (required) |
| C | Role | string |
| D | Email | string |
| E | Contact | phone |
| F | Message | string |
| G | AllowedGuests | number |
| H | Companions | JSON string `[{name, relationship}]` |
| I | TableNumber | string |
| J | IsVip | TRUE/FALSE |
| K | Status | pending/confirmed/declined/request |
| L | AddedBy | string |
| M | CreatedAt | ISO timestamp |
| N | UpdatedAt | ISO timestamp |

**Script:** `google-apps-script/guest-management.js`  
**Deployed URL:** `siteConfig.googleAPI.guestList`

**Actions (POST body `action`):**
- `create` — append row, generate UUID
- `update` — find by ID, update fields
- `delete` — find by ID, delete row
- `bulk_import` — array of guests

**GET:** Returns JSON array of all guests (rows 2+)

**Editor helpers:** `initializeGuestSheet()`, `addSampleGuests()`, `getGuestStatistics()`, `exportGuestsToCSV()`

### `Entourage` (4 columns)

| Col | Field |
|-----|-------|
| A | Name |
| B | RoleCategory |
| C | RoleTitle |
| D | Email |

**Script:** `google-apps-script/entourage-management.js`  
**Deployed URL:** `siteConfig.googleAPI.entourage`

**Actions:**
- `create`, `update`, `delete` — standard CRUD
- `fill-slot` — `{ action: "fill-slot", Name, RoleCategory }` — scans bottom-up for empty Name in matching RoleCategory (with alias matching), fills slot

**RoleCategory aliases:** e.g. "Bridesmaid" matches "Bridesmaids", "Flower Girl" matches "Flower Girls"

### `PrincipalSponsors` (2 columns)

| Col | Field |
|-----|-------|
| A | MalePrincipalSponsor |
| B | FemalePrincipalSponsor |

**Script:** `google-apps-script/principal-sponsor-management.js`  
**Deployed URL:** `siteConfig.googleAPI.sponsors`

**Actions:**
- `create`, `update`, `delete` — standard CRUD (update uses `originalMale`/`originalFemale` for row lookup — duplicate bug was fixed)
- `fill-slot` — `{ action: "fill-slot", Name, fillColumn: "male"|"female" }` — fills empty cell bottom-up

### `WeddingDetails` (26 columns, single data row)

Row 1 = headers, Row 2 = all live data.

| Col | Field |
|-----|-------|
| 1 | Bride full name |
| 2 | Bride nickname |
| 3 | Groom full name |
| 4 | Groom nickname |
| 5 | Wedding date |
| 6 | Wedding venue |
| 7 | Wedding tagline |
| 8 | Theme / motif |
| 9 | Hashtag |
| 10 | Ceremony venue name |
| 11 | Ceremony address |
| 12 | Ceremony time |
| 13 | Ceremony Google Maps URL |
| 14 | Reception venue name |
| 15 | Reception address |
| 16 | Reception time |
| 17 | Reception Google Maps URL |
| 18 | About the bride |
| 19 | About the groom |
| 20 | Shared love story |
| 21 | Dress code theme |
| 22 | Dress code note |
| 23 | RSVP deadline |
| 24 | Bride phone |
| 25 | Groom phone |
| 26 | Contact email |

**Script:** `google-apps-script/wedding-details-single-row.js`  
**Deployed URL:** `siteConfig.googleAPI.weddingDetails`

**Actions:**
- `GET` — returns nested `WeddingDetails` JSON
- `POST action: update` — writes row 2 from nested body
- `POST action: delete` — clears row 2
- `POST action: initialize` — creates headers + default row

### `WishGuest` (6 columns)

| Col | Field |
|-----|-------|
| A | Name |
| B | Email (default "Pending") |
| C | Phone |
| D | RSVP |
| E | Guest |
| F | Message |

**Script:** NOT in repo — full code in `GUEST_WISH_SETUP.md`  
**Deployed URL:** `siteConfig.googleAPI.guestRequest`

**Actions:** Default POST = create; `update` by Name; `delete` by Name

### `Messages` (3 columns, inferred)

| Col | Field |
|-----|-------|
| A | Timestamp |
| B | Name |
| C | Message |

**Script:** NOT in repo — deployed externally  
**Deployed URL:** `siteConfig.googleAPI.message`  
**Also:** Google Form at `siteConfig.googleAPI.messageForm` for direct submission

### `ProposalResponses` (inferred)

Fields: `id`, `role`, `name`, `status`, `submittedAt`, `category`

**Script:** NOT in repo — deployed externally  
**Deployed URL:** `siteConfig.googleAPI.proposalResponses`

**Actions:**
- `GET ?action=proposals` — list all responses
- `POST { action: "proposal", role, name, status, submittedAt }` — log response
- `POST { action: "delete-proposal", id }` — delete

## 7.3 Deployment Process

For each script in `google-apps-script/`:

1. Open Google Spreadsheet → Extensions → Apps Script
2. Create new project OR paste script into existing bound project
3. Run `initialize*Sheet()` once from editor to create tab + headers
4. Deploy → New deployment → Web app
5. Copy deployment URL → paste into `content/site.ts` → `googleAPI.*`
6. Test with curl or dashboard

## 7.4 Migration Helper

`migration-helper.js` — migrates legacy `GuestList` / `OldGuests` (5-column format) to new `Guests` sheet. Run manually in editor.

## 7.5 Permissions Required

- Google Sheets: read/write on bound spreadsheet
- Google Drive: if using Drive upload links (folder permissions set separately)
- No OAuth for public website — web apps use script owner's credentials

## 7.6 Data Validation (GAS-side)

- Guest create: requires `name` + `role`
- Guest update/delete: requires `id`
- Entourage/sponsor updates: requires lookup keys (`originalName`, `originalMale`)
- Wedding details: all fields trimmed, empty strings allowed (merge logic on frontend uses non-empty only)

---

# 8. APIs

## 8.1 Next.js API Routes (Proxy Layer)

All routes fetch/post to GAS URLs from `siteConfig.googleAPI` unless noted.

### `GET|POST|PUT|DELETE /api/guests`

**GET Response:**
```json
[{
  "id": "uuid",
  "name": "string",
  "role": "Guest",
  "email": "",
  "contact": "",
  "message": "",
  "allowedGuests": 1,
  "companions": [{"name": "string", "relationship": "string"}],
  "tableNumber": "",
  "isVip": false,
  "status": "pending|confirmed|declined|request",
  "addedBy": "",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}]
```

**POST:** Requires `name`, `status`. Proxies `{ action: "create", ...body }`  
**PUT:** Requires `id`. Proxies `{ action: "update", id, ...body }`  
**DELETE:** Body `{ id }`. Proxies `{ action: "delete", id }`

### `GET|POST /api/messages`

**GET:** Parses sheet rows → `[{ timestamp, name, message }]`  
**POST:** Body `{ name, message }` + auto timestamp

### `GET|POST|PUT|DELETE /api/guest-requests`

**Schema:** `{ Name, Email, Phone, RSVP, Guest, Message }`  
**POST:** Requires `Name`; Email defaults to `"Pending"`

### `GET|POST|PUT|DELETE /api/entourage`

**Schema:** `{ Name, RoleCategory, RoleTitle, Email }`  
**PUT:** Supports `originalName` for row lookup

### `GET|POST|PUT|DELETE /api/principal-sponsor`

**Schema:** `{ MalePrincipalSponsor, FemalePrincipalSponsor }`  
**PUT:** Requires `originalMale` or `originalFemale`

### `GET|PUT|DELETE|POST /api/wedding-details`

**GET:** Returns merged `{ ...WeddingDetails, weddingDetails, siteConfig }`  
**PUT:** Partial/full WeddingDetails → `{ action: "update", ...body }`  
**DELETE:** Clears sheet row  
**POST:** `{ action: "initialize" }` only

### `GET|POST|DELETE /api/proposal-responses`

**POST body:**
```json
{
  "role": "best-man",
  "name": "John Doe",
  "status": "Confirmed|Declined",
  "submittedAt": "ISO8601"
}
```

**Side effects on Confirmed:**
- Entourage role → POST entourage GAS `fill-slot`
- Ninong → POST sponsors GAS `fill-slot` fillColumn male
- Ninang → POST sponsors GAS `fill-slot` fillColumn female

### `GET|POST /api/rsvp` (In-Memory — NOT Production)

**POST:** `{ fullName, email, attending, phone?, guests?, mealPreference?, message? }`  
Stored in module array; lost on restart. **Replace with Sheets persistence in v2.**

## 8.2 External APIs

| Service | Usage |
|---------|-------|
| **Google Apps Script Web Apps** | All persistent CRUD (guests, entourage, details, proposals) |
| **Google Forms** | Primary message submission → Messages sheet |
| **Google Maps** | Venue links (goo.gl short URLs) |
| **YouTube IFrame API** | Couple video embed |
| **Spotify IFrame API** | Wedding playlist embed |
| **Next.js `/public` + Image** | All site-owned images and audio |
| **Vercel Analytics** | Page view tracking (free tier) |

## 8.3 Error Handling

- API routes return `{ error: string, details?: string }` with appropriate HTTP status
- Frontend: try/catch with toast/error banners
- Wedding details GET returns empty defaults on failure (graceful degradation)

## 8.4 Caching

- Wedding details: `cache: "no-store"` on fetches
- Messages: `Cache-Control: no-cache` on dashboard fetch
- Production HTML: `s-maxage=10, stale-while-revalidate=59`
- Static assets: `max-age=31536000, immutable`

---

# 9. Database

> **There is no SQL/NoSQL database.** Google Sheets **is** the database. This is intentional and must remain true across all projects.

## 9.1 Storage Strategy

| Data type | Storage | Access |
|-----------|---------|--------|
| Guest list, RSVP status | `Guests` sheet tab | GAS `guestList` web app → `/api/guests` |
| Guest join requests | `WishGuest` sheet tab | GAS `guestRequest` web app |
| Wedding details (editable) | `WeddingDetails` sheet tab (single row) | GAS `weddingDetails` web app → `/api/wedding-details` |
| Entourage | `Entourage` sheet tab | GAS `entourage` web app |
| Principal sponsors | `PrincipalSponsors` sheet tab | GAS `sponsors` web app |
| Proposal responses | `ProposalResponses` sheet tab (inferred) | GAS `proposalResponses` web app |
| Guest messages (submit) | Google Form → `Messages` sheet | Form POST + GAS read |
| Guest messages (read) | `Messages` sheet tab | GAS `message` web app → `/api/messages` |
| Static content fallback | `content/site.ts` | Bundled; overridden by non-empty sheet values |
| Site images/audio | `/public` folder | Static files; not in Sheets |
| Guest photo/video uploads | Google Drive folder | Links in `siteConfig.snapShare` |

**In-memory only (should migrate to Sheets):** `/api/rsvp` — replace with `Guests` sheet or deprecate route.

## 9.2 Why Google Sheets (Not a Paid DB)

- **$0 cost** at wedding scale (well within Google free quotas)
- Couple/coordinator can edit data directly in Excel/Sheets UI
- Apps Script provides REST-like endpoints without hosting a server
- One spreadsheet per project = simple multi-tenant isolation
- Export/backup built-in (File → Download)

## 9.3 Data Models

See Section 7 for sheet schemas. TypeScript interfaces in:
- `lib/wedding-details-types.ts` — WeddingDetails
- `lib/proposal-types.ts` — ProposalRole, ProposalResponse
- `app/api/guests/route.ts` — Guest interface
- `components/improved-guest-list.tsx` — Guest (dashboard)

## 9.4 Relationships

```
WeddingDetails (1 row) ──overrides──► siteConfig (static)
Guests (many rows) ──lookup──► GuestList section RSVP
WishGuest (many) ──approve──► Guests (create) + delete request
ProposalResponses ──confirm──► Entourage/PrincipalSponsors (fill-slot)
Entourage + PrincipalSponsors ──display──► Entourage section
Messages ──display──► Message wall
```

## 9.5 JSON Structures

**Companions (stored as JSON string in sheet):**
```json
[{"name": "Jane Doe", "relationship": "Spouse"}]
```

**SiteConfig (runtime, merged):** Deep clone of `content/site.ts` with WeddingDetails fields overlaid via `mergeWeddingDetailsIntoSiteConfig()`.

## 9.6 Caching Strategy (Current)

- Client: SiteConfigProvider fetches once on mount
- Server: `getSiteConfig()` for gallery page (server component)
- No Redis or paid cache — direct GAS calls per request

**Recommended v2 (still free):** Next.js ISR revalidate 60s on wedding details; optional `CacheService` in GAS for read-heavy endpoints (built into Apps Script, no extra cost).

---

# 10. UI Design System

## 10.1 Typography

| Token | Font | Usage |
|-------|------|-------|
| `--font-sans` | Inter | Body text, UI |
| `--font-serif` | Great Vibes | Decorative headings |
| `--font-imperial-script` | Imperial Script | Script accents |
| `--font-the-seasons` | The Seasons | Section titles (upper layer) |
| `--font-above-beyond` | Above the Beyond | Section titles (script layer) |
| `--font-beautiful-malera` | Beautiful Malera | Welcome accents |
| `--font-cinzel` | Cinzel | Formal text |
| `--font-brittany` | Brittany Signature | Signatures |
| `--font-playlist-script` | Playlist Script | Playlist section |

**Responsive scale:** `lib/section-typography.ts` provides `sectionType`, `layeredSectionTitleSize`, `ct.*` tokens with breakpoint modifiers.

## 10.2 Color Palette (Motif System)

Defined in `app/globals.css` `@theme inline`:

| Token | Hex | Role |
|-------|-----|------|
| `--color-motif-cream` | #F9F4E8 | Background parchment |
| `--color-motif-yellow` | #C5A059 | Champagne gold highlight |
| `--color-motif-soft` | #FDFBF5 | Soft ivory sections |
| `--color-motif-accent` | #C67283 | Dusty rose |
| `--color-motif-deep` | #7D7D46 | Olive green (brand) |
| `--color-motif-medium` | #8B5DA3 | Orchid purple |
| `--color-motif-silver` | #F5F1E6 | Alternate backgrounds |

**Welcome section tokens:** `--color-welcome-bg`, `--color-welcome-text`, `--color-welcome-script`, `--color-welcome-navy`, `--color-welcome-green` (#E76A32)

**shadcn semantic tokens:** `--primary` (#AFC8E6 light blue), `--secondary` (#D8B0B0 dusty pink), `--muted` (#F1EDE2 cream), `--accent`, `--destructive`, `--border`, `--ring`

## 10.3 Spacing

- Section padding: `py-12 sm:py-16 md:py-20 lg:py-24`
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Navbar height: `h-12 sm:h-14 md:h-16`

## 10.4 Border Radius

- Default: `--radius: 0.625rem`
- Cards: rounded-xl to rounded-2xl
- Buttons: rounded-full or rounded-lg

## 10.5 Shadows

- Cards: subtle `shadow-sm` to `shadow-lg`
- Navbar on scroll: backdrop blur + shadow transition
- Modals: `shadow-2xl`

## 10.6 Icons

- **lucide-react** throughout (ChevronDown, Lock, RefreshCw, etc.)
- Custom SVG icons in WeddingTimeline
- Social icons inline in SnapShare/Footer

## 10.7 Buttons

shadcn `Button` variants: default, destructive, outline, secondary, ghost, link  
Custom: motif-colored CTAs with hover scale/lift in sections

## 10.8 Cards

- Corner decorative SVG elements (consistent motif pattern)
- Glass/card style: `bg-white/80 backdrop-blur` on welcome
- Dashboard: shadcn Card with Table inside

## 10.9 Inputs

shadcn Input, Textarea, Select, Checkbox, RadioGroup, Switch — used in dashboard and message form

## 10.10 Dialogs & Sheets

- GuestList: custom portal modals for RSVP confirmation and guest request
- Dashboard: shadcn Dialog for edit forms
- Mobile nav: GSAP StaggeredMenu (not Radix Sheet)

## 10.11 Animations

| Animation | Location | Library |
|-----------|----------|---------|
| Page reveal | Home entry | motion variants |
| Scroll reveal | Sections | `whileInView` motion |
| Countdown shimmer | globals.css | CSS keyframes |
| Guest carousel | globals.css | CSS keyframes |
| Album flipbook | globals.css | CSS keyframes |
| Typewriter | Footer | JS interval |
| Odometer digits | Counter | motion spring |
| Envelope 3D | loader/Hero | CSS transforms |
| Silk fabric | silk.tsx | Three.js shader |
| Mobile menu | StaggeredMenu | GSAP timeline |

## 10.12 Responsive Breakpoints

Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px  
Container queries: `@container/welcome`, `@container/messages`, `@container/entourage`  
Mobile detection hook: `<768px` via `useIsMobile`

## 10.13 Dark Mode

CSS variables defined for `.dark` class but **not activated** in root layout. ThemeProvider exists but unwired.

---

# 11. Theme System (V2 Specification)

## 11.1 Goals

Support **unlimited event themes** without code changes: wedding, birthday, debut, corporate, minimal, luxury, modern, floral, dark, light.

## 11.2 Theme Schema (Proposed)

```typescript
interface EventTheme {
  id: string
  name: string
  category: "wedding" | "birthday" | "debut" | "corporate" | "minimal" | "luxury" | "modern" | "floral" | "dark" | "light"
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    motif: Record<string, string>  // all --color-motif-* tokens
    welcome: Record<string, string>
  }
  fonts: {
    sans: string
    serif: string
    script: string
    display: string
  }
  backgrounds: {
    hero: string[]           // image URLs
    section: string
    loader: string
    envelope: string
  }
  animations: {
    loaderDuration: number
    scrollReveal: "fade-up" | "fade-in" | "slide" | "none"
    envelopeStyle: "classic" | "minimal" | "luxury" | "floral"
    backdrop: "silk" | "particles" | "gradient" | "video" | "none"
    backdropConfig: Record<string, unknown>
  }
  decorations: {
    cornerStyle: "botanical" | "geometric" | "minimal" | "floral" | "none"
    monogramStyle: "image" | "text" | "initials"
  }
}
```

## 11.3 Theme Application

1. Store themes in a **`Themes` Google Sheet tab** (or JSON column in `WeddingDetails`)
2. Dashboard theme picker with live preview iframe
3. Inject CSS variables at runtime via `<style>` tag or CSS-in-JS
4. Load fonts dynamically via `next/font` registry or Google Fonts link
5. Section components read tokens only — never hardcoded hex values

## 11.4 Preset Themes (Ship with Platform)

| Preset | Primary Feel |
|--------|--------------|
| Botanical Cream | Current Gilbert & Kameel motif |
| Coastal Sunset | `lib/coastal-palette.ts` |
| Luxury Gold | Black + gold + serif |
| Modern Minimal | White, black, sans-serif only |
| Floral Garden | Soft pinks, botanical corners |
| Dark Elegance | Dark bg, gold accents |
| Corporate Blue | Navy, clean grids |

## 11.5 Theme Sharing (Future)

- Export/import theme JSON between projects (copy into Sheet tab)
- Free preset library shipped with the repo
- Theme versioning tied to Sheet snapshot rows

---

# 12. Dashboard Architecture (V2 Redesign)

## 12.1 Current State

- Single page `/dashboard` with sidebar tabs
- Client-side password auth only
- WeddingDetailsEditor built but **not integrated** into tabs
- No section ordering, no theme editing, no media upload UI

## 12.2 Target Architecture

```
/dashboard
├── /overview          # Stats, quick actions, recent activity
├── /content
│   ├── /couple        # Names, monogram, narratives
│   ├── /event         # Date, venue, timeline, FAQ
│   ├── /sections      # Show/hide, drag reorder
│   └── /theme         # Colors, fonts, animations
├── /guests            # Full guest management
├── /messages          # Message wall moderation
├── /entourage         # Entourage + sponsors + proposals
├── /media             # Media manager (see Section 13)
├── /rsvp              # RSVP settings, deadlines
├── /seo               # Meta, OG image, sitemap
├── /settings          # Domain, passwords, integrations
└── /publish           # Draft vs live, version history
```

## 12.3 Mobile-First Dashboard Requirements

- Bottom tab bar on mobile, sidebar on desktop
- Touch-friendly 44px minimum tap targets
- Swipeable cards for guest/message lists
- Inline editing with auto-save (debounced 500ms)
- Offline draft queue with sync on reconnect

## 12.4 Editable Fields (No Code Required)

| Category | Fields |
|----------|--------|
| **Couple** | Bride/groom names, nicknames, monogram upload |
| **Event** | Date, time, venue, ceremony, reception, maps URLs |
| **Content** | Welcome letter, love story chapters, FAQ items, timeline events |
| **Media** | Hero images, gallery, venue photos, background music, videos |
| **Theme** | All colors, fonts, backdrop type, corner decorations |
| **Sections** | Show/hide toggle, drag order, section-specific content |
| **RSVP** | Deadline, coordinator contact, allowed guest defaults |
| **Social** | Hashtags, Spotify playlist, Google Drive links, share text |
| **Registry** | Payment QR codes, account numbers, links |
| **SEO** | Title, description, OG image, keywords |
| **Integrations** | GAS URLs, Google Form URL, spreadsheet link, `/public` asset paths |

## 12.5 Dashboard Tech Stack (Recommended — Free Stack)

- **Auth:** Dashboard password in Sheet or env; optional free Google OAuth (no paid auth services)
- **State:** TanStack Query for API cache + optimistic updates (calls `/api/*` → GAS only)
- **Forms:** react-hook-form + zod per section
- **Drag reorder:** @dnd-kit/core
- **Live preview:** iframe of public site with `?preview=true`
- **Real-time:** Poll GAS endpoints every 30–60s (no paid realtime DB)

---

# 13. Media Manager (V2 CMS — Free Stack)

> **Policy:** Site-owned media lives in **`/public`**. Guest uploads use **Google Drive**. No paid CDN or storage service.

## 13.1 Features

| Feature | Description |
|---------|-------------|
| **Local asset workflow** | Add/replace files in `public/` folders; redeploy site (or use Drive URLs in Sheet for hot-swappable assets) |
| **Image compression** | Run `npm run images:webp` (Sharp) before commit — converts JPG/PNG/HEIC → WebP |
| **Cropping** | Crop locally before adding to `public/` (or in-browser crop → save to `public/`) |
| **Folders/Albums** | `public/desktop-background/`, `mobile-background/`, `LoveStory/`, `Details/`, `gallery/`, `QR/`, `background_music/` |
| **Video support** | YouTube embed URL in Sheet or `siteConfig`; guest videos via Google Drive folder |
| **Audio support** | MP3 in `public/background_music/` |
| **Lazy loading** | `next/image` with `loading="lazy"` + responsive `sizes` |
| **Optimization** | Next.js built-in Image optimization (Sharp on Vercel) |
| **Alt text** | Stored in optional `MediaAssets` Sheet tab or `content/site.ts` |
| **Guest uploads** | Google Drive shared folder (already used in Snap & Share) |

## 13.2 Storage Architecture

```
public/                          ← primary source (free, bundled with deploy)
├── desktop-background/          ← hero slideshow (desktop)
├── mobile-background/           ← hero slideshow (mobile)
├── LoveStory/                   ← love story chapters
├── Details/                     ← venue, dress code, OG image
├── gallery/                     ← full gallery extras
├── monogram/                    ← couple monogram
├── QR/                          ← payment / album QR codes
└── background_music/            ← autoplay track

Google Drive/                    ← guest uploads + optional dynamic URLs
└── {event-folder}/              ← snap & share, video messages

Google Sheet (optional MediaAssets tab)
└── path | driveUrl | alt | album  ← URLs for assets that change without redeploy
```

## 13.3 Integration with Sections

- Gallery: `fetchGalleryImages()` reads `public/desktop-background/` + `public/mobile-background/`
- Hero: image arrays in `siteConfig` or Sheet → paths under `/public/...`
- Optional: Sheet column with Google Drive direct image URL for monogram/hero (no redeploy needed)

## 13.4 Current Scripts

- `npm run images:webp` — local WebP conversion via Sharp (run before deploy)

## 13.5 Free Alternatives (If `/public` Limits Are Hit)

| Service | Cost | Use case |
|---------|------|----------|
| **Google Drive** | Free 15 GB | Same ecosystem as Sheets/GAS; store URLs in Sheet |
| **Cloudflare R2** | Free tier | High bandwidth; URLs still stored in Google Sheet |
| **Git + Vercel** | Free hobby | Current approach — keep images in repo `/public` |

---

# 14. Customization Engine (V2)

## 14.1 Core Capabilities

| Capability | Implementation |
|------------|----------------|
| **Show/Hide sections** | `sections[]` config with `visible: boolean` |
| **Drag-and-drop order** | Ordered array persisted to DB/Sheet |
| **Live preview** | iframe with postMessage sync |
| **Undo/Redo** | Command stack (max 50 actions) |
| **Auto-save** | Debounced PUT every 500ms |
| **Draft mode** | `status: "draft"` config not served publicly |
| **Publish mode** | Atomic swap draft → live |
| **Version history** | Snapshot on each publish, diff view, rollback |
| **Templates** | Pre-built section layouts + themes |
| **Theme presets** | One-click apply from preset library |

## 14.2 Section Config Schema

```typescript
interface SectionConfig {
  id: string
  type: "hero" | "welcome" | "countdown" | "gallery" | "messages" | "details" | "timeline" | "entourage" | "guest-list" | "faq" | "registry" | "playlist" | "snap-share" | "footer" | "custom"
  visible: boolean
  order: number
  props: Record<string, unknown>  // section-specific content
}
```

## 14.3 Publish Flow

```
Edit in dashboard → Auto-save to draft
  → Preview in iframe (?preview=draft)
  → Click Publish → validate all required fields
  → Create version snapshot
  → Write to live config (Sheet + edge cache purge)
  → Public site reflects changes within 60s (ISR revalidation)
```

---

# 15. Performance Improvements

## 15.1 Current Bottlenecks

| Issue | Impact |
|-------|--------|
| Heavy client bundle (Three.js, GSAP, motion) | Slow TTI on mobile |
| All sections render at once after envelope | Large DOM |
| Direct GAS calls per API request | Latency, no cache |
| `GuestList` + `Silk` dynamically imported but still heavy | Main thread work |
| JSON-LD date mismatch | SEO confusion |
| Large `/public` folder size | Slow deploys; mitigate with WebP + image count limits |
| `typescript.ignoreBuildErrors: true` | Hidden type bugs |
| In-memory RSVP | Data loss |

## 15.2 Recommendations

### Lazy Loading & Code Splitting
- Dynamic import every section below fold (not just GuestList/Silk)
- Route-level splitting for dashboard and gallery
- Lazy load YouTube/Spotify iframes on intersection

### Image Optimization
- Run `npm run images:webp` before deploy; prefer WebP in `/public`
- Use `next/image` with correct `sizes` for responsive loading
- Keep hero/gallery assets under ~200 KB each where possible

### Caching
- ISR for home page shell (revalidate: 60)
- Edge cache wedding details API response
- SWR/TanStack Query on client with staleTime

### SEO
- Fix JSON-LD dates to match siteConfig
- Dynamic metadata from merged siteConfig
- Structured data for FAQ, BreadcrumbList

### Accessibility
- Respect `prefers-reduced-motion` everywhere (partially done)
- Focus trap in modals
- ARIA labels on envelope/interactive elements
- Keyboard nav for gallery lightbox

### Bundle Size
- Tree-shake lucide icons (import per icon)
- Replace Three.js Silk with CSS gradient option as default
- `optimizePackageImports` already configured — extend list

### Server Components
- Convert static sections (Welcome, FAQ, Footer) to RSC
- Keep interactive sections (GuestList, Countdown) as client islands

### Static Generation
- Gallery page already `force-static` — extend to love story content
- Pre-render proposal pages for all 13 roles

---

# 16. Better Architecture (V2)

## 16.1 Feature-Based Folder Structure

```
src/
├── features/
│   ├── invitation/
│   │   ├── components/     # Hero, Welcome, Countdown, etc.
│   │   ├── hooks/
│   │   └── types/
│   ├── guest-rsvp/
│   │   ├── components/     # GuestList, BookOfGuests
│   │   ├── api/            # Server actions
│   │   └── schemas/        # Zod guest schema
│   ├── messages/
│   ├── entourage/
│   ├── gallery/
│   ├── loader/             # LoadingScreen, Envelope
│   ├── dashboard/
│   ├── proposals/
│   └── media/
├── shared/
│   ├── ui/                 # shadcn primitives
│   ├── lib/                # utils, dates, fetch-gallery-images
│   ├── config/             # site defaults
│   └── types/
├── server/
│   ├── db/                 # Sheet adapter abstraction
│   ├── auth/
│   └── cache/
└── app/                    # Thin route files importing features
```

## 16.2 Clean Architecture Layers

```
Presentation (components) → Application (hooks, server actions) → Domain (types, schemas) → Infrastructure (GAS/Sheets adapter, /public assets, auth)
```

## 16.3 Key Patterns

| Pattern | Application |
|---------|-------------|
| **Repository pattern** | `GuestRepository`, `WeddingDetailsRepository` abstract GAS |
| **Server Actions** | Guest CRUD, wedding details update from dashboard |
| **Zod schemas** | Shared validation client + server |
| **Feature flags** | Section visibility, decor toggle |
| **Error boundaries** | Per-section fallbacks |
| **Suspense** | Streaming static sections |

## 16.4 Shared Hooks

- `useSiteConfig()` — merged config (keep)
- `useGuestSearch()` — guest list search/filter
- `useCountdown()` — countdown timer logic
- `useMediaQuery()` — responsive breakpoints
- `useAutoSave()` — dashboard debounced save

## 16.5 Minimal Duplication

- Consolidate 3 dashboard backup pages into one
- Single guest type definition in `shared/types/guest.ts`
- Unified API client in `shared/lib/api-client.ts`

---

# 17. Suggested New Features

## 17.1 Guest Experience

| Feature | Value |
|---------|-------|
| **Guest QR Check-in** | Scan QR at venue → mark attended in sheet |
| **Digital Gift Registry** | Link external registries (Amazon, SM Gift) |
| **Guest Seating Chart** | Table lookup after RSVP confirm |
| **Photo Upload from Guests** | Direct upload without Drive QR |
| **Digital Guest Book** | Video/audio messages in-browser |
| **Calendar Integration** | Add to Google/Apple Calendar (.ics download) |
| **Multi-language** | EN/TL toggle for Filipino weddings |
| **PWA / Offline** | Installable app, cached invitation |
| **Push Notifications** | RSVP reminders, day-of updates |

## 17.2 Couple / Admin

| Feature | Value |
|---------|-------|
| **Automatic RSVP Reminder** | Email/SMS X days before deadline |
| **Analytics Dashboard** | Page views, section engagement, RSVP funnel |
| **Visitor Tracking** | Unique visitors, referrers, device breakdown |
| **Email Notifications** | New RSVP, new message, new guest request |
| **SMS Notifications** | Twilio integration for urgent alerts |
| **Vendor Dashboard** | Photographer/florist login for media upload |
| **Multiple Events** | Rehearsal dinner, ceremony, reception as sub-events |
| **Admin Roles** | Owner, coordinator, viewer permissions |
| **Export** | CSV/PDF guest list, seating chart PDF |

## 17.3 AI & Automation

| Feature | Value |
|---------|-------|
| **AI Invitation Text** | Generate welcome letter, FAQ from prompts |
| **AI Photo Tagging** | Auto-tag gallery faces |
| **Smart RSVP Parsing** | NLP for guest request messages |

## 17.4 Platform / SaaS

| Feature | Value |
|---------|-------|
| **Theme Marketplace** | Buy/sell themes |
| **Template Marketplace** | Pre-built event packages |
| **Custom Domains** | `smith-wedding.com` CNAME |
| **White Label** | Remove platform branding |
| **Sub-accounts** | Wedding planner manages multiple clients |

---

# 18. Future Multi-Project Architecture (Free Stack)

> **Core principle:** Scale by cloning the same free pattern — one Google Spreadsheet + GAS web apps + `/public` assets per event. No paid database, no paid CDN.

## 18.1 Multi-Project Model

```
Wedding planner / developer
  └── Project A (Gilbert & Kameel)
        ├── Google Spreadsheet (Guests, WeddingDetails, Entourage, …)
        ├── 7+ GAS web app deployments
        ├── Google Form → Messages sheet
        ├── Google Drive folder (guest uploads)
        └── Next.js site → content/site.ts + public/
  └── Project B (next couple)
        └── Same structure, different spreadsheet + URLs
```

**Tenant isolation:** One spreadsheet per event. No shared database required.

## 18.2 Recommended Stack (Stays Free)

| Layer | Technology | Cost |
|-------|------------|------|
| **Frontend** | Next.js 15 on Vercel hobby | Free |
| **Database** | Google Sheets | Free |
| **Backend API** | Google Apps Script web apps | Free |
| **Messages (submit)** | Google Forms | Free |
| **Messages (read)** | GAS on Messages sheet | Free |
| **Site images/audio** | `/public` folder | Free with deploy |
| **Guest uploads** | Google Drive shared folders | Free (15 GB) |
| **Auth (dashboard)** | Password in env or Sheet tab | Free |
| **Analytics** | Vercel Analytics | Free tier |
| **Email reminders (optional)** | Gmail + GAS MailApp trigger | Free (quota limits) |

## 18.3 Optional Paid Upgrades (Only If Client Pays)

These are **not** part of the default blueprint. Use only when a client explicitly wants and pays for them:

| Upgrade | Example |
|---------|---------|
| Custom domain | ~$12/yr registrar |
| SMS reminders | Twilio pay-as-you-go |
| Premium Vercel | Higher bandwidth |

## 18.4 Security (Free Stack)

- Dashboard password stored in env or hidden Sheet tab (not in client bundle ideally)
- GAS web apps: validate input server-side in every script
- Google Form: restrict to one response per Google account if needed
- Rate limiting: simple GAS `CacheService` or timestamp checks on POST endpoints
- Sheet access: share spreadsheet only with couple + coordinator emails
- Backup: File → Download CSV/XLSX from Google Sheets (manual or scheduled GAS trigger)

## 18.5 Migration Path (Free Only)

1. **Phase 1:** Wire `WeddingDetailsEditor` into dashboard; all CRUD via existing GAS
2. **Phase 2:** Add `Sections` + `Themes` tabs in spreadsheet for no-code layout/theme edits
3. **Phase 3:** Optional `MediaAssets` sheet tab for Google Drive image URLs (avoid redeploy for hero/monogram)
4. **Phase 4:** Template repo — fork project, swap `content/site.ts`, deploy new spreadsheet

## 18.6 New Project Checklist

1. Duplicate Google Spreadsheet template (all tabs + headers)
2. Deploy each GAS script → copy URLs into `content/site.ts` → `googleAPI`
3. Create Google Form for messages → link in `messageForm`
4. Create Google Drive folder for guest uploads → link in `snapShare`
5. Replace images in `/public` (run `npm run images:webp`)
6. Update `content/site.ts` static defaults
7. Deploy to Vercel (free hobby)

---

# 19. Step-by-Step Recreation Prompt

Use the following prompt with Claude Code, Cursor, or another coding AI to rebuild this project from scratch.

```
Build a Next.js 15 (App Router) + React 19 + TypeScript wedding invitation platform.

PLATFORM CONSTRAINTS (NON-NEGOTIABLE):
- NO paid database (no PostgreSQL, Supabase, Firebase, MongoDB)
- NO Cloudinary or paid CDN
- Database = Google Sheets with Google Apps Script web apps as REST API
- Guest messages submitted via Google Forms; read via GAS from Messages sheet
- All site images/audio in /public folder using next/image
- Guest photo/video uploads via Google Drive links only
- One spreadsheet per wedding project

COUPLE (default template): Gilbert & Kameel, Oct 11 2026, Greenleaf Hotel Gensan

HOME PAGE FLOW:
1. LoadingScreen (9s) → 2. Envelope Hero → 3. Full site with Navbar + sections

SECTIONS (in order): Welcome, CoupleVideo, LoveStory, Countdown, Gallery, VideoMessage, Messages, Details, WeddingTimeline, Entourage, GuestList, BookOfGuests, WeddingPlaylist, FAQ, Registry, SnapShare, Footer

GOOGLE SHEETS TABS: Guests (14 cols), WishGuest, WeddingDetails (26-col single row), Entourage, PrincipalSponsors, Messages, ProposalResponses

GAS SCRIPTS (deploy separately): guest-management.js, entourage-management.js, principal-sponsor-management.js, wedding-details-single-row.js + external scripts for messages/guestRequest/proposals

NEXT.JS API ROUTES (proxy to GAS): /api/guests, /api/guest-requests, /api/messages, /api/entourage, /api/principal-sponsor, /api/wedding-details, /api/proposal-responses

OTHER ROUTES: /gallery (masonry), /dashboard (admin), /will-you-be-proposal/[roleId]

CONFIG: content/site.ts holds couple info, all GAS URLs, static content; lib/site-config.ts merges WeddingDetails from Google over static defaults

UI: Tailwind v4, shadcn/ui, motion animations, motif CSS variables in globals.css, optional Three.js Silk backdrop

DASHBOARD: Password gate, tabs for guests/requests/messages/entourage/proposals; ImprovedGuestList CRUD

MEDIA: public/desktop-background, mobile-background, LoveStory, Details, gallery, monogram, QR, background_music; npm run images:webp for Sharp conversion

Implement all features documented in PROJECT_BLUEPRINT.md sections 1–18. Prioritize mobile-first responsive design, SEO metadata, JSON-LD Event schema, and graceful GAS failure fallbacks to content/site.ts defaults.
```

---

*End of PROJECT BLUEPRINT*

