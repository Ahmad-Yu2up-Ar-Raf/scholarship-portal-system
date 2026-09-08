// ponytail: tiny build-time sitemap enhancer — fetches slugs from API if reachable, else keeps static fallback
import { writeFileSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const SITE = (process.env.VITE_SITE_URL ?? "https://pijar-beasiswa.example.com").replace(/\/$/, "")
const API = process.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1"
const STATIC = ["/", "/beasiswa", "/peringkat", "/login", "/register"]
// seeded slugs as fallback when API unreachable at build
const FALLBACK_SLUGS = ["beasiswa-akademik","beasiswa-non-akademik","beasiswa-olahraga","beasiswa-seni-budaya","beasiswa-sains-teknologi"]

async function getSlugs() {
  try {
    const r = await fetch(`${API.replace(/\/$/, "")}/scholarships?per_page=50`, { signal: AbortSignal.timeout(4000) })
    if (!r.ok) throw new Error(String(r.status))
    const j = await r.json()
    const slugs = (j.data ?? []).map((s) => s.slug).filter(Boolean)
    return slugs.length ? slugs : FALLBACK_SLUGS
  } catch { return FALLBACK_SLUGS }
}

const slugs = await getSlugs()
const urls = [
  ...STATIC.map((p) => `  <url><loc>${SITE}${p}</loc><changefreq>${p === "/" ? "daily" : "weekly"}</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`),
  ...slugs.map((s) => `  <url><loc>${SITE}/beasiswa/${s}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`),
]
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`
const out = resolve(import.meta.dirname, "../public/sitemap.xml")
writeFileSync(out, xml, "utf8")
console.log(`[sitemap] wrote ${urls.length} urls → ${out} (slugs: ${slugs.join(", ")})`)
