import { useCallback, useEffect, useMemo } from "react";

import type { PaginationStateProps } from "@app/components/SimplePagination";
import { useUrlParam } from "@app/hooks/useUrlParams";

const DEFAULT_PER_PAGE = 10;

export const usePRPagination = (totalItemCount: number) => {
  const [pageParam, setPageParam] = useUrlParam("page", "1");
  const [perPageParam, setPerPageParam] = useUrlParam(
    "perPage",
    String(DEFAULT_PER_PAGE),
  );

  const page = Math.max(1, parseInt(pageParam, 10) || 1);
  const perPage = Math.max(1, parseInt(perPageParam, 10) || DEFAULT_PER_PAGE);

  const lastPage = Math.max(1, Math.ceil(totalItemCount / perPage));

  useEffect(() => {
    if (page > lastPage && totalItemCount > 0) {
      setPageParam(String(lastPage));
    }
  }, [page, lastPage, totalItemCount, setPageParam]);

  const setPage = useCallback(
    (p: number) => setPageParam(String(p)),
    [setPageParam],
  );

  const setPerPage = useCallback(
    (pp: number) => {
      setPerPageParam(String(pp));
      setPageParam("1");
    },
    [setPerPageParam, setPageParam],
  );

  const paginationProps: PaginationStateProps = useMemo(
    () => ({
      itemCount: totalItemCount,
      perPage,
      page,
      onSetPage: (_event, p) => setPage(p),
      onPerPageSelect: (_event, pp) => setPerPage(pp),
    }),
    [totalItemCount, perPage, page, setPage, setPerPage],
  );

  return { page, perPage, setPage, setPerPage, paginationProps };
};
