import React from "react";

import type { PullRequest } from "@app/api/models";
import type { PRTypeFilter } from "@app/Constants";
import type { SortableColumn, SortDirection } from "@app/hooks/usePRSort";

export interface IPullRequestListContext {
  allPullRequests: PullRequest[];
  filteredPullRequests: PullRequest[];
  generatedAt: string;
  isFetching: boolean;
  fetchError: Error | null;

  typeFilter: PRTypeFilter;
  setTypeFilter: (value: string) => void;
  authorFilter: string;
  setAuthorFilter: (value: string) => void;
  repoFilter: string;
  setRepoFilter: (value: string) => void;
  readyForReview: boolean;
  setReadyForReview: (value: boolean) => void;

  sortColumn: SortableColumn | "";
  sortDirection: SortDirection | "";
  onSort: (column: SortableColumn) => void;
  getSortParams: (column: SortableColumn) => {
    sortBy: {
      index: number;
      direction: SortDirection | undefined;
      defaultDirection: "asc";
    };
    onSort: () => void;
    columnIndex: number;
  };

  uniqueAuthors: string[];
  uniqueRepos: string[];
  averageAgeDays: number;
}

export const PullRequestListContext =
  React.createContext<IPullRequestListContext>({} as IPullRequestListContext);
