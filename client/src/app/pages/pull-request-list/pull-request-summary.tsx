import React, { use } from "react";

import {
  Content,
  ContentVariants,
  Flex,
  FlexItem,
} from "@patternfly/react-core";

import { PullRequestListContext } from "./pull-request-context";

export const PullRequestSummary: React.FC = () => {
  const { filteredPullRequests, averageAgeDays } = use(PullRequestListContext);

  const count = filteredPullRequests.length;

  const formatAge = (days: number): string => {
    if (days === 0) return "—";
    if (days < 1) return `${Math.round(days * 24)}h`;
    return `${Math.round(days)}d`;
  };

  return (
    <Flex
      spaceItems={{ default: "spaceItemsLg" }}
      alignItems={{ default: "alignItemsCenter" }}
      style={{ marginBottom: "var(--pf-t--global--spacer--md)" }}
    >
      <FlexItem>
        <Content component={ContentVariants.p}>
          <strong>{count}</strong> {count === 1 ? "PR shown" : "PRs shown"}
        </Content>
      </FlexItem>
      <FlexItem>
        <Content component={ContentVariants.p}>
          Avg. age: <strong>{formatAge(averageAgeDays)}</strong>
        </Content>
      </FlexItem>
    </Flex>
  );
};
