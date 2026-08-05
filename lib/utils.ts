export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function splitVenueLines(venue: string): string[] {
  return venue
    .split(/\s*-\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
}
