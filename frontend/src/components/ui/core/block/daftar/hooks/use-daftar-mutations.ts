import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useCreateBeasiswa } from "@/features/beasiswa/hooks";
import { playSound, unlockSound } from "@/lib/sound";

export function useDaftarMutations() {
  const navigate = useNavigate();
  const createMutation = useCreateBeasiswa();

  const submitApplication = async (
    fd: FormData,
    isEligible: boolean,
    isDuplicate: boolean,
  ) => {
    await unlockSound();
    if (!isEligible) {
      playSound("blocked", { volume: 0.8 });
      toast.error("IPK di bawah 3.00", {
        description: "Tidak memenuhi syarat beasiswa.",
      });
      return false;
    }
    if (isDuplicate) {
      playSound("blocked");
      toast.error("Sudah terdaftar", {
        description: "Anda sudah terdaftar pada beasiswa ini.",
      });
      return false;
    }

    const processing = playSound("processing", { volume: 0.5 }) as unknown as {
      stop?: () => void;
    } | null;
    try {
      await createMutation.mutateAsync(fd);
      processing?.stop?.();
      playSound("success", { volume: 0.9 });
      toast.success("Pendaftaran berhasil", {
        description: 'Status: "belum di verifikasi" — cek di Beasiswa-Ku.',
      });
      navigate("/beasiswa-ku");
      return true;
    } catch (e) {
      processing?.stop?.();
      playSound("error");
      const msg = e instanceof Error ? e.message : "Gagal menyimpan";
      toast.error("Gagal", { description: msg });
      return false;
    }
  };

  return {
    submitApplication,
    isPending: createMutation.isPending,
  };
}
