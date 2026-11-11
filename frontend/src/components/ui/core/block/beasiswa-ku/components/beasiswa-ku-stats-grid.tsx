interface BeasiswaKuStatsGridProps {
  total: number;
  pending: number;
  verified: number;
  isLoading: boolean;
}

export function BeasiswaKuStatsGrid({
  total,
  pending,
  verified,
  isLoading,
}: BeasiswaKuStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-xs font-black uppercase tracking-wide">
          Total pengajuan
        </div>
        <div className="font-head text-3xl font-black">
          {isLoading ? "…" : total}
        </div>
      </div>
      <div className="border-2 border-black bg-yellow-300 p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-xs font-black uppercase tracking-wide">
          Menunggu verifikasi
        </div>
        <div className="font-head text-3xl font-black">
          {isLoading ? "…" : pending}
        </div>
      </div>
      <div className="border-2 border-black bg-green-300 p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-xs font-black uppercase tracking-wide">
          Terverifikasi
        </div>
        <div className="font-head text-3xl font-black">
          {isLoading ? "…" : verified}
        </div>
      </div>
    </div>
  );
}
