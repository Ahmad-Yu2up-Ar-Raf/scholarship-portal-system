"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { playSound, unlockSound } from "@/lib/sound";
import { FILTER_OPTIONS } from "../utils/beasiswa-catalog.utils";

interface CatalogFilterBarProps {
  query: string;
  setQuery: (val: string) => void;
  filter: string;
  setFilter: (val: string) => void;
}

export function CatalogFilterBar({
  query,
  setQuery,
  filter,
  setFilter,
}: CatalogFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari beasiswa..."
        className="flex-1 border-4 border-black bg-white p-4 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
      />
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map((f) => (
          <Button
            key={f.id}
            onClick={async () => {
              await unlockSound();
              playSound("select");
              setFilter(f.id);
            }}
            variant={filter === f.id ? "default" : "outline"}
            className="border-2 border-black font-black capitalize wrap-break-word"
          >
            {f.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
