import { api } from "@/api/ky"

export type Scholarship = {
  id: number
  name: string
  slug: string
  type: string | null
  type_label: string | null
  description: string
  color_theme: string
  requirements: string
  beasiswas_count?: number
}

export type Paginated<T> = {
  data: T[]
  meta: { current_page: number; per_page: number; total: number; last_page: number }
}

export type ScholarshipParams = {
  search?: string
  type?: string
  page?: number
  per_page?: number
}

function toQuery(params: ScholarshipParams): string {
  const search = new URLSearchParams()
  if (params.search) search.set("search", params.search)
  if (params.type) search.set("type", params.type)
  if (params.page) search.set("page", String(params.page))
  if (params.per_page) search.set("per_page", String(params.per_page))
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export async function fetchScholarships(): Promise<Scholarship[]> {
  const res = await api.get(`scholarships${toQuery({ per_page: 50 })}`).json<{ data: Scholarship[] }>()
  return res.data
}

export async function fetchScholarshipsPaged(params: ScholarshipParams = {}): Promise<Paginated<Scholarship>> {
  const res = await api.get(`scholarships${toQuery(params)}`).json<{ data: Scholarship[]; meta?: Paginated<Scholarship>["meta"] }>()
  return {
    data: res.data,
    meta: res.meta ?? { current_page: 1, per_page: res.data.length, total: res.data.length, last_page: 1 },
  }
}
