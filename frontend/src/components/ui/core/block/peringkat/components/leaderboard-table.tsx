"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { BeasiswaSubmission } from "../types/peringkat.types";
import { PAGE_SIZE } from "../utils/peringkat.utils";

interface LeaderboardTableProps {
  search: string;
  onSearchChange: (val: string) => void;
  list: BeasiswaSubmission[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onSelectApplicant: (row: BeasiswaSubmission) => void;
}

export function LeaderboardTable({
  search,
  onSearchChange,
  list,
  isLoading,
  totalCount,
  page,
  totalPages,
  onPageChange,
  onSelectApplicant,
}: LeaderboardTableProps) {
  return (
    <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
      <CardHeader className="border-b-4 border-black bg-white">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <CardTitle className="font-head font-black text-xl uppercase wrap-break-word">
            Penerima Terverifikasi
          </CardTitle>
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama / sekolah..."
            className="md:max-w-xs border-4 border-black rounded-none p-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {isLoading && (
          <div className="flex items-center gap-2 font-bold">
            <Spinner /> Memuat data...
          </div>
        )}
        {!isLoading && list.length > 0 && (
          <div className="overflow-x-auto border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Table>
              <TableHeader>
                <TableRow className="bg-black text-white hover:bg-black">
                  <TableHead className="text-white font-black">#</TableHead>
                  <TableHead className="text-white font-black">Nama</TableHead>
                  <TableHead className="text-white font-black">IPK</TableHead>
                  <TableHead className="text-white font-black">
                    Beasiswa
                  </TableHead>
                  <TableHead className="text-white font-black">
                    Sekolah
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    className="border-b-2 border-black hover:bg-muted/50 cursor-pointer"
                    onClick={() => onSelectApplicant(row)}
                  >
                    <TableCell className="font-black">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="rounded-full h-8 w-8 border-2 border-black bg-primary flex items-center justify-center text-xs font-black shrink-0">
                          {row.nama.charAt(0)}
                        </span>
                        <span className="font-bold wrap-break-word">
                          {row.nama}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="font-black">
                      {Number(row.ipk).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className="border-2 border-black bg-accent text-black font-bold rounded-none wrap-break-word">
                        {row.beasiswa ?? "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs wrap-break-word">
                      {row.asal_sekolah ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {!isLoading && list.length === 0 && (
          <div className="border-4 border-black border-dashed bg-muted p-8 text-center font-black">
            Tidak ada data. Coba kata kunci lain.
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3">
            <Button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              variant="outline"
              className="border-2 border-black font-black disabled:opacity-50"
            >
              ← Prev
            </Button>
            <span className="text-xs font-black border-2 border-black bg-white px-2 py-1">
              Hal {page} / {totalPages}
            </span>
            <Button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              variant="outline"
              className="border-2 border-black font-black disabled:opacity-50"
            >
              Next →
            </Button>
          </div>
        )}
        <div className="text-xs font-mono text-muted-foreground wrap-break-word">
          Total {totalCount} penerima terverifikasi • Diurutkan IPK tertinggi
        </div>
      </CardContent>
    </Card>
  );
}
