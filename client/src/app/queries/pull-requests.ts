import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

import type { ReviewRotData } from "@app/api/models";

export const PullRequestsQueryKey = "pull-requests";

const emptyData: ReviewRotData = {
  generated_at: "",
  pull_requests: [],
};

export const pullRequestsQueryOptions = queryOptions({
  queryKey: [PullRequestsQueryKey],
  queryFn: async () => {
    const response = await axios.get<ReviewRotData>("/api/pull-requests");
    return response.data;
  },
});

export const useFetchPullRequests = () => {
  const { data, isFetching, isError, error } = useQuery(
    pullRequestsQueryOptions,
  );

  return {
    data: data ?? emptyData,
    isFetching,
    fetchError: isError ? error : null,
  };
};

export const useRefreshData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.post<{ status: string }>(
        "/api/pull-requests/refresh",
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pullRequestsQueryOptions.queryKey,
      });
    },
  });
};
