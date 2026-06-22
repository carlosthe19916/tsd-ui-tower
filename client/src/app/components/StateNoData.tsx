import type React from "react";

import { EmptyState, EmptyStateBody } from "@patternfly/react-core";
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";

interface StateNoDataProps {
  message?: string;
}

export const StateNoData: React.FC<StateNoDataProps> = ({
  message = "No pull requests match the current filters.",
}) => {
  return (
    <EmptyState
      titleText="No results found"
      headingLevel="h2"
      icon={SearchIcon}
      variant="sm"
    >
      <EmptyStateBody>{message}</EmptyStateBody>
    </EmptyState>
  );
};
