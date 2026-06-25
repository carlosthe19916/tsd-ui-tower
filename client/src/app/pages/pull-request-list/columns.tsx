import {
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Label,
  Tooltip,
} from "@patternfly/react-core";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";

import type { PullRequest } from "@app/api/models";
import { CIStatusIcon } from "./components/CIStatusIcon";
import { SizeBadge } from "./components/SizeBadge";
import { AgeDisplay } from "./components/AgeDisplay";
import { AuthorCell } from "./components/AuthorCell";
import { extractSize } from "@app/utils/pr-utils";

const columnHelper = createColumnHelper<PullRequest>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<PullRequest, any>[] = [
  columnHelper.display({
    id: "pr",
    header: "PR",
    meta: { width: 40, dataLabel: "PR" },
    enableSorting: false,
    cell: ({ row }) => {
      const pr = row.original;
      const size = extractSize(pr);
      return (
        <Flex
          direction={{ default: "column" }}
          spaceItems={{ default: "spaceItemsXs" }}
        >
          <FlexItem>
            <Flex
              spaceItems={{ default: "spaceItemsSm" }}
              alignItems={{ default: "alignItemsCenter" }}
              flexWrap={{ default: "wrap" }}
            >
              <FlexItem>
                <a href={pr.url} target="_blank" rel="noopener noreferrer">
                  {pr.title}
                </a>
              </FlexItem>
              {size && (
                <FlexItem>
                  <SizeBadge size={size} />
                </FlexItem>
              )}
              {pr.is_draft && (
                <FlexItem>
                  <Label isCompact color="grey">
                    Draft
                  </Label>
                </FlexItem>
              )}
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex
              spaceItems={{ default: "spaceItemsMd" }}
              alignItems={{ default: "alignItemsCenter" }}
            >
              <FlexItem>
                <Content
                  component={ContentVariants.small}
                  style={{
                    color: "var(--pf-t--global--text--color--subtle)",
                  }}
                >
                  {pr.repo} #{pr.number}
                </Content>
              </FlexItem>
              <FlexItem>
                <AuthorCell author={pr.author} />
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      );
    },
  }),

  columnHelper.accessor("ci_status", {
    header: "CI",
    meta: { width: 10, dataLabel: "CI" },
    enableSorting: false,
    cell: ({ getValue }) => <CIStatusIcon status={getValue()} />,
  }),

  columnHelper.accessor("updated_at", {
    header: "Updated",
    meta: {
      width: 10,
      dataLabel: "Updated",
      tooltip: "Time since last activity on the PR",
    },
    cell: ({ getValue }) => <AgeDisplay dateString={getValue()} />,
    sortingFn: "datetime",
  }),

  columnHelper.accessor("created_at", {
    header: "Age",
    meta: {
      width: 10,
      dataLabel: "Age",
      tooltip: "Time since the PR was opened",
    },
    cell: ({ getValue }) => <AgeDisplay dateString={getValue()} colored />,
    sortingFn: "datetime",
  }),

  columnHelper.accessor("unresolved_conversations", {
    header: "Unresolved",
    meta: {
      width: 10,
      dataLabel: "Unresolved",
      tooltip: "Number of unresolved review conversation threads",
    },
  }),

  columnHelper.accessor((row) => row.reviews.count, {
    id: "reviews",
    header: "Reviews",
    meta: {
      width: 10,
      dataLabel: "Reviews",
      tooltip: "Number of human reviews submitted",
    },
  }),

  columnHelper.display({
    id: "unreviewed",
    header: "Unreviewed",
    meta: {
      width: 10,
      dataLabel: "Unreviewed",
      tooltip: "Indicates new commits since the last review",
    },
    enableSorting: false,
    cell: ({ row }) => {
      const pr = row.original;
      const needsReview = pr.reviews.has_new_commits || pr.reviews.count === 0;
      return needsReview ? (
        <Tooltip content="Has unreviewed changes">
          <EyeIcon />
        </Tooltip>
      ) : null;
    },
  }),
];
