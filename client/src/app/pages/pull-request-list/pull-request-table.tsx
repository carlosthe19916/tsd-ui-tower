import React, { use } from "react";

import { Flex, FlexItem, Label, Tooltip } from "@patternfly/react-core";
import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";
import type { ThProps } from "@patternfly/react-table";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";

import { CIStatusIcon } from "@app/components/CIStatusIcon";
import { SimplePagination } from "@app/components/SimplePagination";
import { SizeBadge } from "@app/components/SizeBadge";
import { AgeDisplay } from "@app/components/AgeDisplay";
import { AuthorCell } from "@app/components/AuthorCell";
import { ConditionalTableBody } from "@app/components/ConditionalTableBody";
import { extractSize } from "@app/utils/pr-utils";
import { PullRequestListContext } from "./pull-request-context";

const NUM_COLUMNS = 7;

const ColumnHelp: React.FC<{ text: string }> = ({ text }) => (
  <Tooltip content={text}>
    <OutlinedQuestionCircleIcon
      style={{
        marginLeft: "var(--pf-t--global--spacer--xs)",
        color: "var(--pf-t--global--icon--color--subtle)",
        cursor: "help",
      }}
    />
  </Tooltip>
);

export const PullRequestTable: React.FC = () => {
  const {
    currentPageItems,
    totalFilteredCount,
    isFetching,
    fetchError,
    getSortParams,
    paginationProps,
  } = use(PullRequestListContext);

  const makeSortProps = (
    column:
      | "updated_at"
      | "created_at"
      | "unresolved_conversations"
      | "reviews",
  ): ThProps["sort"] => {
    const params = getSortParams(column);
    return {
      sortBy: params.sortBy,
      onSort: () => params.onSort(),
      columnIndex: params.columnIndex,
    };
  };

  return (
    <>
      <Table aria-label="Pull requests table" variant="compact">
        <Thead>
          <Tr>
            <Th width={40}>PR</Th>
            <Th width={10}>CI</Th>
            <Th width={10} sort={makeSortProps("updated_at")}>
              Updated
              <ColumnHelp text="Time since last activity on the PR" />
            </Th>
            <Th width={10} sort={makeSortProps("created_at")}>
              Age
              <ColumnHelp text="Time since the PR was opened" />
            </Th>
            <Th width={10} sort={makeSortProps("unresolved_conversations")}>
              Unresolved
              <ColumnHelp text="Number of unresolved review conversation threads" />
            </Th>
            <Th width={10} sort={makeSortProps("reviews")}>
              Reviews
              <ColumnHelp text="Number of human reviews submitted" />
            </Th>
            <Th width={10}>
              Unreviewed
              <ColumnHelp text="Indicates new commits since the last review" />
            </Th>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={totalFilteredCount === 0}
          numRenderedColumns={NUM_COLUMNS}
        >
          <Tbody>
            {currentPageItems.map((pr) => {
              const size = extractSize(pr);
              const needsReview =
                pr.reviews.has_new_commits || pr.reviews.count === 0;

              return (
                <Tr key={pr.url}>
                  <Td dataLabel="PR">
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
                            <a
                              href={pr.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
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
                            <span
                              style={{
                                color:
                                  "var(--pf-t--global--text--color--subtle)",
                                fontSize:
                                  "var(--pf-t--global--font--size--body--sm)",
                              }}
                            >
                              {pr.repo} #{pr.number}
                            </span>
                          </FlexItem>
                          <FlexItem>
                            <AuthorCell author={pr.author} />
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </Td>
                  <Td dataLabel="CI">
                    <CIStatusIcon status={pr.ci_status} />
                  </Td>
                  <Td dataLabel="Updated">
                    <AgeDisplay dateString={pr.updated_at} />
                  </Td>
                  <Td dataLabel="Age">
                    <AgeDisplay dateString={pr.created_at} colored />
                  </Td>
                  <Td dataLabel="Unresolved">{pr.unresolved_conversations}</Td>
                  <Td dataLabel="Reviews">{pr.reviews.count}</Td>
                  <Td dataLabel="Unreviewed">
                    {needsReview && (
                      <Tooltip content="Has unreviewed changes">
                        <EyeIcon />
                      </Tooltip>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="pr-table"
        isTop={false}
        paginationProps={paginationProps}
      />
    </>
  );
};
