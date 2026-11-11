import { createBrowserRouter } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import DaftarPage from "@/pages/daftar-page"; // <-- Menggunakan page wrapper modular

import PeringkatPage from "@/pages/peringkat-page.tsx";

import { SEO } from "@/components/seo/SEO";
import LoginPage from "@/pages/auth/login-page";
import { MasterRegisterBlock } from "@/components/ui/core/block/auth/register";
import BeasiswaCatalogPages from "@/pages/beasiswa-catalog-page";
import BeasiswaDetailPage from "@/pages/beasiswa-detail-page";
import HomePage from "@/pages/home-page";
import BeasiswaKuPage from "@/pages/beasiswaku-page";

function NotFound() {
  return (
    <>
      <SEO
        title="404 — Halaman Tidak Ditemukan"
        description="Halaman yang Anda cari tidak tersedia di PIJAR BEASISWA."
        path="/404"
        noindex
      />
      <div className="p-10 font-black">404 — Halaman tidak ditemukan</div>
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/beasiswa", element: <BeasiswaCatalogPages /> },
      { path: "/beasiswa/:slug", element: <BeasiswaDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <MasterRegisterBlock /> },
      {
        path: "/daftar",
        element: (
          <ProtectedRoute>
            <DaftarPage />
          </ProtectedRoute>
        ),
      }, // <-- Terlindungi auth & memanggil block modular
      {
        path: "/beasiswa-ku",
        element: (
          <ProtectedRoute>
            <BeasiswaKuPage />
          </ProtectedRoute>
        ),
      },
      { path: "/peringkat", element: <PeringkatPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
