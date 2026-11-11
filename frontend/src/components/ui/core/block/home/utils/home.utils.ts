export const WORKFLOW_STEPS = [
  {
    n: "01",
    t: "Cek Syarat IPK",
    d: "Pastikan IPK ≥3.00. Sistem cek otomatis. Jika <3.00, form terkunci.",
    c: "bg-primary",
  },
  {
    n: "02",
    t: "Isi Form",
    d: "Nama, Email, HP, Semester. Pilih Akademik / Non-Akademik.",
    c: "bg-cyan-300",
  },
  {
    n: "03",
    t: "Unggah Berkas",
    d: "Transkrip PDF/ZIP, Max 5MB.",
    c: "bg-[#ff6b9d] text-white",
  },
  {
    n: "04",
    t: "Verifikasi",
    d: "Status 'belum di verifikasi' → 'lulus' / 'ditolak' di Beasiswa-Ku.",
    c: "bg-green-300",
  },
];

export const HOW_TO_APPLY_STEPS = [
  {
    n: "1",
    t: "Buat Akun",
    d: "Daftar gratis di /register. Satu akun untuk semua program.",
    c: "bg-primary",
  },
  {
    n: "2",
    t: "Pilih Beasiswa",
    d: "Jelajahi katalog, buka detail, klik Daftar Sekarang.",
    c: "bg-cyan-300",
  },
  {
    n: "3",
    t: "Unggah Berkas",
    d: "Transkrip PDF/ZIP + alasan yang kuat.",
    c: "bg-[#ff6b9d] text-white",
  },
  {
    n: "4",
    t: "Pantau Beasiswa-Ku",
    d: "Cek status di Beasiswa-Ku. Naik ke podium juara!",
    c: "bg-green-300",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Apa syarat IPK untuk daftar beasiswa?",
    a: "IPK minimal 3.00. Sistem mengunci otomatis pilihan beasiswa, upload berkas, dan tombol Simpan jika IPK di bawah 3.00.",
  },
  {
    q: "Semester berapa yang bisa mendaftar?",
    a: "Semester 1–8, program S1 reguler. Satu akun bisa mendaftar banyak beasiswa berbeda, tapi tidak bisa dua kali beasiswa yang sama.",
  },
  {
    q: "Berkas apa yang harus diunggah?",
    a: "Transkrip nilai PDF atau ZIP maksimal 5MB, plus asal sekolah dan catatan minimal 20 karakter.",
  },
];
