export function RegisterBrandingCard() {
  return (
    <div className="bg-accent border-b-4 md:border-b-0 md:border-r-4 border-black p-8 flex flex-col justify-between gap-6 text-black">
      <div>
        <div className="font-head text-3xl md:text-4xl font-black uppercase wrap-break-word">
          GABUNG
          <br />
          PIJAR
        </div>
        <p className="font-medium mt-3 wrap-break-word">
          Buat akun gratis. Daftar banyak beasiswa, pantau status real-time.
        </p>
      </div>
      <blockquote className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-head font-black wrap-break-word">
          “Investasi dalam pengetahuan membayar bunga terbaik.”
        </p>
        <cite className="text-xs font-bold not-italic">
          — Benjamin Franklin
        </cite>
      </blockquote>
      <div className="flex gap-2 text-xs font-black flex-wrap">
        <span className="border-2 border-black bg-black text-white px-2 py-1">
          10 PROGRAM
        </span>
        <span className="border-2 border-black bg-white px-2 py-1">
          PDF/ZIP
        </span>
        <span className="border-2 border-black bg-primary px-2 py-1">
          RP 2,4 M+
        </span>
      </div>
    </div>
  );
}
