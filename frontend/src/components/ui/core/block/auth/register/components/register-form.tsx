"use client";

import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { useRegisterForm } from "../hooks/use-register-form";

interface RegisterFormProps {
  form: ReturnType<typeof useRegisterForm>;
}

export function RegisterForm({ form }: RegisterFormProps) {
  return (
    <div className="bg-white p-8">
      <h1 className="font-head text-2xl font-black uppercase wrap-break-word">
        Daftar — Pijar
      </h1>
      <p className="text-sm font-medium mt-1 wrap-break-word">
        Buat akun untuk mendaftar. Gratis, 1 akun banyak beasiswa berbeda.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4 mt-6"
        noValidate
      >
        <form.AppField name="name">
          {(field) => (
            <field.Input
              label="Nama *"
              placeholder="Nama lengkap"
            />
          )}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.Input
              label="Email *"
              placeholder="email@kampus.ac.id"
              type="email"
              inputMode="email"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.Input
              label="Password *"
              placeholder="Minimal 8 karakter"
              type="password"
            />
          )}
        </form.AppField>
        <form.AppField name="confirm">
          {(field) => (
            <field.Input
              label="Konfirmasi Password *"
              placeholder="Ulangi password"
              type="password"
            />
          )}
        </form.AppField>
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary text-black font-black"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" /> Memproses...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          )}
        </form.Subscribe>
        <div className="text-sm text-center wrap-break-word">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-black underline">
            Masuk
          </Link>
        </div>
      </form>
    </div>
  );
}
