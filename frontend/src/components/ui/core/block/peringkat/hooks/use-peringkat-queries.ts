import { useBeasiswaPaged } from "@/features/beasiswa/hooks";

export function usePeringkatQueries(
  debouncedSearch: string,
  page: number,
  pageSize: number,
) {
  const podiumQuery = useBeasiswaPaged({
    status: "lulus verifikasi",
    sort: "ipk_desc",
    per_page: 50,
  });
  const listQuery = useBeasiswaPaged({
    status: "lulus verifikasi",
    sort: "ipk_desc",
    search: debouncedSearch,
    page,
    per_page: pageSize,
  });

  return {
    podiumData: podiumQuery.data?.data ?? [],
    isPodiumLoading: podiumQuery.isLoading,
    listData: listQuery.data?.data ?? [],
    meta: listQuery.data?.meta,
    isListLoading: listQuery.isLoading,
  };
}
