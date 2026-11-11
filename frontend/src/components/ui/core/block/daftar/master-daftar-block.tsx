"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@tanstack/react-store";
import { useSearchParams } from "react-router";
import { useAppForm } from "@/hooks/use-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBeasiswaStore } from "@/store/beasiswa";
import { useAuthStore } from "@/store/auth";
import gsap from "gsap";
import { playSound, unlockSound } from "@/lib/sound";
import { SEO } from "@/components/seo/SEO";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";

import { beasiswaFormSchema } from "./validations/daftar.schema";
import {
  SEMESTER_OPTIONS,
  resolveInitialScholarship,
} from "./utils/daftar.utils";
import { useDaftarQueries } from "./hooks/use-daftar-queries";
import { useDaftarMutations } from "./hooks/use-daftar-mutations";
import { BeasiswaField } from "./components/beasiswa-field";
import { CatatanField } from "./components/catatan-field";
import { ScholarshipPickerDialog } from "./components/scholarship-picker-dialog";

export function MasterDaftarBlock() {
  const [searchParams] = useSearchParams();
  const { ipk, setIpk } = useBeasiswaStore();
  const user = useAuthStore((s) => s.user);

  const { scholarships, myApps } = useDaftarQueries(!!user);
  const { submitApplication, isPending: isCreating } = useDaftarMutations();

  const containerRef = useRef<HTMLDivElement>(null);
  const beasiswaFieldRef = useRef<HTMLDivElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const options = useMemo(
    () =>
      scholarships.map((s) => ({
        value: s.slug,
        label: s.name,
        id: s.id,
        color_theme: s.color_theme,
        description: s.description,
      })),
    [scholarships],
  );

  const initial = resolveInitialScholarship(searchParams, scholarships);

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
      tanggal_lahir: "",
      kota_domisili: "",
      catatan: "",
      berkas: [] as Array<File | string>,
    },
    validators: {
      onChange: beasiswaFormSchema,
      onSubmit: beasiswaFormSchema,
    },
    onSubmit: async ({ value }) => {
      const isDuplicate = myApps.some(
        (a) =>
          a.scholarship_id === value.scholarship_id && value.scholarship_id > 0,
      );

      const fd = new FormData();
      fd.append("nama", value.nama);
      fd.append("email", value.email);
      fd.append("hp", value.hp);
      fd.append("semester", value.semester);
      fd.append("ipk", String(value.ipk));
      fd.append("beasiswa", value.beasiswa);
      fd.append("scholarship_id", String(value.scholarship_id));
      fd.append("asal_sekolah", value.asal_sekolah);
      if (value.tanggal_lahir) fd.append("tanggal_lahir", value.tanggal_lahir);
      if (value.kota_domisili) fd.append("kota_domisili", value.kota_domisili);
      fd.append("catatan", value.catatan);

      const file = value.berkas[0];
      if (file instanceof File) {
        fd.append("berkas", file);
      }

      await submitApplication(fd, isEligible, isDuplicate);
    },
  });

  const liveIpk = useStore(form.store, (s) => s.values.ipk);
  const isSubmitting = useStore(form.baseStore, (s) => s.isSubmitting);
  const isModified = useStore(form.store, (s) => s.isDirty);
  const effectiveIpk =
    typeof liveIpk === "number" && !Number.isNaN(liveIpk) ? liveIpk : ipk;
  const isEligible = effectiveIpk >= 3;

  useEffect(() => {
    form.setFieldValue("ipk", ipk);
  }, [ipk, form]);

  useEffect(() => {
    const resolved = resolveInitialScholarship(searchParams, scholarships);
    if (resolved.slug) {
      form.setFieldValue("beasiswa", resolved.slug);
      form.setFieldValue("scholarship_id", resolved.id);
    }
  }, [searchParams, scholarships, form]);

  useEffect(() => {
    if (user) {
      if (user.name) form.setFieldValue("nama", user.name);
      if (user.email) form.setFieldValue("email", user.email);
    }
  }, [user, form]);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "all",
      });
      gsap.from(".gsap-field", {
        opacity: 0,
        y: 12,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.out",
        delay: 0.2,
        clearProps: "all",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isModified && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isModified, isSubmitting]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12"
    >
      <SEO
        title="Daftar Beasiswa — Form Pendaftaran IPK ≥3.0"
        description="Form pendaftaran beasiswa PIJAR. Filter IPK otomatis ≥3.0, upload berkas PDF/ZIP 5MB, status awal belum di verifikasi."
        path="/daftar"
        noindex
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", item: `${SITE_URL}/` },
          { name: "Daftar Beasiswa", item: `${SITE_URL}/daftar` },
        ])}
      />
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white">
          <CardHeader className="border-b-4 border-black bg-primary">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="border-2 border-black bg-black text-white font-black rounded-none">
                PIJAR BEASISWA
              </Badge>
              <span className="text-xs font-bold">
                Kemdikbud RI • Portal Resmi
              </span>
            </div>
            <CardTitle className="font-head text-2xl font-black uppercase tracking-tight wrap-break-word">
              Form Pendaftaran Beasiswa
            </CardTitle>
            <div className="text-sm font-medium wrap-break-word">
              IPK otomatis dari sistem. Berkas PDF/ZIP (Max 5MB) wajib diunggah.
              Status awal <b>belum di verifikasi</b>.
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="border-4 border-black bg-muted p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest">
                  IPK Sistem (Konstanta)
                </div>
                <div className="font-head text-3xl font-black">
                  {ipk.toFixed(1)}
                </div>
                <div
                  className={`text-xs font-bold px-2 py-1 border-2 border-black inline-block mt-1 ${isEligible ? "bg-green-400" : "bg-red-500 text-white border-red-600"}`}
                >
                  {isEligible ? "ELIGIBLE ≥ 3.0" : "TIDAK MEMENUHI < 3.0"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={async () => {
                    await unlockSound();
                    playSound("select");
                    setIpk(3.4);
                  }}
                  variant={ipk === 3.4 ? "default" : "outline"}
                  className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black"
                >
                  IPK 3.4
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    await unlockSound();
                    playSound("select");
                    setIpk(2.9);
                  }}
                  variant={ipk === 2.9 ? "default" : "outline"}
                  className="border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black"
                >
                  IPK 2.9
                </Button>
              </div>
            </div>

            {!isEligible && (
              <Alert className="border-4 border-black bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
                <AlertTitle className="font-black text-white">
                  IPK di bawah 3.00 — Pendaftaran Terkunci
                </AlertTitle>
                <AlertDescription className="font-bold text-white">
                  Pilihan beasiswa, upload berkas, dan tombol Simpan
                  dinonaktifkan.
                </AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-6"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6 min-w-0">
                  <div className="gsap-field">
                    <form.AppField name="nama">
                      {(field) => (
                        <field.Input
                          label="Nama Lengkap *"
                          placeholder="Nama lengkap sesuai KTP"
                        />
                      )}
                    </form.AppField>
                  </div>
                  <div className="gsap-field">
                    <form.AppField name="email">
                      {(field) => (
                        <field.Input
                          label="Email *"
                          placeholder="email@kampus.ac.id"
                          type="email"
                          inputMode="email"
                        />
                      )}
                    </form.AppField>
                  </div>
                  <div className="gsap-field">
                    <form.AppField name="hp">
                      {(field) => (
                        <field.Input
                          label="Nomor HP * (angka saja)"
                          placeholder="081234567890"
                          inputMode="numeric"
                        />
                      )}
                    </form.AppField>
                  </div>
                  <div className="gsap-field">
                    <form.AppField name="tanggal_lahir">
                      {(field) => (
                        <field.DateInput
                          label="Tanggal Lahir"
                          placeholder="Pilih tanggal lahir"
                        />
                      )}
                    </form.AppField>
                  </div>
                </div>
                <div className="space-y-6 min-w-0">
                  <div className="gsap-field">
                    <form.AppField name="semester">
                      {(field) => (
                        <field.Select
                          label="Semester * (1–8)"
                          options={SEMESTER_OPTIONS}
                          placeholder="Pilih semester"
                        />
                      )}
                    </form.AppField>
                  </div>
                  <div className="gsap-field">
                    <form.AppField name="asal_sekolah">
                      {(field) => (
                        <field.Input
                          label="Asal Sekolah *"
                          placeholder="SMA Negeri 1 Jakarta"
                        />
                      )}
                    </form.AppField>
                  </div>
                  <div className="gsap-field">
                    <form.AppField name="kota_domisili">
                      {(field) => (
                        <field.Input
                          label="Kota Domisili"
                          placeholder="Jakarta"
                        />
                      )}
                    </form.AppField>
                  </div>
                  <div className="gsap-field">
                    <form.AppField name="ipk">
                      {(field) => (
                        <field.Input
                          label="IPK * (0.00 – 4.00)"
                          placeholder="3.40"
                          type="number"
                          min={0}
                          max={4}
                        />
                      )}
                    </form.AppField>
                    <p className="text-xs text-muted-foreground mt-1 wrap-break-word">
                      Diisi otomatis dari SIM Akademik — dapat dikoreksi manual.
                    </p>
                  </div>
                </div>

                <div
                  className="gsap-field md:col-span-2"
                  ref={beasiswaFieldRef}
                >
                  <form.AppField name="beasiswa">
                    {() => (
                      <BeasiswaField
                        options={options}
                        isEligible={isEligible}
                        onOpenPicker={async () => {
                          await unlockSound();
                          playSound("open");
                          setPickerOpen(true);
                        }}
                      />
                    )}
                  </form.AppField>
                  <p className="text-xs text-muted-foreground mt-1 wrap-break-word">
                    Bukan dropdown biasa — klik untuk buka katalog mini dengan
                    pencarian.
                  </p>
                </div>

                <div className="gsap-field md:col-span-2">
                  <form.AppField name="catatan">
                    {() => <CatatanField />}
                  </form.AppField>
                </div>

                <div className="gsap-field md:col-span-2">
                  <form.AppField name="berkas">
                    {(field) => (
                      <field.ImagesUpload
                        label="Upload Berkas * (Transkrip / Sertifikat — PDF/ZIP, Max 5MB)"
                        maxFiles={1}
                        disabled={!isEligible}
                        accept=".pdf,.zip"
                        acceptedTypes={[
                          "application/pdf",
                          "application/zip",
                          "application/x-zip-compressed",
                        ]}
                        helperText="Hanya PDF atau ZIP — maks 5MB per file"
                        maxBytes={5 * 1024 * 1024}
                      />
                    )}
                  </form.AppField>
                  <p className="text-xs font-bold text-black mt-1 wrap-break-word">
                    Hanya PDF atau ZIP — sistem menolak JPG/PNG untuk berkas.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <form.Subscribe selector={(s) => s.isSubmitting}>
                  {(isSubmitting) => {
                    const loading = isSubmitting || isCreating;
                    return (
                      <Button
                        type="submit"
                        disabled={!isEligible || loading}
                        className="flex-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary text-black font-black hover:bg-black hover:text-white disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Spinner className="mr-2" /> Menyimpan...
                          </>
                        ) : (
                          "Daftar"
                        )}
                      </Button>
                    );
                  }}
                </form.Subscribe>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold bg-white"
                >
                  Reset
                </Button>
              </div>
              <div className="text-xs font-mono text-muted-foreground wrap-break-word">
                Saat Daftar, status_ajuan otomatis = &quot;belum di
                verifikasi&quot; dan tampil di Hasil.
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <ScholarshipPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(slug, id) => {
          form.setFieldValue("beasiswa", slug);
          form.setFieldValue("scholarship_id", id);
          setPickerOpen(false);
          playSound("select");
        }}
      />
    </div>
  );
}

export { MasterDaftarBlock as Daftar };
