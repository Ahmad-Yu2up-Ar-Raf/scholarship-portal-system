import type { Scholarship } from "@/features/scholarship/api";
import type { InitialScholarship } from "../types/daftar.types";

export const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"].map(
  (v) => ({
    value: v,
    label: `Semester ${v}`,
  }),
);

export function resolveInitialScholarship(
  searchParams: URLSearchParams,
  scholarships: Scholarship[] | undefined,
): InitialScholarship {
  const sid = searchParams.get("scholarship_id");
  if (sid) {
    const found = (scholarships ?? []).find((s) => String(s.id) === sid);
    if (found) return { slug: found.slug, id: found.id };
  }
  const type = searchParams.get("type");
  if (type) {
    const found = (scholarships ?? []).find((s) => s.slug === type);
    if (found) return { slug: found.slug, id: found.id };
    if (type === "akademik" || type === "non_akademik") {
      const legacy = (scholarships ?? []).find((s) =>
        s.slug.includes(type.split("_")[0]),
      );
      if (legacy) return { slug: legacy.slug, id: legacy.id };
      return { slug: type, id: 0 };
    }
  }
  return { slug: "", id: 0 };
}
