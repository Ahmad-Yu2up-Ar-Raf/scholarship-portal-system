import { useState, useEffect } from "react";
import { useScholarshipsPaged } from "@/features/scholarship/hooks-schoolarship";
import type { Scholarship } from "@/features/scholarship/api";
import { PAGE_SIZE } from "../utils/beasiswa-catalog.utils";

export function useBeasiswaCatalog() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Scholarship[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [debounced, filter]);

  const { data, isLoading, isError } = useScholarshipsPaged({
    search: debounced || undefined,
    type: filter === "all" ? undefined : filter,
    page,
    per_page: PAGE_SIZE,
  });

  useEffect(() => {
    if (!data) return;
    setItems((prev) =>
      page === 1
        ? data.data
        : [
            ...prev,
            ...data.data.filter((s) => !prev.some((p) => p.id === s.id)),
          ],
    );
  }, [data, page]);

  const total = data?.meta.total ?? items.length;
  const hasMore = items.length < total;

  return {
    query,
    setQuery,
    filter,
    setFilter,
    page,
    setPage,
    items,
    isLoading,
    isError,
    total,
    hasMore,
  };
}
