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
    uniqueAuthors,
    uniqueRepos,
    paginationProps,
  } = use(PullRequestListContext);

  const { mutate: refresh, isPending: isRefreshing } = useRefreshData();

  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [isRepoOpen, setIsRepoOpen] = useState(false);

  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <SearchInput
            placeholder="Search pull requests"
            value={searchTerm}
            onChange={(_event, value) => setSearchTerm(value)}
            onClear={() => setSearchTerm("")}
          />
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
          <Checkbox
            id="ready-for-review"
            label="Ready for review"
            isChecked={readyForReview}
            onChange={(_event, checked) => setReadyForReview(checked)}
          />
        </ToolbarItem>

        <ToolbarGroup>
          <ToolbarItem>
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
          </ToolbarItem>
        </ToolbarGroup>

        <ToolbarItem>
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
        </ToolbarItem>

        <ToolbarItem>
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
        </ToolbarItem>

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
