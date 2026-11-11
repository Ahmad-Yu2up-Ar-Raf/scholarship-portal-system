"use client";

import { Link } from "react-router";
import type { BeasiswaSubmission } from "../types/home.types";

interface LeaderboardSectionProps {
  topRecipients: BeasiswaSubmission[];
}

export function LeaderboardSection({ topRecipients }: LeaderboardSectionProps) {
  const top3 = topRecipients.slice(0, 3);
  // Urutan visual podium 2-1-3: [Juara 2 di kiri, Juara 1 di tengah, Juara 3 di kanan]
  const ordered = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <section className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between border-b-4 border-black pb-4">
        <div>
          <span className="bg-yellow-300 border-2 border-black px-2.5 py-1 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block mb-2">
            🏆 PODIUM IPK TERTINGGI
          </span>
          <h2 className="font-head text-2xl md:text-4xl font-black uppercase tracking-tight">
            Peringkat Juara Utama
          </h2>
          <p className="text-xs md:text-sm font-medium text-muted-foreground mt-1">
            Tiga insan akademik terbaik dengan pencapaian IPK tertinggi. Ketuk
            kartu untuk melihat detail pendaftar!
          </p>
        </div>
        <Link
          to="/peringkat"
          className="text-xs font-black border-2 border-black bg-primary px-4 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all shrink-0"
        >
          Lihat Semua Peringkat →
        </Link>
      </div>

      {/* Podium Grid 2 - 1 - 3 */}
      {top3.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 pt-6 max-w-4xl mx-auto">
          {ordered.map((r, index) => {
            const rank = top3.length === 3 ? [2, 1, 3][index] : index + 1;
            const isChampion = rank === 1;

            // Konfigurasi visual proporsional, compact, dan tidak terlalu tinggi
            const config = {
              1: {
                cardBg: "bg-yellow-300",
                podiumBg: "bg-amber-400",
                height: "h-32 md:h-40",
                badge: "👑 JUARA UTAMA",
                order: "order-1 md:order-2",
                ring: "border-black bg-white text-black",
              },
              2: {
                cardBg: "bg-cyan-200",
                podiumBg: "bg-cyan-300",
                height: "h-24 md:h-32",
                badge: "🥈 PERINGKAT 2",
                order: "order-2 md:order-1",
                ring: "border-black bg-white text-black",
              },
              3: {
                cardBg: "bg-orange-200",
                podiumBg: "bg-orange-300",
                height: "h-20 md:h-26",
                badge: "🥉 PERINGKAT 3",
                order: "order-3 md:order-3",
                ring: "border-black bg-white text-black",
              },
            }[rank] || {
              cardBg: "bg-white",
              podiumBg: "bg-slate-100",
              height: "h-24",
              badge: `RANK ${rank}`,
              order: "order-3",
              ring: "border-black bg-white text-black",
            };

            return (
              <div
                key={r.id}
                className={`${config.order} flex flex-col items-stretch w-full group transition-transform duration-200 hover:-translate-y-1`}
              >
                {/* Kartu Profil Pendaftar yang Dinamis & Estetik (Floating Card) */}
                <div
                  className={`border-4 border-black p-4 ${config.cardBg} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-3 relative z-10 flex flex-col items-center text-center space-y-2`}
                >
                  {/* Floating Avatar Badge di atas kartu */}
                  <div className="absolute -top-6 h-12 w-12 rounded-full border-4 border-black bg-black text-white flex items-center justify-center font-head font-black text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
                    {r.nama.charAt(0).toUpperCase()}
                  </div>

                  <div className="pt-4 w-full">
                    <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 border border-black inline-block mb-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.6)]">
                      {config.badge}
                    </span>
                    <div className="font-head font-black text-base truncate px-1">
                      {r.nama}
                    </div>
                    <div className="font-head font-black text-sm text-black/90 mt-0.5">
                      IPK {Number(r.ipk).toFixed(2)}
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t-2 border-black/20 text-xs font-bold">
                      <span className="bg-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Sem. {r.semester}
                      </span>
                      <span className="bg-green-300 border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                        ✓ {r.status_ajuan || "Lulus"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Balok Tangga Podium yang Megah, Rapih & Proporsional */}
                <div
                  className={`border-4 border-black ${config.podiumBg} ${config.height} flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden`}
                >
                  <div className="absolute inset-x-0 top-2 border-t-2 border-black/20" />
                  <span className="font-head text-6xl md:text-7xl font-black text-black/20 select-none leading-none">
                    {rank}
                  </span>
                  <span className="font-head font-black text-[11px] uppercase bg-black text-white px-3 py-1 border-2 border-black mt-2 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)] tracking-wider">
                    {isChampion ? "SANG JUARA" : `PERINGKAT ${rank}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border-4 border-black border-dashed bg-muted p-8 text-center font-black">
          Belum ada juara terverifikasi — jadilah yang pertama!
        </div>
      )}
    </section>
  );
}
