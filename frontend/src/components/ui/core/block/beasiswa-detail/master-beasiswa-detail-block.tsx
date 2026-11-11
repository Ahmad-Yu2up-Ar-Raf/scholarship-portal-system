"use client";

import { Link } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { useBeasiswaDetail } from "./hooks/use-beasiswa-detail";
import { DetailHeroSection } from "./components/detail-hero-section";
import { RequirementsCard } from "./components/requirements-card";
import { DocumentsCard } from "./components/documents-card";
import { StickyActionBanner } from "./components/sticky-action-banner";

export function MasterBeasiswaDetailBlock() {
  const { slug, scholarship, isLoading, heroRef } = useBeasiswaDetail();

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-2 font-bold">
          <Spinner /> Memuat...
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-4">
        <div className="border-4 border-black bg-red-500 text-white p-6 font-black wrap-break-word">
          Beasiswa tidak ditemukan: {slug}
        </div>
        <Link to="/beasiswa" className="underline font-bold">
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8"
      ref={heroRef}
    >
      <DetailHeroSection scholarship={scholarship} />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:-mt-4">
        <RequirementsCard requirements={scholarship.requirements} />
        <DocumentsCard />
      </section>

      <StickyActionBanner
        scholarshipId={scholarship.id}
        scholarshipName={scholarship.name}
      />
    </div>
  );
}

export { MasterBeasiswaDetailBlock as BeasiswaDetail };
