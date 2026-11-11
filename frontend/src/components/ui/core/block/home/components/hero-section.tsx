"use client";

import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";
import type { BeasiswaSubmission, HomeStats } from "../types/home.types";

interface HeroSectionProps {
  stats: HomeStats;
  topRecipients: BeasiswaSubmission[];
}

export function HeroSection({ stats, topRecipients }: HeroSectionProps) {
  return (
    <section className="gsap-hero border-4 border-black bg-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <Badge className="border-2 border-black bg-white text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            BEASISWA 2025/2026 • GRATIS • IPK ≥3.0
          </Badge>
          <h1 className="font-head text-4xl md:text-6xl font-black leading-none uppercase wrap-break-word">
            PIJAR
            <br />
            <span className="bg-black text-white px-2">BEASISWA</span>
          </h1>
          <p className="text-lg font-medium max-w-xl wrap-break-word">
            Platform beasiswa kampus — daftar cepat, filter IPK otomatis.{" "}
            <b>IPK &lt;3.0 terkunci</b>, <b>IPK ≥3.0 langsung pilih beasiswa</b>
            . Hasil 3–5 hari.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/daftar"
              onClick={() => playSound("open")}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black text-white hover:bg-white hover:text-black font-black",
              )}
            >
              Daftar Sekarang →
            </Link>
            <Link
              to="/peringkat"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white font-bold",
              )}
            >
              Lihat Hasil ({stats.total})
            </Link>
          </div>
          <div className="flex gap-2 text-xs font-bold flex-wrap">
            <span className="border-2 border-black bg-white px-2 py-1">
              PDF / ZIP ≤5MB
            </span>
            <span className="border-2 border-black bg-white px-2 py-1">
              Semester 1–8
            </span>
            <span className="border-2 border-black bg-accent px-2 py-1">
              Status: belum di verifikasi
            </span>
          </div>
        </div>
        <div className="border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full md:w-[360px] shrink-0">
          <div className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2">
            Statistik Beasiswa
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="border-2 border-black bg-primary p-2">
              <div className="font-head text-2xl font-black">{stats.total}</div>
              <div className="text-xs font-bold wrap-break-word">Pendaftar</div>
            </div>
            <div className="border-2 border-black bg-green-300 p-2">
              <div className="font-head text-2xl font-black">
                {stats.verified}
              </div>
              <div className="text-xs font-bold wrap-break-word">Lulus</div>
            </div>
            <div className="border-2 border-black bg-cyan-300 p-2">
              <div className="font-head text-2xl font-black">
                {stats.pending}
              </div>
              <div className="text-xs font-bold wrap-break-word">Pending</div>
            </div>
          </div>
          <div className="mt-3 text-xs font-medium bg-muted border-2 border-black p-2 wrap-break-word">
            Total dana: <b>Rp 2,4 M+</b> • Aktif 2025/2026
          </div>
          {topRecipients.length > 0 && (
            <div className="mt-3 space-y-1">
              <div className="text-xs font-black uppercase">
                Penerima Teratas
              </div>
              {topRecipients.map((r) => (
                <div
                  key={r.id}
                  className="text-xs border border-black bg-white px-2 py-1 flex justify-between gap-2 wrap-break-word"
                >
                  <span className="font-bold truncate">{r.nama}</span>
                  <span className="font-mono shrink-0">{r.beasiswa}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
