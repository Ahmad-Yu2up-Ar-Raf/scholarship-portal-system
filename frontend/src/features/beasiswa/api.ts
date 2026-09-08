import { api } from "@/lib/api"
import type { BeasiswaSubmission } from "./types"

export type BeasiswaListParams = {
  search?: string
  status?: string
  sort?: string
  page?: number
  per_page?: number
}

export type Paginated<T> = {
  data: T[]
  meta: { current_page: number; per_page: number; total: number; last_page: number }
}

function toBeasiswaQuery(params: BeasiswaListParams): string {
  const search = new URLSearchParams()
  if (params.search) search.set("search", params.search)
  if (params.status) search.set("status", params.status)
  if (params.sort) search.set("sort", params.sort)
  if (params.page) search.set("page", String(params.page))
  if (params.per_page) search.set("per_page", String(params.per_page))
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export async function fetchBeasiswaList(): Promise<BeasiswaSubmission[]> {
  const res = await api.get(`beasiswa${toBeasiswaQuery({ per_page: 50 })}`).json<{ data: BeasiswaSubmission[] }>()
  return res.data
}

export async function fetchBeasiswaPaged(params: BeasiswaListParams = {}): Promise<Paginated<BeasiswaSubmission>> {
  const res = await api.get(`beasiswa${toBeasiswaQuery(params)}`).json<{ data: BeasiswaSubmission[]; meta?: Paginated<BeasiswaSubmission>["meta"] }>()
  return {
    data: res.data,
    meta: res.meta ?? { current_page: 1, per_page: res.data.length, total: res.data.length, last_page: 1 },
  }
}

export async function createBeasiswa(formData: FormData): Promise<BeasiswaSubmission> {
  const res = await api.post("beasiswa", { body: formData }).json<{ data: BeasiswaSubmission }>()
  return res.data
}

export async function fetchMyBeasiswa(): Promise<BeasiswaSubmission[]> {
  const res = await api.get("my-beasiswa").json<{ data: BeasiswaSubmission[] | BeasiswaSubmission | null }>()
  if (Array.isArray(res.data)) return res.data
  return res.data ? [res.data] : []
}
