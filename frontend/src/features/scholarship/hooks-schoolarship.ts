import { useQuery } from "@tanstack/react-query"
import { fetchScholarships, fetchScholarshipsPaged, type ScholarshipParams } from "./api"

export function useScholarships() {
  return useQuery({
    queryKey: ["scholarships"],
    queryFn: fetchScholarships,
    retry: false,
  })
}

export function useScholarshipsPaged(params: ScholarshipParams = {}) {
  const { search = "", type = "", page = 1, per_page = 6 } = params
  return useQuery({
    queryKey: ["scholarships", "paged", search, type, page, per_page],
    queryFn: () => fetchScholarshipsPaged(params),
    retry: false,
  })
}
