import type React from "react";

import { Content, PageSection, Stack, StackItem } from "@patternfly/react-core";

import { PullRequestProvider } from "./pull-request-provider";
import { PullRequestSummary } from "./pull-request-summary";
import { PullRequestToolbar } from "./pull-request-toolbar";
import { PullRequestTable } from "./pull-request-table";
import { PullRequestFooter } from "./pull-request-footer";

export const PullRequestList: React.FC = () => {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Pull Requests</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <PullRequestProvider>
          <Stack hasGutter>
            <StackItem>
              <PullRequestSummary />
            </StackItem>
            <StackItem>
              <PullRequestToolbar />
              <PullRequestTable />
            </StackItem>
            <StackItem>
              <PullRequestFooter />
            </StackItem>
          </Stack>
        </PullRequestProvider>
      </PageSection>
    </>
  );
};
