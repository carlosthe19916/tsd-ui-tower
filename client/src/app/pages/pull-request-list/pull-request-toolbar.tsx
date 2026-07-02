import React, { use, useState } from "react";

import {
  Button,
  Checkbox,
  MenuToggle,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import SyncAltIcon from "@patternfly/react-icons/dist/esm/icons/sync-alt-icon";

import { SimplePagination } from "@app/components/SimplePagination";
import { PR_TYPE_FILTERS } from "@app/Constants";
import { useRefreshData } from "@app/queries/pull-requests";

import { PullRequestListContext } from "./pull-request-context";

const TYPE_LABELS: Record<string, string> = {
  [PR_TYPE_FILTERS.REGULAR]: "Regular",
  [PR_TYPE_FILTERS.AUTOMATED]: "Automated",
  [PR_TYPE_FILTERS.WIP]: "WIP",
  [PR_TYPE_FILTERS.ALL]: "All",
};

export const PullRequestToolbar: React.FC = () => {
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
    clearAllFilters,
    uniqueAuthors,
    uniqueRepos,
    paginationProps,
  } = use(PullRequestListContext);

  const { mutate: refresh, isPending: isRefreshing } = useRefreshData();

  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [isRepoOpen, setIsRepoOpen] = useState(false);

  return (
    <Toolbar clearAllFilters={clearAllFilters}>
      <ToolbarContent>
        <ToolbarItem>
          <ToolbarFilter
            labels={searchTerm ? [searchTerm] : []}
            deleteLabel={() => setSearchTerm("")}
            deleteLabelGroup={() => setSearchTerm("")}
            categoryName="Search"
          >
            <SearchInput
              placeholder="Search pull requests"
              value={searchTerm}
              onChange={(_event, value) => setSearchTerm(value)}
              onClear={() => setSearchTerm("")}
            />
          </ToolbarFilter>
        </ToolbarItem>

        <ToolbarItem>
          <Button
            variant="primary"
            icon={<SyncAltIcon />}
            isLoading={isRefreshing}
            isDisabled={isRefreshing}
            onClick={() => refresh()}
          >
            Refresh
          </Button>
        </ToolbarItem>

        <ToolbarItem alignSelf="center">
          <ToolbarFilter
            labels={readyForReview ? ["Ready for review"] : []}
            deleteLabel={() => setReadyForReview(false)}
            deleteLabelGroup={() => setReadyForReview(false)}
            categoryName="Status"
          >
            <Checkbox
              id="ready-for-review"
              label="Ready for review"
              isChecked={readyForReview}
              onChange={(_event, checked) => setReadyForReview(checked)}
            />
          </ToolbarFilter>
        </ToolbarItem>

        <ToolbarGroup variant="filter-group">
          <ToolbarFilter
            labels={
              typeFilter !== PR_TYPE_FILTERS.REGULAR &&
              typeFilter !== PR_TYPE_FILTERS.ALL
                ? [TYPE_LABELS[typeFilter]]
                : []
            }
            deleteLabel={() => setTypeFilter(PR_TYPE_FILTERS.ALL)}
            deleteLabelGroup={() => setTypeFilter(PR_TYPE_FILTERS.ALL)}
            categoryName="Type"
          >
            <ToggleGroup aria-label="PR type filter">
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <ToggleGroupItem
                  key={value}
                  text={label}
                  buttonId={`type-${value}`}
                  isSelected={typeFilter === value}
                  onChange={() => setTypeFilter(value)}
                />
              ))}
            </ToggleGroup>
          </ToolbarFilter>

          <ToolbarFilter
            labels={authorFilter ? [authorFilter] : []}
            deleteLabel={() => setAuthorFilter("")}
            deleteLabelGroup={() => setAuthorFilter("")}
            categoryName="Author"
          >
            <Select
              isOpen={isAuthorOpen}
              onSelect={(_event, value) => {
                setAuthorFilter(value === "__all__" ? "" : (value as string));
                setIsAuthorOpen(false);
              }}
              onOpenChange={setIsAuthorOpen}
              selected={authorFilter || "__all__"}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsAuthorOpen(!isAuthorOpen)}
                  isExpanded={isAuthorOpen}
                  style={{ minWidth: "180px" }}
                >
                  {authorFilter || "All authors"}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="__all__">All authors</SelectOption>
                {uniqueAuthors.map((author) => (
                  <SelectOption key={author} value={author}>
                    {author}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarFilter>

          <ToolbarFilter
            labels={repoFilter ? [repoFilter] : []}
            deleteLabel={() => setRepoFilter("")}
            deleteLabelGroup={() => setRepoFilter("")}
            categoryName="Repository"
          >
            <Select
              isOpen={isRepoOpen}
              onSelect={(_event, value) => {
                setRepoFilter(value === "__all__" ? "" : (value as string));
                setIsRepoOpen(false);
              }}
              onOpenChange={setIsRepoOpen}
              selected={repoFilter || "__all__"}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsRepoOpen(!isRepoOpen)}
                  isExpanded={isRepoOpen}
                  style={{ minWidth: "200px" }}
                >
                  {repoFilter || "All repos"}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="__all__">All repos</SelectOption>
                {uniqueRepos.map((repo) => (
                  <SelectOption key={repo} value={repo}>
                    {repo}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarFilter>
        </ToolbarGroup>

        <ToolbarItem variant="pagination" align={{ default: "alignEnd" }}>
          <SimplePagination
            idPrefix="pr-table"
            isTop
            paginationProps={paginationProps}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
