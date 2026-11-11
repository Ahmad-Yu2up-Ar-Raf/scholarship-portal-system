import type { BeasiswaSubmission } from "@/features/beasiswa/types";
import type { Scholarship } from "@/features/scholarship/api";

export type { BeasiswaSubmission, Scholarship };

export type HomeStats = {
  total: number;
  verified: number;
  pending: number;
};

export type ScholarshipTypeItem = {
  id: string;
  title: string;
  label: string;
  syarat: string;
  desc: string;
  color_theme?: string;
  count: number;
};
