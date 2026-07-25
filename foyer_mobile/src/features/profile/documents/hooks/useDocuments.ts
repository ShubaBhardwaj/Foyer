import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { DigitalDocument } from "../../shared/types/profile.types";

export function useDocuments() {
  const {
    data: documents = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<DigitalDocument[]>({
    queryKey: queryKeys.profile.documents(),
    queryFn: async () => {
      return [];
    },
  });

  return {
    documents,
    rawCount: documents.length,
    isLoading,
    isRefetching,
    refetch,
  };
}
