import { Link, useSearchParams } from "react-router"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useBeasiswaList } from "@/features/beasiswa/hooks"
import { useScholarships } from "@/features/scholarship/hooks"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { playSound } from "@/lib/sound"
import { SEO } from "@/components/seo/SEO"
import { JsonLd, faqJsonLd } from "@/components/seo/JsonLd"
import { SITE_URL } from "@/lib/seo"

export function Home() {
  const { data } = useBeasiswaList()
  const { data: scholarships, isLoading: scholarshipsLoading, isError: scholarshipsError } = useScholarships()
  const [searchParams] = useSearchParams()
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const ranked = [...(scholarships ?? [])].sort((a, b) => (b.beasiswas_count ?? 0) - (a.beasiswas_count ?? 0))
  const types = ranked.slice(0, 2).map((s) => ({ id: s.slug, title: s.name, label: s.name, syarat: s.requirements, desc: s.description, color_theme: s.color_theme, count: s.beasiswas_count ?? 0 }))

  const stats = {
    total: data?.length ?? 0,
    verified: data?.filter((d) => d.status_ajuan === "lulus verifikasi").length ?? 0,
    pending: data?.filter((d) => d.status_ajuan === "belum di verifikasi").length ?? 0,
  }
  const topRecipients = (data ?? []).filter((d) => d.status_ajuan === "lulus verifikasi").slice(0, 3)

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo")
    if (scrollTo) {
      setTimeout(() => document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" }), 100)
    }
  }, [searchParams])

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.from(".gsap-hero", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", stagger: 0.1, clearProps: "all" })
      gsap.from(".gsap-card", { opacity: 0, y: 24, duration: 0.8, ease: "power3.out", stagger: 0.15, delay: 0.3, clearProps: "all" })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!cardsRef.current) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.from(".gsap-timeline", { opacity: 0, x: -20, duration: 0.6, stagger: 0.1, ease: "power2.out", clearProps: "all" })
    }, cardsRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10" ref={heroRef}>
      <SEO
        title="PIJAR BEASISWA — Platform Beasiswa Kampus IPK ≥3.0"
        description="PIJAR BEASISWA — Platform beasiswa kampus terpadu. Daftar cepat dengan filter IPK otomatis, katalog lengkap Akademik & Non-Akademik, verifikasi 3–5 hari. IPK <3.0 terkunci, IPK ≥3.0 langsung pilih beasiswa."
        path="/"
        ogType="website"
      />
      <JsonLd
        data={faqJsonLd([
          { q: "Apa syarat IPK untuk daftar beasiswa?", a: "IPK minimal 3.00. Sistem mengunci otomatis pilihan beasiswa, upload berkas, dan tombol Simpan jika IPK di bawah 3.00." },
          { q: "Semester berapa yang bisa mendaftar?", a: "Semester 1–8, program S1 reguler. Satu akun bisa mendaftar banyak beasiswa berbeda, tapi tidak bisa dua kali beasiswa yang sama." },
          { q: "Berkas apa yang harus diunggah?", a: "Transkrip nilai PDF atau ZIP maksimal 5MB dan foto profil JPG/PNG maksimal 2MB, plus asal sekolah dan catatan minimal 20 karakter." },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PIJAR BEASISWA",
          url: SITE_URL,
          inLanguage: "id-ID",
          potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/beasiswa?search={search_term_string}`, "query-input": "required name=search_term_string" },
        }}
      />
      <div className="border-2 border-black bg-black text-white px-3 py-1.5 flex items-center gap-2 text-xs font-bold tracking-widest">
        <span className="bg-primary text-black px-2 py-0.5">KEMDIKBUD RI</span>
        <span className="hidden sm:inline">PIJAR • PLATFORM BEASISWA CERDAS</span>
        <span className="ml-auto bg-white text-black px-2 py-0.5">V 2025/2026</span>
      </div>

      <section className="gsap-hero border-4 border-black bg-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <Badge className="border-2 border-black bg-white text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">BEASISWA 2025/2026 • GRATIS • IPK ≥3.0</Badge>
            <h1 className="font-head text-4xl md:text-6xl font-black leading-none uppercase break-words">PIJAR<br /><span className="bg-black text-white px-2">BEASISWA</span></h1>
            <p className="text-lg font-medium max-w-xl break-words">Platform beasiswa kampus — daftar cepat, filter IPK otomatis. <b>IPK &lt;3.0 terkunci</b>, <b>IPK ≥3.0 langsung pilih beasiswa</b>. Hasil 3–5 hari.</p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/daftar" onClick={() => playSound("open")} className={cn(buttonVariants({ variant: "default", size: "lg" }), "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black text-white hover:bg-white hover:text-black font-black")}>Daftar Sekarang →</Link>
              <Link to="/peringkat" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white font-bold")}>Lihat Hasil ({stats.total})</Link>
            </div>
            <div className="flex gap-2 text-xs font-bold flex-wrap">
              <span className="border-2 border-black bg-white px-2 py-1">PDF / ZIP ≤5MB</span>
              <span className="border-2 border-black bg-white px-2 py-1">Semester 1–8</span>
              <span className="border-2 border-black bg-accent px-2 py-1">Status: belum di verifikasi</span>
            </div>
          </div>
          <div className="border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full md:w-[360px] shrink-0">
            <div className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2">Statistik Beasiswa</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="border-2 border-black bg-primary p-2"><div className="font-head text-2xl font-black">{stats.total}</div><div className="text-xs font-bold break-words">Pendaftar</div></div>
              <div className="border-2 border-black bg-green-300 p-2"><div className="font-head text-2xl font-black">{stats.verified}</div><div className="text-xs font-bold break-words">Lulus</div></div>
              <div className="border-2 border-black bg-cyan-300 p-2"><div className="font-head text-2xl font-black">{stats.pending}</div><div className="text-xs font-bold break-words">Pending</div></div>
            </div>
            <div className="mt-3 text-xs font-medium bg-muted border-2 border-black p-2 break-words">Total dana: <b>Rp 2,4 M+</b> • Aktif 2025/2026</div>
            {topRecipients.length > 0 && (
              <div className="mt-3 space-y-1">
                <div className="text-xs font-black uppercase">Penerima Teratas</div>
                {topRecipients.map((r) => (
                  <div key={r.id} className="text-xs border border-black bg-white px-2 py-1 flex justify-between gap-2 break-words"><span className="font-bold truncate">{r.nama}</span><span className="font-mono shrink-0">{r.beasiswa}</span></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4" ref={cardsRef}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <h2 className="font-head text-xl font-black border-2 border-black bg-black text-white px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase break-words">Alur Pendaftaran</h2>
          <div className="h-1 bg-black flex-1 hidden sm:block" />
          <span className="text-xs font-bold border-2 border-black bg-primary px-2 py-1">3–5 Hari Verifikasi</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: "01", t: "Cek Syarat IPK", d: "Pastikan IPK ≥3.00. Sistem cek otomatis. Jika <3.00, form terkunci.", c: "bg-primary" },
            { n: "02", t: "Isi Form", d: "Nama, Email, HP, Semester. Pilih Akademik / Non-Akademik.", c: "bg-cyan-300" },
            { n: "03", t: "Unggah Berkas", d: "Transkrip PDF/ZIP, Max 5MB. Foto profil JPG/PNG.", c: "bg-[#ff6b9d] text-white" },
            { n: "04", t: "Verifikasi", d: "Status 'belum di verifikasi' → 'lulus' / 'ditolak' di /peringkat.", c: "bg-green-300" },
          ].map((s) => (
            <div key={s.n} className={`gsap-timeline border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${s.c}`}>
              <div className="font-head text-3xl font-black">{s.n}</div>
              <div className="font-bold text-sm mt-1 break-words">{s.t}</div>
              <div className="text-xs font-medium mt-1 break-words">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="jenis" className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-head text-2xl font-black border-2 border-black bg-black text-white px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] break-words">JENIS BEASISWA</h2>
          <div className="h-1 bg-black flex-1 hidden sm:block" />
          <Link to="/beasiswa" className="text-xs font-black border-2 border-black bg-primary px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Lihat Katalog →</Link>
        </div>
        <p className="font-medium text-sm break-words">Top 2 program terlaris berdasarkan jumlah pendaftar — klik Daftar untuk pre-select. Semua butuh IPK ≥3.00.</p>
        {scholarshipsLoading && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-muted border-4 border-black animate-pulse shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
            <div className="h-48 bg-muted border-4 border-black animate-pulse shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        )}
        {scholarshipsError && <div className="border-4 border-black bg-red-500 text-white p-4 font-black">Gagal memuat beasiswa. Cek koneksi.</div>}
        {!scholarshipsLoading && !scholarshipsError && types.length === 0 && (
          <div className="border-4 border-black bg-yellow-300 p-6 text-center font-black">Data Beasiswa Belum Tersedia — hubungi admin.</div>
        )}
        {!scholarshipsLoading && types.length > 0 && (
          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {types.map((t) => (
              <Card key={t.id} className="gsap-card break-inside-avoid border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all mb-6" style={{ backgroundColor: (t as unknown as { color_theme?: string }).color_theme ?? undefined }}>
                <CardHeader>
                  <CardTitle className="font-head text-xl flex items-center gap-2 break-words">
                    <span className="border-2 border-black bg-black text-white px-2 py-0.5 text-sm shrink-0">{t.id === "akademik" ? "01" : "02"}</span>
                    <span className="break-words">{t.title}</span>
                  </CardTitle>
                  <CardDescription className="text-black font-medium break-words">{t.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-2 border-black bg-white p-3 text-sm font-mono leading-relaxed break-words">{t.syarat}</div>
                  <div className="text-xs font-bold bg-white border-2 border-black inline-block px-2 py-1 break-words">{t.label}</div>
                  <div className="flex gap-2">
                    <Link to={`/beasiswa/${t.id}`} onClick={() => playSound("open")} className={cn(buttonVariants({ variant: "outline" }), "flex-1 border-2 border-black bg-white font-bold")}>Detail</Link>
                    <Link to={`/daftar?type=${t.id}`} onClick={() => playSound("select")} className={cn(buttonVariants({ variant: "default" }), "flex-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-black text-white font-black")}>Daftar →</Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
        <h2 className="font-head text-xl font-black border-2 border-black bg-primary px-3 py-1 inline-block shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">INFORMASI TAMBAHAN</h2>
        <div className="mt-4 columns-1 md:columns-2 gap-6 space-y-4">
          <div className="break-inside-avoid border-2 border-black bg-cyan-300 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="font-black">FAQ — Syarat Umum</div>
            <ul className="text-sm font-medium mt-2 space-y-1 list-disc pl-4 break-words"><li>IPK &lt;3.00 tidak bisa daftar (otomatis terkunci)</li><li>Semester 1–8, S1 regular</li><li>1 akun = 1 pengajuan (cek /daftar jika sudah daftar)</li></ul>
          </div>
          <div className="break-inside-avoid border-2 border-black bg-[#ff6b9d] text-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="font-black">Panduan Berkas</div>
            <p className="text-sm font-medium mt-2 break-words">Transkrip PDF atau ZIP (max 5MB), foto profil JPG/PNG (max 2MB), asal sekolah wajib. Pastikan file jelas, tidak blur.</p>
          </div>
          <div className="break-inside-avoid border-2 border-black bg-green-300 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="font-black">Timeline Verifikasi</div>
            <p className="text-sm font-medium mt-2 break-words">Hari 1–2: cek kelengkapan • Hari 3–5: verifikasi akademik • Pengumuman di /peringkat, status berubah otomatis.</p>
          </div>
        </div>
      </section>

      <section className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="break-words">
          <div className="font-head font-black text-xl uppercase">Lihat Semua Program</div>
          <div className="text-sm font-medium break-words">{(scholarships ?? []).length} program tersedia • Cari & filter di katalog</div>
        </div>
        <Link to="/beasiswa" className={cn(buttonVariants({ variant: "default", size: "lg" }), "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary text-black font-black hover:bg-black hover:text-white shrink-0")}>Buka Katalog →</Link>
      </section>

      <EligibilityChecker />
      <TestimonialMarquee />
    </div>
  )
}

import { useState as useCheckerState } from "react"

function EligibilityChecker() {
  const [ipk, setIpk] = useCheckerState("3.4")
  const [semester, setSemester] = useCheckerState("5")
  const num = parseFloat(ipk.replace(",", "."))
  const sem = parseInt(semester)
  const ok = !isNaN(num) && num >= 3 && sem >= 1 && sem <= 8
  return (
    <section className="border-4 border-black bg-cyan-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="font-head text-xl font-black border-2 border-black bg-black text-white px-3 py-1 inline-block">CEK ELIGIBILITAS CEPAT</h2>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <label className="flex-1 font-bold text-sm">IPK Terakhir
          <input value={ipk} onChange={(e) => setIpk(e.target.value.replace(/[^0-9.,]/g, ""))} placeholder="3.4" className="mt-1 w-full border-4 border-black bg-white p-3 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none" />
        </label>
        <label className="flex-1 font-bold text-sm">Semester
          <input value={semester} onChange={(e) => setSemester(e.target.value.replace(/[^0-9]/g, ""))} placeholder="5" className="mt-1 w-full border-4 border-black bg-white p-3 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none" />
        </label>
        <div className={`flex-1 border-4 border-black p-3 font-head font-black text-center self-end shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${ok ? "bg-green-300" : "bg-red-500 text-white"}`}>
          {ok ? "LAYAK — Gas Daftar!" : "BELUM LAYAK"}
        </div>
      </div>
    </section>
  )
}

function TestimonialMarquee() {
  const items = ["IPK 3.9 Lulus Beasiswa Akademik", "Atlet Nasional Dapat Full Support", "Hafiz 15 Juz Lolos Verifikasi", "Startup Digital Didanai Prototipe"]
  return (
    <section className="overflow-hidden border-4 border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-3">
      <div className="flex gap-8 whitespace-nowrap animate-[marquee_18s_linear_infinite] w-max">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="font-head font-black text-sm border-2 border-white px-3 py-1 shrink-0">★ {t}</span>
        ))}
      </div>
    </section>
  )
}
