"use client";

import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";
import type { Scholarship } from "../types/beasiswa-detail.types";

interface DetailHeroSectionProps {
  scholarship: Scholarship;
}

export function DetailHeroSection({ scholarship }: DetailHeroSectionProps) {
  return (
    <section
      className="detail-pop relative overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-12"
      style={{ backgroundColor: scholarship.color_theme }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 font-head text-[10rem] leading-none font-black opacity-10 select-none hidden md:block">
        ★
      </div>
      <Badge className="border-2 border-black bg-black text-white font-black rounded-none wrap-break-word">
        {scholarship.type_label ?? scholarship.slug}
      </Badge>
      <h1 className="font-head text-4xl md:text-7xl font-black uppercase mt-3 wrap-break-word leading-[0.95]">
        {scholarship.name}
      </h1>
      <p className="font-medium mt-4 max-w-2xl text-lg wrap-break-word">
        {scholarship.description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/daftar?scholarship_id=${scholarship.id}`}
          onClick={() => playSound("select")}
          className={cn(
            buttonVariants({ size: "lg" }),
            "border-4 border-black bg-black text-white font-head font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          )}
        >
          Daftar Sekarang →
        </Link>
        <Link
          to="/beasiswa"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-4 border-black bg-white font-black",
          )}
        >
          ← Katalog
        </Link>
      </div>
    </section>
  );
}
