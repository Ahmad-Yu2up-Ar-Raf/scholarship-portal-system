"use client";

import { WORKFLOW_STEPS } from "../utils/home.utils";

export function WorkflowSection() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <h2 className="font-head text-xl font-black border-2 border-black bg-black text-white px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase wrap-break-word">
          Alur Pendaftaran
        </h2>
        <div className="h-1 bg-black flex-1 hidden sm:block" />
        <span className="text-xs font-bold border-2 border-black bg-primary px-2 py-1">
          3–5 Hari Verifikasi
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {WORKFLOW_STEPS.map((s) => (
          <div
            key={s.n}
            className={`gsap-timeline border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${s.c}`}
          >
            <div className="font-head text-3xl font-black">{s.n}</div>
            <div className="font-bold text-sm mt-1 wrap-break-word">{s.t}</div>
            <div className="text-xs font-medium mt-1 wrap-break-word">
              {s.d}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
