import { useAuthStore } from "@/store/auth";
import { useMyBeasiswa } from "@/features/beasiswa/hooks";
import { isPending, isVerified } from "../utils/beasiswa-ku.utils";

export function useBeasiswaKu() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useMyBeasiswa(!!user);
  const applications = data ?? [];

  const pending = applications.filter((application) =>
    isPending(application.status_ajuan),
  ).length;
  const verified = applications.filter((application) =>
    isVerified(application.status_ajuan),
  ).length;

  return {
    user,
    applications,
    pending,
    verified,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
}
