"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SEO } from "@/components/seo/SEO";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";
import type { BeasiswaSubmission } from "./types/peringkat.types";
import { PAGE_SIZE } from "./utils/peringkat.utils";
import { usePeringkatQueries } from "./hooks/use-peringkat-queries";
import { PodiumSection } from "./components/podium-section";
import { LeaderboardTable } from "./components/leaderboard-table";
import { ApplicantDetailDialog } from "./components/applicant-detail-dialog";

export function MasterPeringkatBlock() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<BeasiswaSubmission | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { podiumData, isPodiumLoading, listData, meta, isListLoading } =
    usePeringkatQueries(debounced, page, PAGE_SIZE);

  const top3 = podiumData.slice(0, 3);
  const totalPages = meta?.last_page ?? 1;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      <SEO
        title="Peringkat Juara — Leaderboard IPK Tertinggi"
        description="Papan peringkat penerima beasiswa PIJAR terverifikasi — podium 3 besar IPK tertinggi dan tabel lengkap penerima lulus verifikasi. Update real-time dari database."
        path="/peringkat"
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", item: `${SITE_URL}/` },
          { name: "Peringkat Juara", item: `${SITE_URL}/peringkat` },
        ])}
      />
      <div className="border-2 border-black bg-black text-white px-3 py-1 text-xs font-black flex justify-between">
        <span>PIJAR • PAPAN PERINGKAT JUARA</span>
        <span className="hidden md:inline">
          Update: {new Date().toLocaleDateString("id-ID")}
        </span>
      </div>

      <PodiumSection
        top3={top3}
        isLoading={isPodiumLoading}
        onSelectApplicant={setSelected}
      />

      <LeaderboardTable
        search={search}
        onSearchChange={setSearch}
        list={listData}
        isLoading={isListLoading}
        totalCount={meta?.total ?? 0}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSelectApplicant={setSelected}
      />

      <div>
        <Link
          to="/daftar"
          className="block w-full text-center border-4 border-black bg-black text-white font-head font-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          Daftar Sekarang →
        </Link>
      </div>

      <ApplicantDetailDialog
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export { MasterPeringkatBlock as Peringkat };
