import { Link, useParams } from "react-router"
import { useScholarships } from "@/features/scholarship/hooks"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { SEO } from "@/components/seo/SEO"
import { JsonLd, breadcrumbJsonLd, scholarshipJsonLd } from "@/components/seo/JsonLd"
import { SITE_URL, canonical } from "@/lib/seo"

export function BeasiswaDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useScholarships()
  const scholarship = data?.find((s) => s.slug === slug)

  if (isLoading) return <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12"><div className="flex gap-2 font-bold"><Spinner /> Memuat...</div></div>
  if (!scholarship) return <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12"><div className="border-4 border-black bg-red-500 text-white p-6 font-black">Beasiswa tidak ditemukan: {slug}</div><Link to="/beasiswa" className="underline font-bold">Kembali ke katalog</Link></div>

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-6">
      <SEO
        title={`${scholarship.name} — Beasiswa ${scholarship.type_label ?? scholarship.type ?? ""}`.trim()}
        description={scholarship.description.slice(0, 155)}
        path={`/beasiswa/${scholarship.slug}`}
        ogType="article"
      />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Beranda", item: `${SITE_URL}/` },
            { name: "Katalog Beasiswa", item: `${SITE_URL}/beasiswa` },
            { name: scholarship.name, item: canonical(`/beasiswa/${scholarship.slug}`) },
          ]),
          scholarshipJsonLd({
            name: scholarship.name,
            slug: scholarship.slug,
            description: scholarship.description,
            requirements: scholarship.requirements,
            url: canonical(`/beasiswa/${scholarship.slug}`),
          }),
        ]}
      />
      <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10" style={{ backgroundColor: scholarship.color_theme }}>
        <Badge className="border-2 border-black bg-black text-white font-black">{scholarship.slug}</Badge>
        <h1 className="font-head text-4xl md:text-6xl font-black uppercase mt-3 break-words">{scholarship.name}</h1>
        <p className="font-medium mt-3 max-w-2xl break-words">{scholarship.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to={`/daftar?scholarship_id=${scholarship.id}`} className={cn(buttonVariants({ size: "lg" }), "border-2 border-black bg-black text-white font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]")}>Daftar Sekarang →</Link>
          <Link to="/beasiswa" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-2 border-black bg-white font-bold")}>Katalog</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader><CardTitle className="font-black break-words">Syarat & Ketentuan</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {scholarship.requirements.split("•").map((r) => r.trim()).filter(Boolean).map((r) => (
              <div key={r} className="flex items-start gap-2 border-2 border-black bg-white p-2">
                <span className="border-2 border-black bg-green-300 font-black text-xs px-1.5 py-0.5 shrink-0">✓</span>
                <span className="text-sm font-medium break-words">{r}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none bg-cyan-300">
          <CardHeader><CardTitle className="font-black break-words">Dokumen Wajib</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm font-medium break-words">
            <div className="border-2 border-black bg-white p-2 break-words">Transkrip nilai (PDF/ZIP, max 5MB)</div>
            <div className="border-2 border-black bg-white p-2 break-words">Foto profil (JPG/PNG, max 2MB)</div>
            <div className="border-2 border-black bg-white p-2 break-words">Asal sekolah + alasan (min 20 karakter)</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-4 border-black bg-green-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none p-6 text-center">
        <div className="font-head text-2xl font-black uppercase">Siap Daftar?</div>
        <p className="font-medium mt-2 break-words">Pastikan IPK ≥3.00, siapkan berkas PDF/ZIP dan foto.</p>
        <Link to={`/daftar?scholarship_id=${scholarship.id}`} className={cn(buttonVariants({ size: "lg" }), "mt-4 border-2 border-black bg-black text-white font-black")}>Daftar untuk {scholarship.name} →</Link>
      </Card>
    </div>
  )
}
