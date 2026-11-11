import type { BeasiswaSubmission } from "../types/beasiswa-ku.types";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
}

export function isVerified(status: string): boolean {
  const normalized = status.toLowerCase();
  return normalized.includes("lulus") || normalized.includes("diverifikasi");
}

export function isRejected(status: string): boolean {
  return status.toLowerCase().includes("tolak");
}

export function isPending(status: string): boolean {
  return !isVerified(status) && !isRejected(status);
}

export function statusClass(status: string): string {
  if (isVerified(status)) return "bg-green-400 text-black";
  if (isRejected(status)) return "bg-red-500 text-white";
  return "bg-yellow-300 text-black";
}

export function applicationName(application: BeasiswaSubmission): string {
  return application.scholarship?.name ?? application.beasiswa ?? "Beasiswa";
}
