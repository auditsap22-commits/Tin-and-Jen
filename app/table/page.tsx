import type { Metadata } from "next"
import { TableFinder } from "@/components/table-finder"
import { siteConfig } from "@/content/site"

const coupleNames = `${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname}`

export const metadata: Metadata = {
  title: "Find Your Table",
  description: `Search your name to find your assigned table at ${coupleNames}'s wedding. Scan, search, and be seated.`,
}

export default function TablePage() {
  return <TableFinder />
}
