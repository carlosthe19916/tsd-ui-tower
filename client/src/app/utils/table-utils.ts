import type { Table } from "@tanstack/react-table";

import type { PaginationStateProps } from "@app/components/SimplePagination";

export const getTablePaginationProps = <TData>(
  table: Table<TData>,
): PaginationStateProps => {
  const { pageIndex, pageSize } = table.getState().pagination;
  return {
    itemCount: table.getRowCount(),
    perPage: pageSize,
    page: pageIndex + 1,
    onSetPage: (_event, page) => table.setPageIndex(page - 1),
    onPerPageSelect: (_event, perPage) => {
      table.setPageSize(perPage);
      table.setPageIndex(0);
    },
  };
};
