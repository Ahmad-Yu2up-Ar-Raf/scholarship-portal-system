"use client";

import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Scholarship } from "../types/home.types";

interface CatalogActionSectionProps {
  scholarships: Scholarship[] | undefined;
}

export function CatalogActionSection({
  scholarships,
}: CatalogActionSectionProps) {
  return (
    <section className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="wrap-break-word">
        <div className="font-head font-black text-xl uppercase">
          Lihat Semua Program
        </div>
        <div className="text-sm font-medium wrap-break-word">
          {(scholarships ?? []).length} program tersedia • Cari & filter di
          katalog
        </div>
      </div>
      <Link
        to="/beasiswa"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary text-black font-black hover:bg-black hover:text-white shrink-0",
        )}
      >
        Buka Katalog →
      </Link>
    </section>
  );
}
