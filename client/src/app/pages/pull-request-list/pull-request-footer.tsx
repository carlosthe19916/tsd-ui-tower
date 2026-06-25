import React, { use } from "react";

import dayjs from "dayjs";
import { Content, ContentVariants } from "@patternfly/react-core";

import { PullRequestListContext } from "./pull-request-context";

export const PullRequestFooter: React.FC = () => {
  const { generatedAt } = use(PullRequestListContext);

  if (!generatedAt) return null;

  const formatted = dayjs(generatedAt).format("MMM D, YYYY, h:mm A");
  const relative = dayjs(generatedAt).fromNow();

  return (
    <Content
      component={ContentVariants.small}
      style={{ color: "var(--pf-t--global--text--color--subtle)" }}
    >
      Last updated: {formatted} (~{relative})
    </Content>
  );
};
