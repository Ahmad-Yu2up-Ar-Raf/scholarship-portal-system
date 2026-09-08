import { Link } from "react-router"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useScholarshipsPaged } from "@/features/scholarship/hooks"
import type { Scholarship } from "@/features/scholarship/api"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { playSound, unlockSound } from "@/lib/sound"
import { SEO } from "@/components/seo/SEO"
import { JsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/components/seo/JsonLd"
import { SITE_URL } from "@/lib/seo"

const PAGE_SIZE = 6

export function BeasiswaCatalog() {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<Scholarship[]>([])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    setPage(1)
    setItems([])
  }, [debounced, filter])

  const { data, isLoading, isError } = useScholarshipsPaged({
    search: debounced || undefined,
    type: filter === "all" ? undefined : filter,
    page,
    per_page: PAGE_SIZE,
  })

  useEffect(() => {
    if (!data) return
    setItems((prev) => (page === 1 ? data.data : [...prev, ...data.data.filter((s) => !prev.some((p) => p.id === s.id))]))
  }, [data])

  const total = data?.meta.total ?? items.length
  const hasMore = items.length < total

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-6">
      <SEO
        title="Katalog Beasiswa — Cari & Filter Program IPK ≥3.0"
        description="Jelajahi katalog beasiswa PIJAR — Akademik, Non-Akademik, Olahraga, Seni & Teknologi. Cari, filter, dan daftar langsung. Semua program butuh IPK ≥3.00, verifikasi 3–5 hari."
        path="/beasiswa"
        ogType="website"
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", item: `${SITE_URL}/` }, { name: "Katalog Beasiswa", item: `${SITE_URL}/beasiswa` }])} />
      <JsonLd
        data={collectionJsonLd(
          "Katalog Beasiswa PIJAR",
          `${SITE_URL}/beasiswa`,
          items.map((s) => ({ name: s.name, url: `${SITE_URL}/beasiswa/${s.slug}` })),
        )}
      />
      <div className="border-4 border-black bg-black text-white px-3 py-1 text-xs font-black flex justify-between">
        <span>KATALOG BEASISWA • PIJAR</span>
        <span>{total} Program</span>
      </div>
      <div className="border-4 border-black bg-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10">
        <h1 className="font-head text-3xl md:text-5xl font-black uppercase break-words">Katalog Beasiswa</h1>
        <p className="font-medium mt-2 break-words">Cari dan filter beasiswa langsung dari database. Semua butuh IPK ≥3.00.</p>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari beasiswa..." className="flex-1 border-4 border-black bg-white p-4 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none" />
          <div className="flex gap-2 flex-wrap">
            {["all", "academic", "non_academic", "sports", "arts", "technology"].map((f) => (
              <Button key={f} onClick={async () => { await unlockSound(); playSound("select"); setFilter(f) }} variant={filter === f ? "default" : "outline"} className="border-2 border-black font-black capitalize break-words">{f === "all" ? "Semua" : f.replace("_", " ")}</Button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && page === 1 && <div className="flex items-center gap-2 font-bold"><Spinner /> Memuat katalog dari server...</div>}
      {isError && <div className="border-4 border-black bg-red-500 text-white p-4 font-black">Gagal memuat katalog.</div>}
      {!isLoading && items.length === 0 && <div className="border-4 border-black bg-yellow-300 p-6 text-center font-black">Tidak ada beasiswa ditemukan.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((s) => (
          <Card key={s.id} className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none" style={{ backgroundColor: s.color_theme }}>
            <CardHeader>
              <CardTitle className="font-head text-xl flex items-center gap-2 break-words">
                <Badge className="border-2 border-black bg-black text-white shrink-0">{s.type_label ?? s.slug}</Badge>
                <span className="break-words">{s.name}</span>
              </CardTitle>
              <CardDescription className="text-black font-medium break-words">{s.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-2 border-black bg-white p-3 text-sm font-mono break-words">{s.requirements}</div>
              <div className="text-xs font-bold">Pendaftar: <span className="border border-black bg-black text-white px-1.5 py-0.5">{s.beasiswas_count ?? 0}</span></div>
              <Link to={`/beasiswa/${s.slug}`} onClick={() => playSound("open")} className={cn("w-full inline-flex justify-center", "border-2 border-black bg-black text-white font-black py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black")}>Lihat Detail →</Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && page > 1 && <div className="flex items-center gap-2 font-bold"><Spinner /> Memuat lagi...</div>}
      {hasMore && !isLoading && (
        <div className="text-center">
          <Button onClick={async () => { await unlockSound(); playSound("select"); setPage((p) => p + 1) }} className="border-4 border-black bg-primary text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Muat Lebih Banyak ({total - items.length} lagi)</Button>
        </div>
      )}
    </div>
  )
}
