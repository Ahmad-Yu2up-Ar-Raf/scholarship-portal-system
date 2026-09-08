import { Link, useParams } from "react-router"
import { useScholarships } from "@/features/scholarship/hooks"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { playSound } from "@/lib/sound"

export function BeasiswaDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useScholarships()
  const heroRef = useRef<HTMLDivElement>(null)
  const scholarship = data?.find((s) => s.slug === slug)

  useEffect(() => {
    if (!heroRef.current || !scholarship) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.from(".detail-pop", { opacity: 0, y: 24, duration: 0.7, ease: "power3.out", stagger: 0.12, clearProps: "all" })
    }, heroRef)
    return () => ctx.revert()
  }, [scholarship?.id])

  if (isLoading) return <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8"><div className="flex gap-2 font-bold"><Spinner /> Memuat...</div></div>
  if (!scholarship) return <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8"><div className="border-4 border-black bg-red-500 text-white p-6 font-black break-words">Beasiswa tidak ditemukan: {slug}</div><Link to="/beasiswa" className="underline font-bold">Kembali ke katalog</Link></div>

  const checks = scholarship.requirements.split("•").map((r) => r.trim()).filter(Boolean)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8" ref={heroRef}>
      <section className="detail-pop relative overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-12" style={{ backgroundColor: scholarship.color_theme }}>
        <div className="pointer-events-none absolute -right-8 -top-8 font-head text-[10rem] leading-none font-black opacity-10 select-none hidden md:block">★</div>
        <Badge className="border-2 border-black bg-black text-white font-black rounded-none break-words">{scholarship.type_label ?? scholarship.slug}</Badge>
        <h1 className="font-head text-4xl md:text-7xl font-black uppercase mt-3 break-words leading-[0.95]">{scholarship.name}</h1>
        <p className="font-medium mt-4 max-w-2xl text-lg break-words">{scholarship.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/daftar?scholarship_id=${scholarship.id}`} onClick={() => playSound("select")} className={cn(buttonVariants({ size: "lg" }), "border-4 border-black bg-black text-white font-head font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]")}>Daftar Sekarang →</Link>
          <Link to="/beasiswa" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-4 border-black bg-white font-black")}>← Katalog</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:-mt-4">
        <div className="detail-pop rotate-1 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-head text-xl font-black uppercase">Syarat Kelayakan</h2>
          <div className="mt-4 space-y-2">
            {checks.map((r) => (
              <div key={r} className="flex items-start gap-2 border-2 border-black bg-muted p-2">
                <span className="border-2 border-black bg-green-300 font-black text-xs px-1.5 py-0.5 shrink-0">✓</span>
                <span className="text-sm font-medium break-words">{r}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="detail-pop -rotate-1 border-4 border-black bg-cyan-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-head text-xl font-black uppercase">Dokumen Wajib</h2>
          <div className="mt-4 space-y-2 text-sm font-medium">
            <div className="border-2 border-black bg-white p-3 break-words"><b>Transkrip nilai</b> — PDF/ZIP, max 5MB, jelas terbaca</div>
            <div className="border-2 border-black bg-white p-3 break-words"><b>Foto profil</b> — JPG/PNG, max 2MB, formal</div>
            <div className="border-2 border-black bg-white p-3 break-words"><b>Asal sekolah + alasan</b> — min 20 karakter, jujur & spesifik</div>
          </div>
          <div className="mt-4 border-2 border-black bg-black text-white p-3 text-xs font-bold break-words">Verifikasi 3–5 hari kerja • Status awal “belum di verifikasi” • Pantau di /peringkat</div>
        </div>
      </section>

      <div className="sticky bottom-4 z-30 md:static">
        <Link to={`/daftar?scholarship_id=${scholarship.id}`} className={cn(buttonVariants({ size: "lg" }), "w-full md:w-auto inline-flex justify-center border-4 border-black bg-[#ff6b9d] text-white font-head font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]")}>Daftar untuk {scholarship.name} →</Link>
      </div>
    </div>
  )
}
