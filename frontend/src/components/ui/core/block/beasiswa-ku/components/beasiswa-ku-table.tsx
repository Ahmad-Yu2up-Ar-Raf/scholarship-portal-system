"use client";

import { Link } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { BeasiswaSubmission } from "../types/beasiswa-ku.types";
import {
  applicationName,
  formatDate,
  statusClass,
} from "../utils/beasiswa-ku.utils";

interface BeasiswaKuTableProps {
  applications: BeasiswaSubmission[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isFetching: boolean;
  onRefetch: () => void;
}

export function BeasiswaKuTable({
  applications,
  isLoading,
  isError,
  error,
  isFetching,
  onRefetch,
}: BeasiswaKuTableProps) {
  return (
    <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white">
      <CardHeader className="border-b-4 border-black bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <CardTitle className="font-head font-black text-xl uppercase wrap-break-word">
            <h2>Riwayat Pendaftaran</h2>
          </CardTitle>
          <Link
            to="/daftar"
            className={cn(
              buttonVariants({ variant: "default" }),
              "border-2 border-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-h-11 justify-center",
            )}
          >
            Daftar Beasiswa
          </Link>
        </div>
      </CardHeader>

      <CardContent
        className="pt-6 space-y-4"
        aria-busy={isLoading || isFetching}
      >
        {isLoading && (
          <div className="flex items-center gap-3 border-4 border-black bg-muted p-4 font-black">
            <Spinner />
            Memuat riwayat pendaftaran...
          </div>
        )}

        {isError && (
          <Alert status="error">
            <AlertTitle>Gagal memuat riwayat</AlertTitle>
            <AlertDescription>
              <p className="wrap-break-word">{getErrorMessage(error)}</p>
              <Button
                type="button"
                onClick={onRefetch}
                disabled={isFetching}
                className="mt-2 border-2 border-black bg-white text-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] min-h-11"
              >
                Coba Lagi
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && applications.length === 0 && (
          <div className="border-4 border-black border-dashed bg-muted p-8 text-center">
            <div className="font-head text-xl font-black uppercase wrap-break-word">
              Belum ada pendaftaran
            </div>
            <p className="text-sm font-medium mt-2 wrap-break-word">
              Mulai dari katalog beasiswa, lalu kirim pengajuan pertamamu.
            </p>
            <Link
              to="/daftar"
              className={cn(
                buttonVariants({ variant: "default" }),
                "inline-flex mt-4 border-2 border-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] min-h-11 justify-center",
              )}
            >
              Daftar Beasiswa Sekarang
            </Link>
          </div>
        )}

        {!isLoading && !isError && applications.length > 0 && (
          <div className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Table>
              <TableHeader>
                <TableRow className="bg-black text-white hover:bg-black">
                  <TableHead scope="col" className="text-white font-black">
                    Beasiswa
                  </TableHead>
                  <TableHead scope="col" className="text-white font-black">
                    Tanggal Daftar
                  </TableHead>
                  <TableHead scope="col" className="text-white font-black">
                    Semester
                  </TableHead>
                  <TableHead scope="col" className="text-white font-black">
                    IPK
                  </TableHead>
                  <TableHead scope="col" className="text-white font-black">
                    Berkas
                  </TableHead>
                  <TableHead scope="col" className="text-white font-black">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow
                    key={application.id}
                    className="border-b-2 border-black hover:bg-muted/60"
                  >
                    <TableCell className="whitespace-normal font-black wrap-break-word min-w-48">
                      {applicationName(application)}
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatDate(application.created_at)}
                    </TableCell>
                    <TableCell className="font-bold">
                      Semester {application.semester}
                    </TableCell>
                    <TableCell className="font-black">
                      {Number(application.ipk).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {application.berkas_url ? (
                        <a
                          href={application.berkas_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center border-2 border-black bg-white px-3 font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        >
                          Lihat Berkas
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                          Tidak ada
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-2 border-black rounded-none font-black uppercase",
                          statusClass(application.status_ajuan),
                        )}
                      >
                        {application.status_ajuan}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
