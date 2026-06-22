import { queryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

import type { ReviewRotData } from "@app/api/models";
import { DATA_URL } from "@app/Constants";

export const PullRequestsQueryKey = "pull-requests";

const emptyData: ReviewRotData = {
  generated_at: "",
  pull_requests: [],
};

export const pullRequestsQueryOptions = queryOptions({
  queryKey: [PullRequestsQueryKey],
  queryFn: async () => {
    const response = await axios.get<ReviewRotData>(DATA_URL);
    return response.data;
  },
  staleTime: 5 * 60 * 1000,
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
