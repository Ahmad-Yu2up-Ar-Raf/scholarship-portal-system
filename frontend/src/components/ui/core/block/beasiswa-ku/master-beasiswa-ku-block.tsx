"use client";

import { SEO } from "@/components/seo/SEO";
import { useBeasiswaKu } from "./hooks/use-beasiswa-ku";
import { BeasiswaKuHeader } from "./components/beasiswa-ku-header";
import { BeasiswaKuStatsGrid } from "./components/beasiswa-ku-stats-grid";
import { BeasiswaKuTable } from "./components/beasiswa-ku-table";
import { BeasiswaKuFooter } from "./components/beasiswa-ku-footer";

export function MasterBeasiswaKuBlock() {
  const {
    user,
    applications,
    pending,
    verified,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useBeasiswaKu();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      <SEO
        title="Beasiswa-Ku — Riwayat Pendaftaran Beasiswa"
        description="Riwayat lengkap pendaftaran beasiswa akun PIJAR: program, tanggal daftar, semester, IPK, berkas, dan status verifikasi."
        path="/beasiswa-ku"
        noindex
      />

      <div className="border-2 border-black bg-black text-white px-3 py-1 text-xs font-black flex justify-between gap-3">
        <span>PIJAR • RIWAYAT PENDAFTARAN</span>
        <span className="hidden md:inline truncate">{user?.email}</span>
      </div>

      <BeasiswaKuHeader />

      <BeasiswaKuStatsGrid
        total={applications.length}
        pending={pending}
        verified={verified}
        isLoading={isLoading}
      />

      <BeasiswaKuTable
        applications={applications}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetching={isFetching}
        onRefetch={refetch}
      />

      <BeasiswaKuFooter />
    </div>
  );
}

export { MasterBeasiswaKuBlock as BeasiswaKu };
