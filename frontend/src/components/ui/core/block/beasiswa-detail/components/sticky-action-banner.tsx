"use client";

import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyActionBannerProps {
  scholarshipId: number;
  scholarshipName: string;
}

export function StickyActionBanner({
  scholarshipId,
  scholarshipName,
}: StickyActionBannerProps) {
  return (
    <div className="sticky bottom-4 z-30 md:static">
      <Link
        to={`/daftar?scholarship_id=${scholarshipId}`}
        className={cn(
          buttonVariants({ size: "lg" }),
          "w-full md:w-auto inline-flex justify-center border-4 border-black bg-[#ff6b9d] text-white font-head font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        )}
      >
        Daftar untuk {scholarshipName} →
      </Link>
    </div>
  );
}
