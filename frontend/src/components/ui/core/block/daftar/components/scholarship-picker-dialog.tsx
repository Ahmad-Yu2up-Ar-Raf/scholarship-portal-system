"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useScholarships } from "@/features/scholarship/hooks-schoolarship";

interface ScholarshipPickerDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onPick: (slug: string, id: number) => void;
}

export function ScholarshipPickerDialog({
  open,
  onOpenChange,
  onPick,
}: ScholarshipPickerDialogProps) {
  const { data, isLoading } = useScholarships();
  const [q, setQ] = useState("");
  const list = (data ?? []).filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.description.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Pilih Beasiswa"
      description="Cari dan pilih — terhubung live ke database."
    >
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari beasiswa..."
        className="border-4 border-black rounded-none p-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
      />
      {isLoading && (
        <div className="flex items-center gap-2 font-bold">
          <Spinner className="mr-2" /> Memuat...
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-1">
        {list.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.slug, s.id)}
            className="text-left border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 wrap-break-word"
            style={{ backgroundColor: s.color_theme }}
          >
            <div className="font-head font-black wrap-break-word">{s.name}</div>
            <div className="text-xs font-medium wrap-break-word mt-1 text-black">
              {s.description}
            </div>
            <div className="text-xs font-mono mt-2 border border-black bg-white inline-block px-1.5 py-0.5 wrap-break-word">
              {s.requirements}
            </div>
          </button>
        ))}
        {!isLoading && list.length === 0 && (
          <div className="border-4 border-black bg-yellow-300 p-4 font-black text-center">
            Tidak ditemukan.
          </div>
        )}
      </div>
    </ResponsiveDialog>
  );
}
