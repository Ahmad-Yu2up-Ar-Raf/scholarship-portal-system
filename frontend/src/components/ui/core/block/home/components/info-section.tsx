export function InfoSection() {
  return (
    <section className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="font-head text-xl font-black border-2 border-black bg-primary px-3 py-1 inline-block shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        INFORMASI TAMBAHAN
      </h2>
      <div className="mt-4 columns-1 md:columns-2 gap-6 space-y-4">
        <div className="break-inside-avoid border-2 border-black bg-cyan-300 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="font-black">FAQ — Syarat Umum</div>
          <ul className="text-sm font-medium mt-2 space-y-1 list-disc pl-4 wrap-break-word">
            <li>IPK &lt;3.00 tidak bisa daftar (otomatis terkunci)</li>
            <li>Semester 1–8, S1 regular</li>
            <li>1 akun = 1 pengajuan (cek /daftar jika sudah daftar)</li>
          </ul>
        </div>
        <div className="break-inside-avoid border-2 border-black bg-[#ff6b9d] text-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="font-black">Panduan Berkas</div>
          <p className="text-sm font-medium mt-2 wrap-break-word">
            Transkrip PDF atau ZIP (max 5MB), asal sekolah wajib. Pastikan file
            jelas, tidak blur.
          </p>
        </div>
        <div className="break-inside-avoid border-2 border-black bg-green-300 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="font-black">Timeline Verifikasi</div>
          <p className="text-sm font-medium mt-2 wrap-break-word">
            Hari 1–2: cek kelengkapan • Hari 3–5: verifikasi akademik •
            Pengumuman di /peringkat, status berubah otomatis.
          </p>
        </div>
      </div>
    </section>
  );
}
