import { useScholarships } from "@/features/scholarship/hooks-schoolarship";
import { useMyBeasiswa } from "@/features/beasiswa/hooks";

export function useDaftarQueries(isUserLoggedIn: boolean) {
  const scholarshipsQuery = useScholarships();
  const myAppsQuery = useMyBeasiswa(isUserLoggedIn);

  return {
    scholarships: scholarshipsQuery.data ?? [],
    isLoadingScholarships: scholarshipsQuery.isLoading,
    myApps: myAppsQuery.data ?? [],
  };
}
