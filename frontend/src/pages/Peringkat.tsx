import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useBeasiswaPaged } from "@/features/beasiswa/hooks"
import type { BeasiswaSubmission } from "@/features/beasiswa/types"
import { unlockSound } from "@/lib/sound"
import gsap from "gsap"
import { SEO } from "@/components/seo/SEO"
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd"
import { SITE_URL } from "@/lib/seo"

const PAGE_SIZE = 5

const RANK_STYLE = [
  "bg-yellow-300",
  "bg-slate-200",
  "bg-amber-400",
]

const RANK_BADGE = ["JUARA 1", "PERINGKAT 2", "PERINGKAT 3"]

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
  const [selected, setSelected] = useState<BeasiswaSubmission | null>(null)
  void celebrated
  void unlockSound

  useEffect(() => {
    if (!podiumRef.current || top3.length === 0) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.from(".podium-card", { opacity: 0, y: 32, duration: 0.8, ease: "power3.out", stagger: 0.15, clearProps: "opacity,visibility" })
      gsap.to(".podium-float-0", { y: -8, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0 })
      gsap.to(".podium-float-1", { y: -12, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.4 })
      gsap.to(".podium-float-2", { y: -8, duration: 2.0, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.8 })
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

        <div ref={podiumRef} className="relative mt-8 flex flex-col md:flex-row items-stretch md:items-end justify-center gap-4 md:gap-8">
          {podium.isLoading && (
            <div className="flex items-center gap-2 font-bold"><Spinner /> Memuat juara...</div>
          )}
          {ordered.map((row, i) => {
            const rank = top3.length === 3 ? [2, 1, 3][i] : i + 1
            const isChampion = rank === 1
            // Anak-tangga staircase: champion tallest center, runner-up left, third right.
            const height = isChampion ? "md:h-80" : rank === 2 ? "md:h-64" : "md:h-52"
            const order = isChampion ? "order-1 md:order-2" : rank === 2 ? "order-2 md:order-1" : "order-3"
            return (
              <div key={row.id} className={`${order} flex-1 flex flex-col min-w-0`}>
                <button
                  type="button"
                  onClick={() => setSelected(row)}
                  className={`podium-card podium-float-${i} ${height} text-left border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full ${RANK_STYLE[rank - 1] ?? "bg-white"}`}
                  style={{ filter: "drop-shadow(0 0 18px rgba(255,220,88,0.45))" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-head text-4xl font-black">#{rank}</span>
                    <span className="flex items-center gap-1 border-2 border-black bg-black text-white text-xs font-black px-2 py-1 shrink-0">
                      {isChampion ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 8l4 4 5-6 5 6 4-4-1.5 10h-15L3 8z" fill="#ffdc58" stroke="#000" strokeWidth="1.5" /></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" fill="#fff" stroke="#000" strokeWidth="1.5" /></svg>
                      )}
                      {RANK_BADGE[rank - 1]}
                    </span>
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
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-xs font-bold border-2 border-black bg-white inline-block px-2 py-0.5 break-words">Semester {row.semester}</span>
                    <span className="text-xs font-black border-2 border-black bg-green-400 inline-block px-2 py-0.5">LULUS</span>
                    {isChampion && (
                      <span className="text-xs font-black border-2 border-black bg-black text-white inline-block px-2 py-0.5">★ IPK TERTINGGI</span>
                    )}
                  </div>
                </button>
                <div className="border-4 border-t-0 border-black bg-black text-white text-center font-head font-black text-2xl py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" aria-hidden="true">
                  {rank}
                </div>
              </div>
            )
          })}
          {!podium.isLoading && top3.length === 0 && (
            <div className="border-4 border-black bg-white p-6 text-center font-black w-full">Belum ada juara terverifikasi.</div>
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
                    <TableRow key={row.id} className="border-b-2 border-black hover:bg-muted/50 cursor-pointer" onClick={() => setSelected(row)}>
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

      <div>
        <Link to="/daftar" className="block w-full text-center border-4 border-black bg-black text-white font-head font-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Daftar Sekarang →</Link>
      </div>

      <ApplicantDetailDialog selected={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function statusPillClass(status: string): string {
  const s = status.toLowerCase()
  if (s.includes("lulus")) return "bg-green-400 text-black"
  if (s.includes("tolak")) return "bg-red-500 text-white"
  if (s.includes("proses") || s.includes("verifikasi") || s.includes("belum")) return "bg-yellow-300 text-black"
  return "bg-white text-black"
}

function ApplicantDetailDialog({ selected, onClose }: { selected: BeasiswaSubmission | null; onClose: () => void }) {
  return (
    <ResponsiveDialog open={!!selected} onOpenChange={(o: boolean) => { if (!o) onClose() }} title={selected?.nama ?? "Detail Pendaftar"} description={`Status: ${selected?.status_ajuan ?? "-"}`}>
      {selected && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 border-4 border-black bg-primary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {selected.photo_url ? (
              <img src={selected.photo_url} alt={`Foto ${selected.nama}`} className="rounded-full h-24 w-24 border-4 border-black object-cover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0" />
            ) : (
              <div className="rounded-full h-24 w-24 border-4 border-black bg-white flex items-center justify-center font-head font-black text-2xl shrink-0">{selected.nama.charAt(0)}</div>
            )}
            <div className="min-w-0">
              <div className="font-head font-black text-lg break-words">{selected.nama}</div>
              <div className="font-head text-3xl font-black">IPK {Number(selected.ipk).toFixed(2)}</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge className={`border-2 border-black font-black rounded-none ${statusPillClass(selected.status_ajuan)}`}>{selected.status_ajuan.toUpperCase()}</Badge>
                <Badge className="border-2 border-black bg-white text-black font-bold rounded-none">Semester {selected.semester}</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <DetailItem label="Email" value={selected.email} />
            <DetailItem label="HP" value={selected.hp} />
            <DetailItem label="Asal Sekolah" value={selected.asal_sekolah ?? "-"} />
            <DetailItem label="Kota Domisili" value={selected.kota_domisili ?? "-"} />
            <DetailItem label="Tanggal Lahir" value={selected.tanggal_lahir ?? "-"} />
            <DetailItem label="Beasiswa" value={selected.beasiswa ?? selected.scholarship?.name ?? "-"} />
            <div className="sm:col-span-2">
              <div className={`border-2 border-black p-2 break-words ${selected.berkas_path ? "bg-green-100" : "bg-red-100"}`}>
                <div className="text-xs font-black uppercase">Dokumen Berkas</div>
                <div className="font-bold">{selected.berkas_path ? "✓ Terlampir — transkrip/sertifikat terverifikasi" : "✗ Belum ada berkas terlampir"}</div>
              </div>
            </div>
            <div className="sm:col-span-2"><DetailItem label="Catatan / Alasan Layak" value={selected.catatan ?? "-"} /></div>
          </div>
        </div>
      )}
    </ResponsiveDialog>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-black bg-white p-2 break-words">
      <div className="text-xs font-black uppercase">{label}</div>
      <div className="font-medium break-words">{value}</div>
    </div>
  )
}

