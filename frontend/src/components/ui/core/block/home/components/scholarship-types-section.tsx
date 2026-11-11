"use client";

import { Link } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";
import type { ScholarshipTypeItem } from "../types/home.types";

interface ScholarshipTypesSectionProps {
  types: ScholarshipTypeItem[];
  isLoading: boolean;
  isError: boolean;
}

export function ScholarshipTypesSection({
  types,
  isLoading,
  isError,
}: ScholarshipTypesSectionProps) {
  return (
    <section id="jenis" className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="font-head text-2xl font-black border-2 border-black bg-black text-white px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] wrap-break-word">
          JENIS BEASISWA
        </h2>
        <div className="h-1 bg-black flex-1 hidden sm:block" />
        <Link
          to="/beasiswa"
          className="text-xs font-black border-2 border-black bg-primary px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          Lihat Katalog →
        </Link>
      </div>
      <p className="font-medium text-sm wrap-break-word">
        Top 2 program terlaris berdasarkan jumlah pendaftar — klik Daftar untuk
        pre-select. Semua butuh IPK ≥3.00.
      </p>
      {isLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-48 bg-muted border-4 border-black animate-pulse shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
          <div className="h-48 bg-muted border-4 border-black animate-pulse shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
        </div>
      )}
      {isError && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-black">
          Gagal memuat beasiswa. Cek koneksi.
        </div>
      )}
      {!isLoading && !isError && types.length === 0 && (
        <div className="border-4 border-black bg-yellow-300 p-6 text-center font-black">
          Data Beasiswa Belum Tersedia — hubungi admin.
        </div>
      )}
      {!isLoading && types.length > 0 && (
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {types.map((t) => (
            <Card
              key={t.id}
              className="gsap-card break-inside-avoid border-4 border-black bg-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all mb-6"
              style={{ backgroundColor: t.color_theme ?? undefined }}
            >
              <CardHeader>
                <CardTitle className="font-head text-xl flex items-center gap-2 wrap-break-word">
                  <span className="border-2 border-black bg-black text-white px-2 py-0.5 text-sm shrink-0">
                    {t.id === "akademik" ? "01" : "02"}
                  </span>
                  <span className="wrap-break-word">{t.title}</span>
                </CardTitle>
                <CardDescription className="text-black font-medium wrap-break-word">
                  {t.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-2 border-black bg-white p-3 text-sm font-mono leading-relaxed wrap-break-word">
                  {t.syarat}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-bold bg-white border-2 border-black inline-block px-2 py-1 wrap-break-word">
                    {t.label}
                  </span>
                  <span className="text-xs font-black bg-black text-white border-2 border-black inline-block px-2 py-1">
                    {t.count} pendaftar
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/beasiswa/${t.id}`}
                    onClick={() => playSound("open")}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex-1 border-2 border-black bg-white font-bold",
                    )}
                  >
                    Detail
                  </Link>
                  <Link
                    to={`/daftar?type=${t.id}`}
                    onClick={() => playSound("select")}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "flex-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-black text-white font-black",
                    )}
                  >
                    Daftar →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
