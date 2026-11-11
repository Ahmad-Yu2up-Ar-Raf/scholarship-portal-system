export function DocumentsCard() {
  return (
    <div className="detail-pop -rotate-1 border-4 border-black bg-cyan-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="font-head text-xl font-black uppercase">Dokumen Wajib</h2>
      <div className="mt-4 space-y-2 text-sm font-medium">
        <div className="border-2 border-black bg-white p-3 wrap-break-word">
          <b>Transkrip nilai</b> — PDF/ZIP, max 5MB, jelas terbaca
        </div>
        <div className="border-2 border-black bg-white p-3 wrap-break-word">
          <b>Asal sekolah + alasan</b> — min 20 karakter, jujur & spesifik
        </div>
      </div>
      <div className="mt-4 border-2 border-black bg-black text-white p-3 text-xs font-bold wrap-break-word">
        Verifikasi 3–5 hari kerja • Status awal “belum di verifikasi” • Pantau
        di Beasiswa-Ku
      </div>
    </div>
  );
}
