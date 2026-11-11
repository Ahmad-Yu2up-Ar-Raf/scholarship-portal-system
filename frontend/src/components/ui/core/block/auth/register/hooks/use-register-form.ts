import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppForm } from "@/hooks/use-form";
import { useAuthStore } from "@/store/auth";
import { registerApi } from "@/features/auth/api";
import { playSound, unlockSound } from "@/lib/sound";
import { registerSchema } from "../validations/register.schema";

export function useRegisterForm() {
  const nav = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
    validators: {
      onChange: registerSchema,
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      await unlockSound();
      const p = playSound("processing") as unknown as {
        stop?: () => void;
      } | null;
      try {
        const res = await registerApi(value.name, value.email, value.password, value.confirm);
        p?.stop?.();
        playSound("success");
        setAuth(res.user, res.token ?? "cookie");
        toast.success("Registrasi berhasil");
        nav("/daftar");
      } catch (err) {
        p?.stop?.();
        playSound("error");
        toast.error("Registrasi gagal", {
          description: err instanceof Error ? err.message : "Error",
        });
      }
    },
  });
}
