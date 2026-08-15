import fs from "fs"
import path from "path"

const IMAGE_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png", ".gif"])

/** Encode each path segment so spaces/parentheses work in production URLs. */
export function encodePublicImagePath(src: string): string {
  return (
    "/" +
    src
      .split("/")
      .filter(Boolean)
      .map(encodeURIComponent)
      .join("/")
  )
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
}

function readImagesFromPublicDir(relativeDir: string): string[] {
  const dir = path.join(process.cwd(), "public", relativeDir)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort(naturalSort)
    .map((file) => `/${relativeDir}/${file}`)
}

export type GalleryFolderImages = {
  desktop: string[]
  mobile: string[]
}

/** Gallery list from public/desktop-background and public/mobile-background. */
export async function fetchGalleryImages(): Promise<GalleryFolderImages> {
  return {
    desktop: readImagesFromPublicDir("desktop-background").map(encodePublicImagePath),
    mobile: readImagesFromPublicDir("mobile-background").map(encodePublicImagePath),
  }
}
