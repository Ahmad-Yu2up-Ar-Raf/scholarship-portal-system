type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}
    </>
  )
}

// Helpers — ponytail: plain functions, no class hierarchy
export function breadcrumbJsonLd(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  }
}

export function scholarshipJsonLd(s: { name: string; slug: string; description: string; requirements: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram" as const,
    name: s.name,
    url: s.url,
    description: s.description,
    provider: { "@type": "EducationalOrganization", name: "PIJAR BEASISWA", url: "https://pijar-beasiswa.example.com/" },
    programPrerequisites: s.requirements,
    educationalCredentialAwarded: s.name,
    inLanguage: "id-ID",
  }
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

export function collectionJsonLd(name: string, url: string, items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
    isPartOf: { "@id": "https://pijar-beasiswa.example.com/#organization" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: it.url,
      })),
    },
  }
}
