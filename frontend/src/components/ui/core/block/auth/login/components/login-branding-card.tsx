export function LoginBrandingCard() {
  return (
    <div className="bg-primary border-b-4 md:border-b-0 md:border-r-4 border-black p-8 flex flex-col justify-between gap-6">
      <div>
        <div className="font-head text-3xl md:text-4xl font-black uppercase wrap-break-word">
          PIJAR
          <br />
          BEASISWA
        </div>
        <p className="font-medium mt-3 wrap-break-word">
          Satu akun, banyak peluang. Daftar beasiswa kampus dalam hitungan
          menit.
        </p>
      </div>
      <blockquote className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-head font-black wrap-break-word">
          “Pendidikan adalah senjata paling ampuh untuk mengubah dunia.”
        </p>
        <cite className="text-xs font-bold not-italic">— Nelson Mandela</cite>
      </blockquote>
      <div className="flex gap-2 text-xs font-black">
        <span className="border-2 border-black bg-black text-white px-2 py-1">
          GRATIS
        </span>
        <span className="border-2 border-black bg-white px-2 py-1">
          IPK ≥3.0
        </span>
        <span className="border-2 border-black bg-accent px-2 py-1">
          3–5 HARI
        </span>
      </div>
    </div>
  );
}
