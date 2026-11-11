"use client";

import { Link } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";
import type { Scholarship } from "../types/beasiswa-catalog.types";

interface ScholarshipCardGridProps {
  items: Scholarship[];
}

export function ScholarshipCardGrid({ items }: ScholarshipCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((s) => (
        <Card
          key={s.id}
          className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none"
          style={{ backgroundColor: s.color_theme }}
        >
          <CardHeader>
            <CardTitle className="font-head text-xl flex items-center gap-2 wrap-break-word">
              <Badge className="border-2 border-black bg-black text-white shrink-0">
                {s.type_label ?? s.slug}
              </Badge>
              <span className="wrap-break-word">{s.name}</span>
            </CardTitle>
            <CardDescription className="text-black font-medium wrap-break-word">
              {s.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-2 border-black bg-white p-3 text-sm font-mono wrap-break-word">
              {s.requirements}
            </div>
            <div className="text-xs font-bold">
              Pendaftar:{" "}
              <span className="border border-black bg-black text-white px-1.5 py-0.5">
                {s.beasiswas_count ?? 0}
              </span>
            </div>
            <Link
              to={`/beasiswa/${s.slug}`}
              onClick={() => playSound("open")}
              className={cn(
                "w-full inline-flex justify-center",
                "border-2 border-black bg-black text-white font-black py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black",
              )}
            >
              Lihat Detail →
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
