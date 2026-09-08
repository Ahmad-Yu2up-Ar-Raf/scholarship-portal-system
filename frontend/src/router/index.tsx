import { createBrowserRouter } from "react-router"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Home } from "@/pages/Home"
import { Daftar } from "@/pages/Daftar"
import { Hasil } from "@/pages/Hasil"
import { Peringkat } from "@/pages/Peringkat"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { BeasiswaCatalog } from "@/pages/BeasiswaCatalog"
import { BeasiswaDetail } from "@/pages/BeasiswaDetail"
import { SEO } from "@/components/seo/SEO"

function NotFound() {
  return (
    <>
      <SEO title="404 — Halaman Tidak Ditemukan" description="Halaman yang Anda cari tidak tersedia di PIJAR BEASISWA." path="/404" noindex />
      <div className="p-10 font-black">404 — Halaman tidak ditemukan</div>
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/beasiswa", element: <BeasiswaCatalog /> },
      { path: "/beasiswa/:slug", element: <BeasiswaDetail /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/daftar", element: <ProtectedRoute><Daftar /></ProtectedRoute> },
      { path: "/peringkat", element: <Peringkat /> },
      { path: "/hasil", element: <Hasil /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])
