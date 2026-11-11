"use client";

import { SEO } from "@/components/seo/SEO";
import { JsonLd, faqJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";

import { useHomeData } from "./hooks/use-home-data";
import { HeroSection } from "./components/hero-section";
import { WorkflowSection } from "./components/workflow-section";
import { ScholarshipTypesSection } from "./components/scholarship-types-section";
import { LeaderboardSection } from "./components/leaderboard-section";
import { GuideSection } from "./components/guide-section";
import { InfoSection } from "./components/info-section";
import { CatalogActionSection } from "./components/catalog-action-section";
import { EligibilityChecker } from "./components/eligibility-checker";
import { TestimonialMarquee } from "./components/testimonial-marquee";
import { FAQ_ITEMS } from "./utils/home.utils";

export function MasterHomeBlock() {
  const {
    heroRef,
    cardsRef,
    scholarships,
    scholarshipsLoading,
    scholarshipsError,
    types,
    stats,
    topRecipients,
  } = useHomeData();

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10"
      ref={heroRef}
    >
      <SEO
        title="PIJAR BEASISWA — Platform Beasiswa Kampus IPK ≥3.0"
        description="PIJAR BEASISWA — Platform beasiswa kampus terpadu. Daftar cepat dengan filter IPK otomatis, katalog lengkap Akademik & Non-Akademik, verifikasi 3–5 hari. IPK <3.0 terkunci, IPK ≥3.0 langsung pilih beasiswa."
        path="/"
        ogType="website"
      />
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PIJAR BEASISWA",
          url: SITE_URL,
          inLanguage: "id-ID",
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/beasiswa?search={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <div className="border-2 border-black bg-black text-white px-3 py-1.5 flex items-center gap-2 text-xs font-bold tracking-widest">
        <span className="bg-primary text-black px-2 py-0.5">KEMDIKBUD RI</span>
        <span className="hidden sm:inline">
          PIJAR • PLATFORM BEASISWA CERDAS
        </span>
        <span className="ml-auto bg-white text-black px-2 py-0.5">
          V 2025/2026
        </span>
      </div>

      <HeroSection stats={stats} topRecipients={topRecipients} />

      <div ref={cardsRef}>
        <WorkflowSection />
      </div>

      <ScholarshipTypesSection
        types={types}
        isLoading={scholarshipsLoading}
        isError={scholarshipsError}
      />
      <LeaderboardSection topRecipients={topRecipients} />
      <GuideSection />
      <InfoSection />
      <CatalogActionSection scholarships={scholarships} />
      <EligibilityChecker />
      <TestimonialMarquee />
    </div>
  );
}

export { MasterHomeBlock as Home };
