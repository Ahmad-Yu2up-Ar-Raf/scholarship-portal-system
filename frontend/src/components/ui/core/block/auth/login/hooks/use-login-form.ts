import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppForm } from "@/hooks/use-form";
import { useAuthStore } from "@/store/auth";
import { loginApi } from "@/features/auth/api";
import { playSound, unlockSound } from "@/lib/sound";
import { loginSchema } from "../validations/login.schema";

export function useLoginForm() {
  const nav = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await unlockSound();
      const p = playSound("processing") as unknown as {
        stop?: () => void;
      } | null;
      try {
        const res = await loginApi(value.email, value.password);
        p?.stop?.();
        playSound("success");
        setAuth(res.user, res.token ?? "cookie");
        toast.success("Login berhasil");
        nav("/daftar");
      } catch (err) {
        p?.stop?.();
        playSound("error");
        toast.error("Login gagal", {
          description: err instanceof Error ? err.message : "Error",
        });
      }
    },
  });
}
