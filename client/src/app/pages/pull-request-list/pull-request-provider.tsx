import React, { useMemo } from "react";

import { useFetchPullRequests } from "@app/queries/pull-requests";
import { usePRFilters, useDerivedFilterOptions } from "@app/hooks/usePRFilters";
import { usePRPagination } from "@app/hooks/usePRPagination";
import { usePRSort } from "@app/hooks/usePRSort";

import { PullRequestListContext } from "./pull-request-context";

interface PullRequestProviderProps {
  children: React.ReactNode;
}

export const PullRequestProvider: React.FC<PullRequestProviderProps> = ({
  children,
}) => {
  const { data, isFetching, fetchError } = useFetchPullRequests();

  const {
    typeFilter,
    setTypeFilter,
    authorFilter,
    setAuthorFilter,
    repoFilter,
    setRepoFilter,
    readyForReview,
    setReadyForReview,
    filterPRs,
  } = usePRFilters();

  const { sortColumn, sortDirection, onSort, getSortParams, sortPRs } =
    usePRSort();

  const allPullRequests = data.pull_requests;

  const { uniqueAuthors, uniqueRepos } =
    useDerivedFilterOptions(allPullRequests);

  const filteredPullRequests = useMemo(
    () => sortPRs(filterPRs(allPullRequests)),
    [allPullRequests, filterPRs, sortPRs],
  );

  const { page, perPage, paginationProps } = usePRPagination(
    filteredPullRequests.length,
  );

  const currentPageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredPullRequests.slice(start, start + perPage);
  }, [filteredPullRequests, page, perPage]);

  const averageAgeDays = useMemo(() => {
    if (filteredPullRequests.length === 0) return 0;
    const now = Date.now();
    const totalMs = filteredPullRequests.reduce(
      (sum, pr) => sum + (now - new Date(pr.created_at).getTime()),
      0,
    );
    return totalMs / filteredPullRequests.length / (1000 * 60 * 60 * 24);
  }, [filteredPullRequests]);

  return (
    <PullRequestListContext
      value={{
        allPullRequests,
        filteredPullRequests,
        generatedAt: data.generated_at,
        isFetching,
        fetchError,
        typeFilter,
        setTypeFilter,
        authorFilter,
        setAuthorFilter,
        repoFilter,
        setRepoFilter,
        readyForReview,
        setReadyForReview,
        sortColumn,
        sortDirection,
        onSort,
        getSortParams,
        currentPageItems,
        totalFilteredCount: filteredPullRequests.length,
        paginationProps,
        uniqueAuthors,
        uniqueRepos,
        averageAgeDays,
      }}
    >
      {children}
    </PullRequestListContext>
  );
};
