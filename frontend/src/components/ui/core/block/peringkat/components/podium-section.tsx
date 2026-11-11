"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import gsap from "gsap";
import type { BeasiswaSubmission } from "../types/peringkat.types";

interface PodiumSectionProps {
  top3: BeasiswaSubmission[];
  isLoading: boolean;
  onSelectApplicant: (row: BeasiswaSubmission) => void;
}

export function PodiumSection({
  top3,
  isLoading,
  onSelectApplicant,
}: PodiumSectionProps) {
  const podiumRef = useRef<HTMLDivElement>(null);

  // Susunan visual tangga podium 2 - 1 - 3: [Juara 2 di kiri, Juara 1 di tengah, Juara 3 di kanan]
  const ordered = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  useEffect(() => {
    if (!podiumRef.current || top3.length === 0) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".podium-column", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        clearProps: "opacity,visibility",
      });
      gsap.to(".podium-float", {
        y: -6,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.25,
      });
    }, podiumRef);
    return () => ctx.revert();
  }, [top3.length]);

  return (
    <section className="relative overflow-hidden border-4 border-black bg-primary shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6 md:p-12 space-y-8">
      {/* Dekorasi Background Brutalism Geometric Glow */}
      <div className="absolute -top-12 -left-12 h-60 w-60 rounded-full bg-cyan-300 border-4 border-black opacity-60 pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 h-60 w-60 rounded-full bg-pink-400 border-4 border-black opacity-60 pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8">
        <Badge className="border-2 border-black bg-black text-white font-black px-4 py-1.5 rounded-none uppercase tracking-widest text-xs shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          ★ PODIUM KEHORMATAN AKADEMIK ★
        </Badge>
        <h2 className="font-head text-4xl md:text-6xl font-black uppercase mt-3 tracking-tight text-black wrap-break-word">
          Peringkat Juara Utama
        </h2>
        <p className="font-bold text-sm md:text-base mt-2 text-black/90 wrap-break-word">
          Tiga insan akademik terbaik dengan pencapaian IPK tertinggi. Ketuk
          kartu untuk melihat detail pendaftar!
        </p>
      </div>

      <div
        ref={podiumRef}
        className="relative z-10 flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 max-w-4xl mx-auto pt-10"
      >
        {isLoading && (
          <div className="flex items-center justify-center gap-2 font-black py-12 w-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Spinner /> Memuat podium juara...
          </div>
        )}

        {!isLoading &&
          ordered.map((row, index) => {
            const rank = top3.length === 3 ? [2, 1, 3][index] : index + 1;
            const isChampion = rank === 1;

            // Konfigurasi visual: Juara 1 dibuat sedikit lebih menonjol & megah (elevated)
            const themeConfig = {
              1: {
                cardBg: "bg-yellow-300",
                podiumBg: "bg-amber-400",
                badgeText: "👑 JUARA 1 UTAMA",
                badgeBg: "bg-black text-yellow-300",
                heightClass: "h-32 md:h-40",
                orderClass: "order-1 md:order-2",
                scaleEffect: "md:-translate-y-4",
              },
              2: {
                cardBg: "bg-cyan-200",
                podiumBg: "bg-cyan-300",
                badgeText: "🥈 RANK 2",
                badgeBg: "bg-black text-white",
                heightClass: "h-24 md:h-30",
                orderClass: "order-2 md:order-1",
                scaleEffect: "",
              },
              3: {
                cardBg: "bg-orange-200",
                podiumBg: "bg-orange-300",
                badgeText: "🥉 RANK 3",
                badgeBg: "bg-black text-white",
                heightClass: "h-20 md:h-24",
                orderClass: "order-3 md:order-3",
                scaleEffect: "",
              },
            }[rank] ?? {
              cardBg: "bg-white",
              podiumBg: "bg-slate-100",
              badgeText: `RANK ${rank}`,
              badgeBg: "bg-black text-white",
              heightClass: "h-24",
              orderClass: "order-3",
              scaleEffect: "",
            };

            return (
              <div
                key={row.id}
                className={`${themeConfig.orderClass} ${themeConfig.scaleEffect} podium-column flex-1 w-full flex flex-col items-stretch min-w-0 transition-transform`}
              >
                {/* Kartu Profil Pendaftar dengan Floating Avatar & Desain Premium Brutalism */}
                <button
                  type="button"
                  onClick={() => onSelectApplicant(row)}
                  className={`podium-float text-left border-4 border-black p-5 pt-8 ${themeConfig.cardBg} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer relative z-20 flex flex-col items-center text-center group`}
                >
                  {/* Floating Avatar Lingkaran di atas kartu dengan ikon mahkota untuk Juara 1 */}
                  <div className="absolute -top-7 h-14 w-14 rounded-full border-4 border-black bg-black text-white flex items-center justify-center font-head font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform">
                    {isChampion ? "👑" : row.nama.charAt(0).toUpperCase()}
                  </div>

                  <div className="w-full">
                    <span
                      className={`border-2 border-black text-[10px] md:text-xs font-black px-2.5 py-0.5 uppercase tracking-wider ${themeConfig.badgeBg} inline-block mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                    >
                      {themeConfig.badgeText}
                    </span>
                    <div className="font-head font-black text-lg md:text-xl truncate px-1 text-black">
                      {row.nama}
                    </div>
                    <div className="font-head text-2xl md:text-3xl font-black text-black mt-1">
                      IPK {Number(row.ipk).toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-black/30 w-full flex items-center justify-between gap-2 text-xs font-bold">
                    <span className="border-2 border-black bg-white px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      Sem. {row.semester}
                    </span>
                    <span className="border-2 border-black bg-green-400 text-black px-2.5 py-1 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                      ✓ LULUS
                    </span>
                  </div>
                </button>

                {/* Balok Tangga Podium yang Megah & Rapih */}
                <div
                  className={`border-4 border-t-0 border-black ${themeConfig.podiumBg} ${themeConfig.heightClass} flex flex-col items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden`}
                >
                  <div className="absolute inset-x-0 top-3 border-t-2 border-black/25" />
                  <div className="absolute inset-x-0 top-8 border-t-2 border-black/25" />

                  <span className="font-head font-black text-6xl md:text-7xl text-black/20 select-none leading-none">
                    {rank}
                  </span>
                  <span className="font-head font-black text-xs md:text-sm uppercase tracking-widest bg-black text-white px-3 py-1 border-2 border-black mt-2 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                    {isChampion ? "SANG JUARA 🏆" : `PERINGKAT ${rank}`}
                  </span>
                </div>
              </div>
            );
          })}

        {!isLoading && top3.length === 0 && (
          <div className="border-4 border-black bg-white p-8 text-center font-black w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            Belum ada data juara terverifikasi di database.
          </div>
        )}
      </div>
    </section>
  );
}
