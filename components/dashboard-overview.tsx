"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { QRCodeCanvas } from "qrcode.react"
import {
  Users,
  Table,
  Mail,
  UserPlus,
  Plane,
  CheckCircle,
  XCircle,
  Crown,
  UserCheck,
  Download,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSiteConfig } from "@/hooks/use-site-config"

interface DashboardOverviewProps {
  stats: {
    guestGroups: number
    confirmedPax: number
    pendingRSVP: number
    joinRequests: number
    attending?: number
    notAttending?: number
    entourage?: number
    principalSponsors?: number
  }
  weddingBrief?: {
    title: string
    content: string
  }
}

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  iconBgColor: string
  iconColor: string
}

function StatCard({ icon, value, label, iconBgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
            iconBgColor
          )}
        >
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#6B7280] font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-[#111827]">{value}</p>
        </div>
      </div>
    </div>
  )
}

const TABLE_QR_FG = "#04103B"
const TABLE_QR_BG = "#FAF7F2"

export function DashboardOverview({ stats, weddingBrief }: DashboardOverviewProps) {
  const siteConfig = useSiteConfig()
  const groomName = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideName = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const [tablePageUrl, setTablePageUrl] = useState("/table")

  useEffect(() => {
    setTablePageUrl(`${window.location.origin}/table`)
  }, [])

  const downloadTableQr = () => {
    const canvas = document.getElementById("dashboard-table-qr-download") as HTMLCanvasElement | null
    if (!canvas) return
    const fileName = `${groomName}-${brideName}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    const link = document.createElement("a")
    link.download = `${fileName || "wedding"}-find-your-table.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const defaultBrief = {
    title: "Gemini's Wedding Brief",
    content: `Here are a few options for a joyful status update: **Option 1: Sweet and simple** "The countdown is officially on! 🔔 We already have ${stats.confirmedPax} of our favorite people confirmed, and we can't wait to hear from the rest of you. We are so excited to see our final group of ${stats.guestGroups} come together for the big day! ❤️ **Option 2: High energy** "RSVPs are rolling in and our hearts are full! ❤️ ${stats.confirmedPax} 'Yes' responses down, ${stats.pendingRSVP} more to hear from! We can't wait to reach our magic number of ${stats.guestGroups} and celebrate the best day ever with you all! 🎉 ✨ **Option 3: Short and punchy** "${stats.confirmedPax} confirmed, ${stats.pendingRSVP} to go! 📝 Watching the guest list grow is getting us so excited for our celebration of ${stats.guestGroups}. Let the wedding countdown begin! 🔔 ✨ **Option 4: Focus on the "Yes"*** "It's getting real! ⭕ We've got ${stats.confirmedPax} 'Yes' votes in the bag and ${stats.pendingRSVP} more pending. We can't wait to see who fills our final ${stats.guestGroups} spots. See you at the altar! 💕 🔔 ""`
  }

  const brief = weddingBrief || defaultBrief

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Wedding Overview</h1>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          value={stats.guestGroups}
          label="Guest Groups"
          iconBgColor="bg-[#D4B5A0]/20"
          iconColor="text-[#8B6F47]"
        />
        <StatCard
          icon={<Table className="h-6 w-6" />}
          value={stats.confirmedPax}
          label="Total Guests (Pax)"
          iconBgColor="bg-[#86EFAC]/20"
          iconColor="text-[#16A34A]"
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6" />}
          value={stats.attending || 0}
          label="Attending"
          iconBgColor="bg-[#86EFAC]/20"
          iconColor="text-[#16A34A]"
        />
        <StatCard
          icon={<XCircle className="h-6 w-6" />}
          value={stats.notAttending || 0}
          label="Not Attending"
          iconBgColor="bg-[#FCA5A5]/20"
          iconColor="text-[#DC2626]"
        />
        <StatCard
          icon={<Mail className="h-6 w-6" />}
          value={stats.pendingRSVP}
          label="Pending RSVP"
          iconBgColor="bg-[#FED7AA]/20"
          iconColor="text-[#EA580C]"
        />
        <StatCard
          icon={<UserPlus className="h-6 w-6" />}
          value={stats.joinRequests}
          label="Join Requests"
          iconBgColor="bg-[#DDD6FE]/20"
          iconColor="text-[#7C3AED]"
        />
        <StatCard
          icon={<Crown className="h-6 w-6" />}
          value={stats.entourage || 0}
          label="Entourage"
          iconBgColor="bg-[#FDE68A]/20"
          iconColor="text-[#F59E0B]"
        />
        <StatCard
          icon={<UserCheck className="h-6 w-6" />}
          value={stats.principalSponsors || 0}
          label="Principal Sponsors"
          iconBgColor="bg-[#C7D2FE]/20"
          iconColor="text-[#6366F1]"
        />
      </div>

      <div className="grid items-center gap-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8 sm:p-8">
        <div className="mx-auto w-full max-w-[14rem] sm:mx-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FFFDF8] p-4">
            <span className="pointer-events-none absolute left-2.5 top-2.5 h-3 w-3 border-l border-t border-[#A67C52]" aria-hidden />
            <span className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 border-r border-t border-[#A67C52]" aria-hidden />
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l border-[#A67C52]" aria-hidden />
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-[#A67C52]" aria-hidden />
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#FAF7F2] [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full">
              <QRCodeCanvas
                id="dashboard-table-qr-visible"
                value={tablePageUrl}
                size={220}
                includeMargin={false}
                fgColor={TABLE_QR_FG}
                bgColor={TABLE_QR_BG}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
          <p className="mt-2.5 text-center text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-[#A67C52]">
            Scan to find your table
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A67C52]">
            {groomName} & {brideName}
          </p>
          <h2 className="mt-1.5 font-serif text-2xl font-bold uppercase tracking-[0.08em] text-[#111827] sm:text-3xl">
            Find Your Table
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#4B5563]">
            Place this code at the entrance. Guests scan it, search their name, and go straight to
            their table.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={downloadTableQr}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#A67C52] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#8B6F47]"
            >
              <Download className="h-3.5 w-3.5" />
              Download QR
            </button>
            <Link
              href="/table"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#E5E7EB] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280] transition-colors hover:border-[#A67C52] hover:text-[#6B4423]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open page
            </Link>
          </div>
          <p className="mt-2 text-xs text-[#6B7280]">
            Saves a print-ready PNG for signs and table cards.
          </p>
        </div>
      </div>

      <div className="h-px w-px overflow-hidden opacity-0" aria-hidden>
        <QRCodeCanvas
          id="dashboard-table-qr-download"
          value={tablePageUrl}
          size={512}
          includeMargin
          fgColor={TABLE_QR_FG}
          bgColor={TABLE_QR_BG}
        />
      </div>

      {/* Wedding Brief Card */}
      <div className="bg-gradient-to-br from-[#8B6F47] to-[#6B5335] rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Plane className="h-6 w-6 text-white" />
          <h2 className="text-2xl font-serif font-bold text-white">{brief.title}</h2>
        </div>
        <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
          {brief.content}
        </div>
      </div>
    </div>
  )
}

