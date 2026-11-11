"use client";

import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { useLoginForm } from "../hooks/use-login-form";

interface LoginFormProps {
  form: ReturnType<typeof useLoginForm>;
}

export function LoginForm({ form }: LoginFormProps) {
  return (
    <div className="bg-white p-8">
      <h1 className="font-head text-2xl font-black uppercase wrap-break-word">
        Masuk — Pijar
      </h1>
      <p className="text-sm font-medium mt-1 wrap-break-word">
        Masuk untuk mendaftar beasiswa. 1 akun bisa banyak beasiswa berbeda.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4 mt-6"
        noValidate
      >
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
              placeholder="password"
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
                "Masuk"
              )}
            </Button>
          )}
        </form.Subscribe>
        <div className="text-sm text-center wrap-break-word">
          Belum punya akun?{" "}
          <Link to="/register" className="font-black underline">
            Daftar
          </Link>
        </div>
      </form>
    </div>
  );
}
