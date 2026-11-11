"use client";

import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Badge } from "@/components/ui/badge";
import type { BeasiswaSubmission } from "../types/peringkat.types";
import { statusPillClass } from "../utils/peringkat.utils";

interface ApplicantDetailDialogProps {
  selected: BeasiswaSubmission | null;
  onClose: () => void;
}

export function ApplicantDetailDialog({
  selected,
  onClose,
}: ApplicantDetailDialogProps) {
  return (
    <ResponsiveDialog
      open={!!selected}
      onOpenChange={(o: boolean) => {
        if (!o) onClose();
      }}
      title={selected?.nama ?? "Detail Pendaftar"}
      description={`Status: ${selected?.status_ajuan ?? "-"}`}
    >
      {selected && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 border-4 border-black bg-primary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="rounded-full h-24 w-24 border-4 border-black bg-white flex items-center justify-center font-head font-black text-2xl shrink-0">
              {selected.nama.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="font-head font-black text-lg wrap-break-word">
                {selected.nama}
              </div>
              <div className="font-head text-3xl font-black">
                IPK {Number(selected.ipk).toFixed(2)}
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge
                  className={`border-2 border-black font-black rounded-none ${statusPillClass(selected.status_ajuan)}`}
                >
                  {selected.status_ajuan.toUpperCase()}
                </Badge>
                <Badge className="border-2 border-black bg-white text-black font-bold rounded-none">
                  Semester {selected.semester}
                </Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <DetailItem label="Email" value={selected.email} />
            <DetailItem label="HP" value={selected.hp} />
            <DetailItem
              label="Asal Sekolah"
              value={selected.asal_sekolah ?? "-"}
            />
            <DetailItem
              label="Kota Domisili"
              value={selected.kota_domisili ?? "-"}
            />
            <DetailItem
              label="Tanggal Lahir"
              value={selected.tanggal_lahir ?? "-"}
            />
            <DetailItem
              label="Beasiswa"
              value={selected.beasiswa ?? selected.scholarship?.name ?? "-"}
            />
            <div className="sm:col-span-2">
              <div
                className={`border-2 border-black p-2 wrap-break-word ${selected.berkas_path ? "bg-green-100" : "bg-red-100"}`}
              >
                <div className="text-xs font-black uppercase">
                  Dokumen Berkas
                </div>
                <div className="font-bold">
                  {selected.berkas_path
                    ? "✓ Terlampir — transkrip/sertifikat terverifikasi"
                    : "✗ Belum ada berkas terlampir"}
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <DetailItem
                label="Catatan / Alasan Layak"
                value={selected.catatan ?? "-"}
              />
            </div>
          </div>
        </div>
      )}
    </ResponsiveDialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-black bg-white p-2 wrap-break-word">
      <div className="text-xs font-black uppercase">{label}</div>
      <div className="font-medium wrap-break-word">{value}</div>
    </div>
  );
}
