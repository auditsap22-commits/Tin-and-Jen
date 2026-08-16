export type SpotifyPlaylistTrack = {
  title: string
  artist: string
  duration: string
  uri: string
  previewUrl?: string
}

export type SpotifyPlaylistData = {
  title: string
  curator: string
  coverUrl: string
  tracks: SpotifyPlaylistTrack[]
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

export function getSpotifyResource(spotifyUrl: string) {
  const match = spotifyUrl.match(
    /open\.spotify\.com\/(?:embed\/)?(playlist|album|track|episode)\/([^/?]+)/
  )
  if (!match) return null
  return { type: match[1], id: match[2] }
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function parseTrack(value: unknown): SpotifyPlaylistTrack | null {
  const track = asRecord(value)
  if (!track) return null

  const title = String(track.title ?? track.name ?? "").trim()
  const uri = String(track.uri ?? "").trim()
  if (!title || !uri) return null

  const preview = asRecord(track.audioPreview)
  const previewUrl = String(preview?.url ?? "").trim()
  const durationMs = Number(track.duration)

  return {
    title,
    artist: String(track.subtitle ?? track.artist ?? "").trim() || "Unknown artist",
    duration: Number.isFinite(durationMs) ? formatDuration(durationMs) : "--:--",
    uri,
    ...(previewUrl ? { previewUrl } : {}),
  }
}

function parseEntity(value: unknown): SpotifyPlaylistData | null {
  const entity = asRecord(value)
  if (!entity) return null

  const title = String(entity.title ?? entity.name ?? "").trim()
  const trackList = Array.isArray(entity.trackList)
    ? entity.trackList
    : Array.isArray(entity.tracks)
      ? entity.tracks
      : []
  const tracks = trackList
    .map(parseTrack)
    .filter((track): track is SpotifyPlaylistTrack => Boolean(track))

  if (!title && tracks.length === 0) return null

  const coverArt = asRecord(entity.coverArt)
  const sources = Array.isArray(coverArt?.sources) ? coverArt.sources : []
  const coverFromSources = sources
    .map((source) => asRecord(source)?.url)
    .find((url): url is string => typeof url === "string" && url.length > 0)

  return {
    title: title || "Playlist",
    curator: String(entity.subtitle ?? "").trim() || "Spotify",
    coverUrl: coverFromSources ?? "",
    tracks,
  }
}

function extractNextData(html: string): unknown {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  )
  if (!match) return null
  try {
    return JSON.parse(match[1]) as unknown
  } catch {
    return null
  }
}

async function fetchEmbedPlaylist(
  type: string,
  id: string
): Promise<SpotifyPlaylistData | null> {
  const response = await fetch(`https://open.spotify.com/embed/${type}/${id}`, {
    headers: {
      Accept: "text/html",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) return null

  const html = await response.text()
  const nextData = extractNextData(html)
  const root = asRecord(nextData)
  const entity =
    asRecord(asRecord(asRecord(asRecord(root?.props)?.pageProps)?.state)?.data)
      ?.entity ?? null

  return parseEntity(entity)
}

async function fetchOembed(spotifyUrl: string): Promise<Partial<SpotifyPlaylistData>> {
  const response = await fetch(
    `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`,
    { next: { revalidate: 3600 } }
  )
  if (!response.ok) return {}

  const data = asRecord(await response.json())
  return {
    title: String(data?.title ?? "").trim(),
    coverUrl: String(data?.thumbnail_url ?? "").trim(),
  }
}

export async function fetchSpotifyPlaylist(
  spotifyUrl: string
): Promise<SpotifyPlaylistData | null> {
  const resource = getSpotifyResource(spotifyUrl)
  if (!resource) return null

  const canonicalUrl = `https://open.spotify.com/${resource.type}/${resource.id}`
  const [embed, oembed] = await Promise.all([
    fetchEmbedPlaylist(resource.type, resource.id),
    fetchOembed(canonicalUrl),
  ])

  if (!embed && !oembed.title && !oembed.coverUrl) return null

  return {
    title: embed?.title || oembed.title || "Playlist",
    curator: embed?.curator || "Spotify",
    coverUrl: embed?.coverUrl || oembed.coverUrl || "",
    tracks: embed?.tracks ?? [],
  }
}
