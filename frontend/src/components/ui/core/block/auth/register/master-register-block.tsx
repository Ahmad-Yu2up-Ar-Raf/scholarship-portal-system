"use client";

import { SEO } from "@/components/seo/SEO";
import { RegisterBrandingCard } from "./components/register-branding-card";
import { RegisterForm } from "./components/register-form";
import { useRegisterForm } from "./hooks/use-register-form";

export function MasterRegisterBlock() {
  const form = useRegisterForm();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <SEO
          title="Daftar Akun — PIJAR BEASISWA"
          description="Buat akun PIJAR BEASISWA gratis. Satu akun bisa daftar banyak beasiswa berbeda, pantau status verifikasi real-time."
          path="/register"
          noindex
        />
        <div className="grid grid-cols-1 md:grid-cols-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <RegisterBrandingCard />
          <RegisterForm form={form} />
        </div>
      </div>
    </div>
  );
}

export { MasterRegisterBlock as Register };
