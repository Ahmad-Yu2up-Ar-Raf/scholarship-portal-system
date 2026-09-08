import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useBeasiswaPaged } from "@/features/beasiswa/hooks"
import { playSound, unlockSound } from "@/lib/sound"
import gsap from "gsap"
import { SEO } from "@/components/seo/SEO"
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd"
import { SITE_URL } from "@/lib/seo"

const PAGE_SIZE = 5

const RANK_STYLE = [
  "bg-yellow-300",
  "bg-cyan-300",
  "bg-orange-300",
]

export function Peringkat() {
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [page, setPage] = useState(1)
  const podiumRef = useRef<HTMLDivElement>(null)
  const celebrated = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [search])

  const podium = useBeasiswaPaged({ status: "lulus verifikasi", sort: "ipk_desc", per_page: 50 })
  const list = useBeasiswaPaged({ status: "lulus verifikasi", sort: "ipk_desc", search: debounced, page, per_page: PAGE_SIZE })

  const top3 = (podium.data?.data ?? []).slice(0, 3)
  const ordered = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3
  const totalPages = list.data?.meta.last_page ?? 1

  useEffect(() => {
    if (podium.data && podium.data.data.length > 0 && !celebrated.current) {
      celebrated.current = true
      unlockSound()
      playSound("success", { volume: 0.9 })
    }
  }, [podium.data])

  useEffect(() => {
    if (!podiumRef.current || top3.length === 0) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.from(".podium-card", { opacity: 0, y: 32, duration: 0.8, ease: "power3.out", stagger: 0.15, clearProps: "opacity,visibility" })
      gsap.to(".podium-champion", { y: -10, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 })
      gsap.to(".podium-glow", { opacity: 0.5, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.4 })
    }, podiumRef)
    return () => ctx.revert()
  }, [top3.length])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      <SEO
        title="Peringkat Juara — Leaderboard IPK Tertinggi"
        description="Papan peringkat penerima beasiswa PIJAR terverifikasi — podium 3 besar IPK tertinggi dan tabel lengkap penerima lulus verifikasi. Update real-time dari database."
        path="/peringkat"
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", item: `${SITE_URL}/` }, { name: "Peringkat Juara", item: `${SITE_URL}/peringkat` }])} />
      <div className="border-2 border-black bg-black text-white px-3 py-1 text-xs font-black flex justify-between">
        <span>PIJAR • PAPAN PERINGKAT JUARA</span>
        <span className="hidden md:inline">Update: {new Date().toLocaleDateString("id-ID")}</span>
      </div>

      <section className="relative overflow-hidden border-4 border-black bg-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10">
        <div className="podium-glow pointer-events-none absolute -top-10 left-1/4 h-48 w-48 rounded-full bg-yellow-200 opacity-70 blur-2xl" />
        <div className="podium-glow pointer-events-none absolute top-10 right-1/4 h-40 w-40 rounded-full bg-cyan-200 opacity-70 blur-2xl" />
        <div className="relative">
          <Badge className="border-2 border-black bg-black text-white font-black rounded-none">LEADERBOARD • IPK TERTINGGI</Badge>
          <h1 className="font-head text-4xl md:text-6xl font-black uppercase mt-3 break-words">Peringkat Juara</h1>
          <p className="font-medium mt-2 max-w-xl break-words">Tiga pendaftar terverifikasi dengan IPK tertinggi. Terus kejar peringkatmu!</p>
        </div>

        <div ref={podiumRef} className="relative mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {podium.isLoading && (
            <div className="col-span-full flex items-center gap-2 font-bold"><Spinner /> Memuat juara...</div>
          )}
          {ordered.map((row, i) => {
            const rank = top3.length === 3 ? [2, 1, 3][i] : i + 1
            const isChampion = rank === 1
            return (
              <div
                key={row.id}
                className={`podium-card ${isChampion ? "podium-champion md:-mt-8" : ""} border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${RANK_STYLE[rank - 1] ?? "bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-head text-4xl font-black">#{rank}</span>
                  {isChampion && <span className="border-2 border-black bg-black text-white text-xs font-black px-2 py-1">JUARA 1</span>}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {row.photo_url ? (
                    <img src={row.photo_url} alt={row.nama} className="rounded-full h-16 w-16 border-4 border-black object-cover shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0" />
                  ) : (
                    <div className="rounded-full h-16 w-16 border-4 border-black bg-white flex items-center justify-center font-head font-black text-xl shrink-0">{row.nama.charAt(0)}</div>
                  )}
                  <div className="min-w-0">
                    <div className="font-head font-black break-words">{row.nama}</div>
                    <div className="font-head text-2xl font-black">IPK {Number(row.ipk).toFixed(2)}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs font-bold border-2 border-black bg-white inline-block px-2 py-0.5 break-words">Semester {row.semester}</div>
              </div>
            )
          })}
          {!podium.isLoading && top3.length === 0 && (
            <div className="col-span-full border-4 border-black bg-white p-6 text-center font-black">Belum ada juara terverifikasi.</div>
          )}
        </div>
      </section>

      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <CardHeader className="border-b-4 border-black bg-white">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <CardTitle className="font-head font-black text-xl uppercase break-words">Penerima Terverifikasi</CardTitle>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama / sekolah..." className="md:max-w-xs border-4 border-black rounded-none p-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {list.isLoading && <div className="flex items-center gap-2 font-bold"><Spinner /> Memuat data...</div>}
          {list.data && list.data.data.length > 0 && (
            <div className="overflow-x-auto border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-black text-white hover:bg-black">
                    <TableHead className="text-white font-black">#</TableHead>
                    <TableHead className="text-white font-black">Nama</TableHead>
                    <TableHead className="text-white font-black">IPK</TableHead>
                    <TableHead className="text-white font-black">Beasiswa</TableHead>
                    <TableHead className="text-white font-black">Sekolah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.data.data.map((row, idx) => (
                    <TableRow key={row.id} className="border-b-2 border-black">
                      <TableCell className="font-black">{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          {row.photo_url ? (
                            <img src={row.photo_url} alt={row.nama} className="rounded-full h-8 w-8 border-2 border-black object-cover shrink-0" />
                          ) : (
                            <span className="rounded-full h-8 w-8 border-2 border-black bg-primary flex items-center justify-center text-xs font-black shrink-0">{row.nama.charAt(0)}</span>
                          )}
                          <span className="font-bold break-words">{row.nama}</span>
                        </span>
                      </TableCell>
                      <TableCell className="font-black">{Number(row.ipk).toFixed(2)}</TableCell>
                      <TableCell><Badge className="border-2 border-black bg-accent text-black font-bold rounded-none break-words">{row.beasiswa ?? "-"}</Badge></TableCell>
                      <TableCell className="text-xs break-words">{row.asal_sekolah ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!list.isLoading && (list.data?.data.length ?? 0) === 0 && (
            <div className="border-4 border-black border-dashed bg-muted p-8 text-center font-black">Tidak ada data. Coba kata kunci lain.</div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3">
              <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} variant="outline" className="border-2 border-black font-black disabled:opacity-50">← Prev</Button>
              <span className="text-xs font-black border-2 border-black bg-white px-2 py-1">Hal {page} / {totalPages}</span>
              <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} variant="outline" className="border-2 border-black font-black disabled:opacity-50">Next →</Button>
            </div>
          )}
          <div className="text-xs font-mono text-muted-foreground break-words">Total {list.data?.meta.total ?? 0} penerima terverifikasi • Diurutkan IPK tertinggi</div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link to="/daftar" className="inline-block border-4 border-black bg-black text-white font-head font-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Daftar Sekarang →</Link>
      </div>
    </div>
  )
}
