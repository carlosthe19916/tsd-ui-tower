import React from "react";

import type { Table } from "@tanstack/react-table";

import type { PullRequest } from "@app/api/models";
import type { PaginationStateProps } from "@app/components/SimplePagination";
import type { PRTypeFilter } from "@app/Constants";

export interface IPullRequestListContext {
  table: Table<PullRequest>;
  paginationProps: PaginationStateProps;
  generatedAt: string;
  isFetching: boolean;
  fetchError: Error | null;
  totalFilteredCount: number;

  typeFilter: PRTypeFilter;
  setTypeFilter: (value: string) => void;
  authorFilter: string;
  setAuthorFilter: (value: string) => void;
  repoFilter: string;
  setRepoFilter: (value: string) => void;
  readyForReview: boolean;
  setReadyForReview: (value: boolean) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  uniqueAuthors: string[];
  uniqueRepos: string[];
  averageAgeDays: number;
}

export const PullRequestListContext =
  React.createContext<IPullRequestListContext>({} as IPullRequestListContext);
