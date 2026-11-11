export function TestimonialMarquee() {
  const items = [
    "IPK 3.9 Lulus Beasiswa Akademik",
    "Atlet Nasional Dapat Full Support",
    "Hafiz 15 Juz Lolos Verifikasi",
    "Startup Digital Didanai Prototipe",
  ];
  return (
    <section className="overflow-hidden border-4 border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-3">
      <div className="flex gap-8 whitespace-nowrap animate-[marquee_18s_linear_infinite] w-max">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="font-head font-black text-sm border-2 border-white px-3 py-1 shrink-0"
          >
            ★ {t}
          </span>
        ))}
      </div>
    </section>
  );
}
