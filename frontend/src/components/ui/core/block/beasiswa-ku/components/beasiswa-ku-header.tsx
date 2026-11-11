import { Badge } from "@/components/ui/badge";

export function BeasiswaKuHeader() {
  return (
    <section className="border-4 border-black bg-primary p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <Badge className="border-2 border-black bg-black text-white font-black rounded-none">
        BEASISWA-KU
      </Badge>
      <h1 className="font-head text-4xl md:text-6xl font-black uppercase mt-3 wrap-break-word leading-[0.95]">
        Beasiswa-Ku
      </h1>
      <p className="font-medium mt-3 max-w-2xl wrap-break-word">
        Semua pengajuan beasiswa milik akun ini, dari yang masih menunggu
        verifikasi sampai yang sudah diputuskan.
      </p>
    </section>
  );
}
