import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchBeasiswaList, createBeasiswa, fetchMyBeasiswa, fetchBeasiswaPaged, type BeasiswaListParams } from "./api"

export function useBeasiswaList() {
  return useQuery({
    queryKey: ["beasiswa"],
    queryFn: fetchBeasiswaList,
    retry: false,
  })
}

export function useCreateBeasiswa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (fd: FormData) => createBeasiswa(fd),
    retry: false,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["beasiswa"] })
      qc.invalidateQueries({ queryKey: ["my-beasiswa"] })
    },
  })
}

export function useMyBeasiswa(enabled = true) {
  return useQuery({
    queryKey: ["my-beasiswa"],
    queryFn: fetchMyBeasiswa,
    enabled,
    retry: false,
  })
}

export function useBeasiswaPaged(params: BeasiswaListParams = {}) {
  const { search = "", status = "", sort = "", page = 1, per_page = 5 } = params
  return useQuery({
    queryKey: ["beasiswa", "paged", search, status, sort, page, per_page],
    queryFn: () => fetchBeasiswaPaged(params),
    retry: false,
  })
}
