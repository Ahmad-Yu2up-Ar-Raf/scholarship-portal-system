"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { playSound, unlockSound } from "@/lib/sound";
import { SEO } from "@/components/seo/SEO";
import {
  JsonLd,
  breadcrumbJsonLd,
  collectionJsonLd,
} from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";

import { useBeasiswaCatalog } from "./hooks/use-beasiswa-catalog";
import { CatalogHeader } from "./components/catalog-header";
import { CatalogFilterBar } from "./components/catalog-filter-bar";
import { ScholarshipCardGrid } from "./components/scholarship-card-grid";

export function MasterBeasiswaCatalogBlock() {
  const {
    query,
    setQuery,
    filter,
    setFilter,
    page,
    setPage,
    items,
    isLoading,
    isError,
    total,
    hasMore,
  } = useBeasiswaCatalog();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-6">
      <SEO
        title="Katalog Beasiswa — Cari & Filter Program IPK ≥3.0"
        description="Jelajahi katalog beasiswa PIJAR — Akademik, Non-Akademik, Olahraga, Seni & Teknologi. Cari, filter, dan daftar langsung. Semua program butuh IPK ≥3.00, verifikasi 3–5 hari."
        path="/beasiswa"
        ogType="website"
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", item: `${SITE_URL}/` },
          { name: "Katalog Beasiswa", item: `${SITE_URL}/beasiswa` },
        ])}
      />
      <JsonLd
        data={collectionJsonLd(
          "Katalog Beasiswa PIJAR",
          `${SITE_URL}/beasiswa`,
          items.map((s) => ({
            name: s.name,
            url: `${SITE_URL}/beasiswa/${s.slug}`,
          })),
        )}
      />
      <div className="border-4 border-black bg-black text-white px-3 py-1 text-xs font-black flex justify-between">
        <span>KATALOG BEASISWA • PIJAR</span>
        <span>{total} Program</span>
      </div>

      <CatalogHeader />
      <CatalogFilterBar
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
      />

      {isLoading && page === 1 && (
        <div className="flex items-center gap-2 font-bold">
          <Spinner /> Memuat katalog dari server...
        </div>
      )}
      {isError && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-black">
          Gagal memuat katalog.
        </div>
      )}
      {!isLoading && items.length === 0 && (
        <div className="border-4 border-black bg-yellow-300 p-6 text-center font-black">
          Tidak ada beasiswa ditemukan.
        </div>
      )}

      <ScholarshipCardGrid items={items} />

      {isLoading && page > 1 && (
        <div className="flex items-center gap-2 font-bold">
          <Spinner /> Memuat lagi...
        </div>
      )}
      {hasMore && !isLoading && (
        <div className="text-center">
          <Button
            onClick={async () => {
              await unlockSound();
              playSound("select");
              setPage((p) => p + 1);
            }}
            className="border-4 border-black bg-primary text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Muat Lebih Banyak ({total - items.length} lagi)
          </Button>
        </div>
      )}
    </div>
  );
}

export { MasterBeasiswaCatalogBlock as BeasiswaCatalog };
