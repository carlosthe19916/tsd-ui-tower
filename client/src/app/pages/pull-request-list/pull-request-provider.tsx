import React, { useCallback, useMemo } from "react";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";

import { useFetchPullRequests } from "@app/queries/pull-requests";
import { usePRFilters, useDerivedFilterOptions } from "./hooks/usePRFilters";
import { useUrlParam } from "@app/hooks/useUrlParams";
import { getTablePaginationProps } from "@app/utils/table-utils";

import { columns } from "./columns";
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
    searchTerm,
    setSearchTerm,
    approvalFilter,
    setApprovalFilter,
    clearAllFilters,
    filterPRs,
  } = usePRFilters();

  const allPullRequests = data.pull_requests;
  const { uniqueAuthors, uniqueRepos } =
    useDerivedFilterOptions(allPullRequests);

  const filteredPullRequests = useMemo(
    () => filterPRs(allPullRequests),
    [allPullRequests, filterPRs],
  );

  const [sortParam, setSortParam] = useUrlParam("sort", "");
  const [dirParam, setDirParam] = useUrlParam("dir", "");
  const [pageParam, setPageParam] = useUrlParam("page", "1");
  const [perPageParam, setPerPageParam] = useUrlParam("perPage", "10");

  const sorting: SortingState = useMemo(() => {
    if (!sortParam) return [];
    return [{ id: sortParam, desc: dirParam === "desc" }];
  }, [sortParam, dirParam]);

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      if (next.length === 0) {
        setSortParam("");
        setDirParam("");
      } else {
        setSortParam(next[0].id);
        setDirParam(next[0].desc ? "desc" : "asc");
      }
    },
    [sorting, setSortParam, setDirParam],
  );

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: Math.max(0, (parseInt(pageParam, 10) || 1) - 1),
      pageSize: Math.max(1, parseInt(perPageParam, 10) || 10),
    }),
    [pageParam, perPageParam],
  );

  const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      setPageParam(String(next.pageIndex + 1));
      setPerPageParam(String(next.pageSize));
    },
    [pagination, setPageParam, setPerPageParam],
  );

  const table = useReactTable({
    data: filteredPullRequests,
    columns,
    state: { sorting, pagination },
    onSortingChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
  });

  const paginationProps = getTablePaginationProps(table);

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
        table,
        paginationProps,
        generatedAt: data.generated_at,
        isFetching,
        fetchError,
        totalFilteredCount: filteredPullRequests.length,
        typeFilter,
        setTypeFilter,
        authorFilter,
        setAuthorFilter,
        repoFilter,
        setRepoFilter,
        readyForReview,
        setReadyForReview,
        searchTerm,
        setSearchTerm,
        approvalFilter,
        setApprovalFilter,
        clearAllFilters,
        uniqueAuthors,
        uniqueRepos,
        averageAgeDays,
      }}
    >
      {children}
    </PullRequestListContext>
  );
};
