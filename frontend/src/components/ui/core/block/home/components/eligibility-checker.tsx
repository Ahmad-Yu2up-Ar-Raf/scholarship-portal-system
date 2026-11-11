"use client";

import { useState } from "react";

export function EligibilityChecker() {
  const [ipk, setIpk] = useState("3.4");
  const [semester, setSemester] = useState("5");
  const num = parseFloat(ipk.replace(",", "."));
  const sem = parseInt(semester);
  const ok = !isNaN(num) && num >= 3 && sem >= 1 && sem <= 8;

  return (
    <section className="border-4 border-black bg-cyan-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="font-head text-xl font-black border-2 border-black bg-black text-white px-3 py-1 inline-block">
        CEK ELIGIBILITAS CEPAT
      </h2>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <label className="flex-1 font-bold text-sm">
          IPK Terakhir
          <input
            value={ipk}
            onChange={(e) => setIpk(e.target.value.replace(/[^0-9.,]/g, ""))}
            placeholder="3.4"
            className="mt-1 w-full border-4 border-black bg-white p-3 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
          />
        </label>
        <label className="flex-1 font-bold text-sm">
          Semester
          <input
            value={semester}
            onChange={(e) => setSemester(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="5"
            className="mt-1 w-full border-4 border-black bg-white p-3 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
          />
        </label>
        <div
          className={`flex-1 border-4 border-black p-3 font-head font-black text-center self-end shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${ok ? "bg-green-300" : "bg-red-500 text-white"}`}
        >
          {ok ? "LAYAK — Gas Daftar!" : "BELUM LAYAK"}
        </div>
      </div>
    </section>
  );
}
