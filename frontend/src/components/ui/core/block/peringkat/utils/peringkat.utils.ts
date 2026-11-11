export const PAGE_SIZE = 5;

export const RANK_STYLE = ["bg-yellow-300", "bg-slate-200", "bg-amber-400"];

export const RANK_BADGE = ["JUARA 1", "PERINGKAT 2", "PERINGKAT 3"];

export function statusPillClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("lulus")) return "bg-green-400 text-black";
  if (s.includes("tolak")) return "bg-red-500 text-white";
  if (s.includes("proses") || s.includes("verifikasi") || s.includes("belum"))
    return "bg-yellow-300 text-black";
  return "bg-white text-black";
}
