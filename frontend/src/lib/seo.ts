// ponytail: single source for canonical + defaults — no SEO utils duplication
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ?? "https://pijar-beasiswa.example.com"
export const SITE_NAME = "PIJAR BEASISWA"
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`

export function canonical(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${p}`
}

export const DEFAULT_DESCRIPTION =
  "PIJAR BEASISWA — Platform beasiswa kampus terpadu. Daftar cepat dengan filter IPK otomatis, katalog lengkap, verifikasi 3–5 hari. IPK ≥3.0 langsung pilih beasiswa."

type SeoInput = {
  title: string
  description?: string
  path: string
  image?: string
  noindex?: boolean
  ogType?: "website" | "article" | "profile"
}

export function buildTitle(title: string): string {
  return `${title} — ${SITE_NAME}`
}
