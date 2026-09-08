import { Navigate } from "react-router"
import { SEO } from "@/components/seo/SEO"

export function Hasil() {
  return (
    <>
      <SEO title="Hasil — Dialihkan ke Peringkat" description="Halaman hasil telah dipindah ke peringkat juara." path="/hasil" noindex />
      <Navigate to="/peringkat" replace />
    </>
  )
}
