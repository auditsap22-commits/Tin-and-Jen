import { NextRequest, NextResponse } from "next/server"
import { fetchSpotifyPlaylist, getSpotifyResource } from "@/lib/spotify-playlist"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")?.trim() ?? ""

  if (!url || !getSpotifyResource(url)) {
    return NextResponse.json({ error: "Invalid Spotify URL" }, { status: 400 })
  }

  try {
    const playlist = await fetchSpotifyPlaylist(url)
    if (!playlist) {
      return NextResponse.json(
        { error: "Could not load Spotify playlist" },
        { status: 502 }
      )
    }

    return NextResponse.json(playlist)
  } catch (error) {
    console.error("Failed to load Spotify playlist:", error)
    return NextResponse.json(
      { error: "Failed to load Spotify playlist" },
      { status: 502 }
    )
  }
}
