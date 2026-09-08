"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { useAppForm } from "@/hooks/use-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { useBeasiswaStore } from "@/store/beasiswa"
import { useCreateBeasiswa, useMyBeasiswa } from "@/features/beasiswa/hooks"
import { useScholarships } from "@/features/scholarship/hooks"
import type { Scholarship } from "@/features/scholarship/api"
import { useAuthStore } from "@/store/auth"
import { z } from "zod"
import gsap from "gsap"
import { playSound, unlockSound } from "@/lib/sound"
import { SEO } from "@/components/seo/SEO"
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd"
import { SITE_URL } from "@/lib/seo"

const SEMESTER_OPTIONS = ["1","2","3","4","5","6","7","8"].map((v) => ({ value: v, label: `Semester ${v}` }))

const beasiswaFormSchema = z.object({
  nama: z.string().trim().min(3, "Minimal 3 karakter").max(100),
  email: z.string().trim().email("Format email tidak valid").max(255),
  hp: z.string().regex(/^[0-9]+$/, "Hanya angka").min(10, "Minimal 10 digit").max(15),
  semester: z.string().min(1, "Pilih semester").refine((v) => ["1","2","3","4","5","6","7","8"].includes(v), "Semester 1–8"),
  ipk: z.number().min(0).max(4),
  beasiswa: z.string().min(1, "Pilih beasiswa"),
  scholarship_id: z.number().min(1, "Pilih beasiswa"),
  catatan: z.string().trim().min(20, "Ceritakan alasanmu (min 20 karakter)").max(2000),
  asal_sekolah: z.string().trim().min(3, "Minimal 3 karakter").max(100),
  photo: z.array(z.union([z.instanceof(File), z.string()])).min(1, "Foto profil wajib diunggah").max(1, "Maks 1 foto"),
  berkas: z.array(z.union([z.instanceof(File), z.string()])).min(1, "Upload berkas wajib").max(1, "Maks 1 berkas"),
})

type PhotoPreviewProps = {
  file: File | string | undefined
  onRemove: () => void
}

function PhotoAvatarPreview({ file, onRemove }: PhotoPreviewProps) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (file instanceof File) {
      const u = URL.createObjectURL(file)
      setUrl(u)
      return () => URL.revokeObjectURL(u)
    }
    setUrl(typeof file === "string" ? file : null)
    return undefined
  }, [file])

  if (!file) return null

  return (
    <div className="flex items-center gap-4 border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {url ? (
        <img src={url} alt="Foto profil" className="rounded-full h-24 w-24 border-4 border-black object-cover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0" />
      ) : (
        <div className="rounded-full h-24 w-24 border-4 border-black bg-muted flex items-center justify-center font-black shrink-0">?</div>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-head text-sm font-black truncate">{file instanceof File ? file.name : String(file).split("/").pop()}</div>
        <div className="text-xs font-bold text-muted-foreground">{file instanceof File ? `${(file.size / 1024).toFixed(1)} KB • Siap diunggah` : "Tersimpan"}</div>
      </div>
      <Button type="button" onClick={onRemove} className="shrink-0 rounded-none border-2 border-black bg-red-500 text-white font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600">Hapus</Button>
    </div>
  )
}

export function Daftar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { ipk, setIpk } = useBeasiswaStore()
  const create = useCreateBeasiswa()
  const user = useAuthStore((s) => s.user)
  const { data: scholarships } = useScholarships()
  const { data: myApps } = useMyBeasiswa(!!user)
  const containerRef = useRef<HTMLDivElement>(null)
  const isEligible = ipk >= 3
  const [pickerOpen, setPickerOpen] = useState(false)

  const options = useMemo(
    () => (scholarships ?? []).map((s: Scholarship) => ({ value: s.slug, label: s.name, id: s.id, color_theme: s.color_theme, description: s.description })),
    [scholarships]
  )

  const resolveInitial = (): { slug: string; id: number } => {
    const sid = searchParams.get("scholarship_id")
    if (sid) {
      const found = (scholarships ?? []).find((s) => String(s.id) === sid)
      if (found) return { slug: found.slug, id: found.id }
    }
    const type = searchParams.get("type")
    if (type) {
      const found = (scholarships ?? []).find((s) => s.slug === type)
      if (found) return { slug: found.slug, id: found.id }
      if (type === "akademik" || type === "non_akademik") {
        const legacy = (scholarships ?? []).find((s) => s.slug.includes(type.split("_")[0]))
        if (legacy) return { slug: legacy.slug, id: legacy.id }
        return { slug: type, id: 0 }
      }
    }
    return { slug: "", id: 0 }
  }

  const initial = resolveInitial()

  const form = useAppForm({
    defaultValues: {
      nama: user?.name ?? "",
      email: user?.email ?? "",
      hp: "",
      semester: "",
      ipk,
      beasiswa: initial.slug,
      scholarship_id: initial.id,
      asal_sekolah: "",
      catatan: "",
      photo: [] as Array<File | string>,
      berkas: [] as Array<File | string>,
    },
    validators: {
      onChange: beasiswaFormSchema,
      onSubmit: beasiswaFormSchema,
    },
    onSubmit: async ({ value }) => {
      await unlockSound()
      if (!isEligible) {
        playSound("blocked", { volume: 0.8 })
        toast.error("IPK di bawah 3.00", { description: "Tidak memenuhi syarat beasiswa." })
        return
      }
      const duplicate = (myApps ?? []).some((a) => a.scholarship_id === value.scholarship_id && value.scholarship_id > 0)
      if (duplicate) {
        playSound("blocked")
        toast.error("Sudah terdaftar", { description: "Anda sudah terdaftar pada beasiswa ini." })
        return
      }
      const fd = new FormData()
      fd.append("nama", value.nama)
      fd.append("email", value.email)
      fd.append("hp", value.hp)
      fd.append("semester", value.semester)
      fd.append("ipk", String(value.ipk))
      fd.append("beasiswa", value.beasiswa)
      fd.append("scholarship_id", String(value.scholarship_id))
      fd.append("asal_sekolah", value.asal_sekolah)
      fd.append("catatan", value.catatan)
      const photo = (value.photo ?? [])[0]
      if (!(photo instanceof File)) { playSound("error"); toast.error("Foto wajib", { description: "Unggah foto profil JPG/PNG." }); return }
      if (photo.size > 2 * 1024 * 1024) { playSound("error"); toast.error("Foto terlalu besar", { description: "Maks 2MB" }); return }
      fd.append("photo", photo)
      const file = value.berkas[0]
      if (!(file instanceof File)) { playSound("error"); toast.error("Berkas wajib", { description: "Unggah transkrip PDF/ZIP." }); return }
      if (file.size > 5 * 1024 * 1024) { playSound("error"); toast.error("Berkas terlalu besar", { description: "Maks 5MB" }); return }
      if (!/\.(pdf|zip)$/i.test(file.name)) { playSound("error"); toast.error("Format tidak valid", { description: "Hanya PDF atau ZIP" }); return }
      fd.append("berkas", file)
      const processing = playSound("processing", { volume: 0.5 }) as unknown as { stop?: () => void } | null
      try {
        await create.mutateAsync(fd)
        processing?.stop?.()
        playSound("success", { volume: 0.9 })
        toast.success("Pendaftaran berhasil", { description: 'Status: "belum di verifikasi" — cek di Hasil.' })
        navigate("/peringkat")
      } catch (e) {
        processing?.stop?.()
        playSound("error")
        const msg = e instanceof Error ? e.message : "Gagal menyimpan"
        toast.error("Gagal", { description: msg })
      }
    },
  })

  useEffect(() => {
    form.setFieldValue("ipk", ipk)
  }, [ipk, form])

  useEffect(() => {
    const sid = searchParams.get("scholarship_id")
    const type = searchParams.get("type")
    if (sid && scholarships) {
      const found = scholarships.find((s) => String(s.id) === sid)
      if (found) {
        form.setFieldValue("beasiswa", found.slug)
        form.setFieldValue("scholarship_id", found.id)
        return
      }
    }
    if (type && scholarships) {
      const found = scholarships.find((s) => s.slug === type)
      if (found) {
        form.setFieldValue("beasiswa", found.slug)
        form.setFieldValue("scholarship_id", found.id)
      }
    }
  }, [searchParams, scholarships, form])

  useEffect(() => {
    if (user) {
      if (user.name) form.setFieldValue("nama", user.name)
      if (user.email) form.setFieldValue("email", user.email)
    }
  }, [user, form])

  useEffect(() => {
    if (!containerRef.current) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, { opacity: 0, y: 20, duration: 0.6, ease: "power3.out", clearProps: "all" })
      gsap.from(".gsap-field", { opacity: 0, y: 12, duration: 0.4, stagger: 0.04, ease: "power2.out", delay: 0.2, clearProps: "all" })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <SEO
        title="Daftar Beasiswa — Form Pendaftaran IPK ≥3.0"
        description="Form pendaftaran beasiswa PIJAR. Filter IPK otomatis ≥3.0, upload berkas PDF/ZIP 5MB + foto JPG/PNG 2MB, status awal belum di verifikasi. Satu akun bisa daftar banyak program."
        path="/daftar"
        noindex
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", item: `${SITE_URL}/` }, { name: "Daftar Beasiswa", item: `${SITE_URL}/daftar` }])} />
      <div className="max-w-3xl mx-auto space-y-6">
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white">
        <CardHeader className="border-b-4 border-black bg-primary">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="border-2 border-black bg-black text-white font-black rounded-none">PIJAR BEASISWA</Badge>
            <span className="text-xs font-bold">Kemdikbud RI • Portal Resmi</span>
          </div>
          <CardTitle className="font-head text-2xl font-black uppercase tracking-tight break-words">Form Pendaftaran Beasiswa</CardTitle>
          <div className="text-sm font-medium break-words">IPK otomatis dari sistem. Berkas PDF/ZIP (Max 5MB) + Foto profil wajib JPG/PNG (Max 2MB). Status awal <b>belum di verifikasi</b>.</div>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="border-4 border-black bg-muted p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest">IPK Sistem (Konstanta)</div>
              <div className="font-head text-3xl font-black">{ipk.toFixed(1)}</div>
              <div className={`text-xs font-bold px-2 py-1 border-2 border-black inline-block mt-1 ${isEligible ? "bg-green-400" : "bg-red-500 text-white border-red-600"}`}>{isEligible ? "ELIGIBLE ≥ 3.0" : "TIDAK MEMENUHI < 3.0"}</div>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={async () => { await unlockSound(); playSound("select"); setIpk(3.4)}} variant={ipk === 3.4 ? "default" : "outline"} className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black">IPK 3.4</Button>
              <Button type="button" onClick={async () => { await unlockSound(); playSound("select"); setIpk(2.9)}} variant={ipk === 2.9 ? "default" : "outline"} className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black">IPK 2.9</Button>
            </div>
          </div>

          {!isEligible && (
            <Alert className="border-4 border-black bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
              <AlertTitle className="font-black text-white">IPK di bawah 3.00 — Pendaftaran Terkunci</AlertTitle>
              <AlertDescription className="font-bold text-white">Pilihan beasiswa, upload berkas, dan tombol Simpan dinonaktifkan sesuai butir 6.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className="space-y-6" noValidate>
            <div className="gsap-field border-4 border-black bg-cyan-300 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <form.AppField name="photo">
                {(field) => {
                  const val = (field.state.value ?? [])[0] as File | string | undefined
                  return (
                    <div className="space-y-2">
                      <span className="font-head text-sm font-black uppercase">Foto Profil * (wajib)</span>
                      {val && <PhotoAvatarPreview file={val} onRemove={() => { field.handleChange([]); field.handleBlur() }} />}
                      <field.ImagesUpload label="" maxFiles={1} disabled={!isEligible} accept="image/*" acceptedTypes={["image/jpeg","image/jpg","image/png"]} />
                    </div>
                  )
                }}
              </form.AppField>
              <p className="text-xs font-bold text-black mt-1 break-words">Wajib: foto formal JPG/PNG max 2MB. Avatar bulat muncul otomatis setelah dipilih.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 min-w-0">
                <div className="gsap-field">
                  <form.AppField name="nama">{(field) => <field.Input label="Nama Lengkap *" placeholder="Nama lengkap sesuai KTP" />}</form.AppField>
                </div>
                <div className="gsap-field">
                  <form.AppField name="email">{(field) => <field.Input label="Email *" placeholder="email@kampus.ac.id" type="email" inputMode="email" />}</form.AppField>
                </div>
                <div className="gsap-field">
                  <form.AppField name="hp">{(field) => <field.Input label="Nomor HP * (angka saja)" placeholder="081234567890" inputMode="numeric" />}</form.AppField>
                </div>
                <div className="gsap-field">
                  <form.AppField name="semester">{(field) => <field.Select label="Semester * (1–8)" options={SEMESTER_OPTIONS} placeholder="Pilih semester" />}</form.AppField>
                </div>
                <div className="gsap-field">
                  <form.AppField name="asal_sekolah">{(field) => <field.Input label="Asal Sekolah *" placeholder="SMA Negeri 1 Jakarta" />}</form.AppField>
                </div>
              </div>
              <div className="space-y-6 min-w-0">
                <div className="gsap-field">
                  <form.AppField name="ipk">{(field) => <field.Input label="IPK (otomatis sistem)" placeholder="IPK" disabled />}</form.AppField>
                  <p className="text-xs text-muted-foreground mt-1 break-words">Diambil dari SIM Akademik — tidak dapat diedit.</p>
                </div>
                <div className="gsap-field">
                  <form.AppField name="beasiswa">
                    {(field) => {
                      const current = options.find((o) => o.value === field.state.value)
                      return (
                        <div className="space-y-2">
                          <span className="text-sm font-bold">Pilihan Beasiswa *</span>
                          <button
                            type="button"
                            id={field.name}
                            disabled={!isEligible}
                            onClick={async () => { await unlockSound(); playSound("open"); setPickerOpen(true) }}
                            aria-invalid={field.state.meta.errors.length > 0}
                            className="w-full border-4 border-black bg-white p-3 text-left font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 break-words"
                          >
                            {current ? (
                              <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-black shrink-0" style={{ backgroundColor: (current as { color_theme?: string }).color_theme ?? "#ffdc58" }} />
                                <span className="break-words">{current.label}</span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground">{isEligible ? "Pilih beasiswa — klik untuk cari" : "Terkunci — IPK < 3.0"}</span>
                            )}
                          </button>
                          {field.state.meta.errors[0] ? <p className="text-xs font-black text-red-600 break-words">⚠ {String((field.state.meta.errors[0] as { message?: string })?.message ?? field.state.meta.errors[0])}</p> : null}
                        </div>
                      )
                    }}
                  </form.AppField>
                  <p className="text-xs text-muted-foreground mt-1 break-words">Bukan dropdown biasa — klik untuk buka katalog mini dengan pencarian.</p>
                </div>
              </div>
              <div className="gsap-field md:col-span-2">
                <form.AppField name="catatan">
                  {(field) => {
                    const val = (field.state.value ?? "") as string
                    const hasErr = field.state.meta.errors.length > 0
                    return (
                      <div className="space-y-2">
                        <label htmlFor={field.name} className="font-head text-sm font-black uppercase">Catatan / Alasan Layak *</label>
                        <textarea
                          id={field.name}
                          value={val}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Ceritakan prestasimu dan kenapa layak menerima beasiswa ini (min 20 karakter)..."
                          rows={4}
                          aria-invalid={hasErr}
                          className="w-full border-4 border-black bg-white p-4 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none outline-none focus:bg-yellow-50 break-words"
                        />
                        {hasErr ? <p className="text-xs font-black text-red-600 break-words">⚠ {String((field.state.meta.errors[0] as { message?: string })?.message ?? field.state.meta.errors[0])}</p> : null}
                      </div>
                    )
                  }}
                </form.AppField>
              </div>
              <div className="gsap-field md:col-span-2">
                <form.AppField name="berkas">{(field) => <field.ImagesUpload label="Upload Berkas * (Transkrip / Sertifikat — PDF/ZIP, Max 5MB)" maxFiles={1} disabled={!isEligible} accept=".pdf,.zip" acceptedTypes={["application/pdf","application/zip","application/x-zip-compressed"]} />}</form.AppField>
                <p className="text-xs font-bold text-black mt-1 break-words">Hanya PDF atau ZIP — sistem menolak JPG/PNG untuk berkas.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => {
                  const loading = isSubmitting || create.isPending
                  return (
                    <Button type="submit" disabled={!isEligible || loading} className="flex-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary text-black font-black hover:bg-black hover:text-white disabled:opacity-50">
                      {loading ? <><Spinner className="mr-2" /> Menyimpan...</> : "Daftar"}
                    </Button>
                  )
                }}
              </form.Subscribe>
              <Button type="button" variant="outline" onClick={() => form.reset()} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold bg-white">Reset</Button>
            </div>
            <div className="text-xs font-mono text-muted-foreground break-words">Saat Daftar, status_ajuan otomatis = &quot;belum di verifikasi&quot; dan tampil di Hasil. 1 akun bisa daftar banyak beasiswa berbeda, tapi tidak bisa 2x beasiswa yang sama.</div>
          </form>
        </CardContent>
      </Card>
      </div>

      <ScholarshipPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(slug, id) => {
          form.setFieldValue("beasiswa", slug)
          form.setFieldValue("scholarship_id", id)
          setPickerOpen(false)
          playSound("select")
        }}
      />
    </div>
  )
}

function ScholarshipPickerDialog({ open, onOpenChange, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; onPick: (slug: string, id: number) => void }) {
  const { data, isLoading } = useScholarships()
  const [q, setQ] = useState("")
  const list = (data ?? []).filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.description.toLowerCase().includes(q.toLowerCase()))

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} title="Pilih Beasiswa" description="Cari dan pilih — terhubung live ke database.">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari beasiswa..." className="border-4 border-black rounded-none p-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
      {isLoading && <div className="flex items-center gap-2 font-bold"><Spinner className="mr-2" /> Memuat...</div>}
      <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-1">
        {list.map((s) => (
          <button key={s.id} type="button" onClick={() => onPick(s.slug, s.id)} className="text-left border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] break-words" style={{ backgroundColor: s.color_theme }}>
            <div className="font-head font-black break-words">{s.name}</div>
            <div className="text-xs font-medium break-words mt-1 text-black">{s.description}</div>
            <div className="text-xs font-mono mt-2 border border-black bg-white inline-block px-1.5 py-0.5 break-words">{s.requirements}</div>
          </button>
        ))}
        {!isLoading && list.length === 0 && <div className="border-4 border-black bg-yellow-300 p-4 font-black text-center">Tidak ditemukan.</div>}
      </div>
    </ResponsiveDialog>
  )
}

