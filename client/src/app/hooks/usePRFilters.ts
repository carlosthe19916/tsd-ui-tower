import { useCallback, useMemo } from "react";

import type { PullRequest } from "@app/api/models";
import { PR_TYPE_FILTERS, type PRTypeFilter } from "@app/Constants";
import { useUrlParam } from "@app/hooks/useUrlParams";
import { isReadyForReview, isWIP } from "@app/utils/pr-utils";

export const usePRFilters = () => {
  const [typeFilter, setTypeFilter] = useUrlParam(
    "type",
    PR_TYPE_FILTERS.REGULAR,
  );
  const [authorFilter, setAuthorFilter] = useUrlParam("author", "");
  const [repoFilter, setRepoFilter] = useUrlParam("repo", "");
  const [readyParam, setReadyParam] = useUrlParam("ready", "");

  const readyForReview = readyParam === "true";
  const setReadyForReview = useCallback(
    (value: boolean) => setReadyParam(value ? "true" : ""),
    [setReadyParam],
  );

  const filterPRs = useCallback(
    (prs: PullRequest[]): PullRequest[] => {
      return prs.filter((pr) => {
        if (typeFilter === PR_TYPE_FILTERS.REGULAR) {
          if (pr.is_automated || isWIP(pr)) return false;
        } else if (typeFilter === PR_TYPE_FILTERS.AUTOMATED) {
          if (!pr.is_automated) return false;
        } else if (typeFilter === PR_TYPE_FILTERS.WIP) {
          if (!isWIP(pr)) return false;
        }

        if (authorFilter && pr.author.login !== authorFilter) return false;
        if (repoFilter && pr.repo !== repoFilter) return false;
        if (readyForReview && !isReadyForReview(pr)) return false;

        return true;
      });
    },
    [typeFilter, authorFilter, repoFilter, readyForReview],
  );

  return {
    typeFilter: typeFilter as PRTypeFilter,
    setTypeFilter,
    authorFilter,
    setAuthorFilter,
    repoFilter,
    setRepoFilter,
    readyForReview,
    setReadyForReview,
    filterPRs,
  };
};

export const useDerivedFilterOptions = (pullRequests: PullRequest[]) => {
  const uniqueAuthors = useMemo(
    () => [...new Set(pullRequests.map((pr) => pr.author.login))].sort(),
    [pullRequests],
  );

  const uniqueRepos = useMemo(
    () => [...new Set(pullRequests.map((pr) => pr.repo))].sort(),
    [pullRequests],
  );

  return { uniqueAuthors, uniqueRepos };
};
