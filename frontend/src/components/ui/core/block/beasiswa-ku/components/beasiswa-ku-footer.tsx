import { Link } from "react-router";

export function BeasiswaKuFooter() {
  return (
    <div className="border-2 border-black bg-white px-3 py-2 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <span>
        Cek status berkala. Keputusan verifikasi menjadi kewenangan penyeleksi.
      </span>
      <Link
        to="/peringkat"
        className="underline underline-offset-4 font-black hover:bg-primary px-1"
      >
        Lihat Peringkat Juara
      </Link>
    </div>
  );
}
