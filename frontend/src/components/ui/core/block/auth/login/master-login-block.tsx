"use client";

import { SEO } from "@/components/seo/SEO";
import { LoginBrandingCard } from "./components/login-branding-card";
import { LoginForm } from "./components/login-form";
import { useLoginForm } from "./hooks/use-login-form";

export function MasterLoginBlock() {
  const form = useLoginForm();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <SEO
          title="Masuk — PIJAR BEASISWA"
          description="Masuk ke akun PIJAR BEASISWA untuk mendaftar beasiswa kampus. Satu akun bisa daftar banyak program berbeda."
          path="/login"
          noindex
        />
        <div className="grid grid-cols-1 md:grid-cols-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <LoginBrandingCard />
          <LoginForm form={form} />
        </div>
      </div>
    </div>
  );
}

export { MasterLoginBlock as Login };
