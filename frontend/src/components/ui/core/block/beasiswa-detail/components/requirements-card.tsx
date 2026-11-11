"use client";

import { parseRequirements } from "../utils/beasiswa-detail.utils";

interface RequirementsCardProps {
  requirements: string;
}

export function RequirementsCard({ requirements }: RequirementsCardProps) {
  const checks = parseRequirements(requirements);

  return (
    <div className="detail-pop rotate-1 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="font-head text-xl font-black uppercase">
        Syarat Kelayakan
      </h2>
      <div className="mt-4 space-y-2">
        {checks.map((r) => (
          <div
            key={r}
            className="flex items-start gap-2 border-2 border-black bg-muted p-2"
          >
            <span className="border-2 border-black bg-green-300 font-black text-xs px-1.5 py-0.5 shrink-0">
              ✓
            </span>
            <span className="text-sm font-medium wrap-break-word">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
