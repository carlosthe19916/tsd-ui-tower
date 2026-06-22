import { useCallback } from "react";

import type { PullRequest } from "@app/api/models";
import { useUrlParam } from "@app/hooks/useUrlParams";

export type SortableColumn =
  | "updated_at"
  | "created_at"
  | "unresolved_conversations"
  | "reviews";

export type SortDirection = "asc" | "desc";

const SORT_COLUMN_INDEX: Record<SortableColumn, number> = {
  updated_at: 0,
  created_at: 1,
  unresolved_conversations: 2,
  reviews: 3,
};

export const SORTABLE_COLUMNS: SortableColumn[] = [
  "updated_at",
  "created_at",
  "unresolved_conversations",
  "reviews",
];

const getSortValue = (pr: PullRequest, column: SortableColumn): number => {
  switch (column) {
    case "updated_at":
      return new Date(pr.updated_at).getTime();
    case "created_at":
      return new Date(pr.created_at).getTime();
    case "unresolved_conversations":
      return pr.unresolved_conversations;
    case "reviews":
      return pr.reviews.count;
  }
};

export const usePRSort = () => {
  const [sortColumn, setSortColumn] = useUrlParam("sort", "");
  const [sortDirection, setSortDirection] = useUrlParam("dir", "");

  const onSort = useCallback(
    (column: SortableColumn) => {
      if (sortColumn !== column) {
        setSortColumn(column);
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn("");
        setSortDirection("");
      }
    },
    [sortColumn, sortDirection, setSortColumn, setSortDirection],
  );

  const getSortParams = useCallback(
    (column: SortableColumn) => {
      if (sortColumn !== column) {
        return {
          sortBy: {
            index: SORT_COLUMN_INDEX[column],
            direction: undefined as "asc" | "desc" | undefined,
            defaultDirection: "asc" as const,
          },
          onSort: () => onSort(column),
          columnIndex: SORT_COLUMN_INDEX[column],
        };
      }
      return {
        sortBy: {
          index: SORT_COLUMN_INDEX[column],
          direction: sortDirection as SortDirection,
          defaultDirection: "asc" as const,
        },
        onSort: () => onSort(column),
        columnIndex: SORT_COLUMN_INDEX[column],
      };
    },
    [sortColumn, sortDirection, onSort],
  );

  const sortPRs = useCallback(
    (prs: PullRequest[]): PullRequest[] => {
      if (!sortColumn || !sortDirection) return prs;

      const col = sortColumn as SortableColumn;
      const dir = sortDirection as SortDirection;

      return [...prs].sort((a, b) => {
        const aVal = getSortValue(a, col);
        const bVal = getSortValue(b, col);
        return dir === "asc" ? aVal - bVal : bVal - aVal;
      });
    },
    [sortColumn, sortDirection],
  );

  return {
    sortColumn: sortColumn as SortableColumn | "",
    sortDirection: sortDirection as SortDirection | "",
    onSort,
    getSortParams,
    sortPRs,
  };
};
