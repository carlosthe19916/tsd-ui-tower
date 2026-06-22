import type React from "react";

import { EmptyState, EmptyStateBody } from "@patternfly/react-core";

interface StateErrorProps {
  message?: string;
}

export const StateError: React.FC<StateErrorProps> = ({
  message = "Failed to load data. Try refreshing the page.",
}) => {
  return (
    <EmptyState
      titleText="Unable to load data"
      headingLevel="h2"
      status="danger"
      variant="sm"
    >
      <EmptyStateBody>{message}</EmptyStateBody>
    </EmptyState>
  );
};
