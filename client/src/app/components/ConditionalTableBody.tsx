import type React from "react";

import { Bullseye, Spinner } from "@patternfly/react-core";
import { Tbody, Td, Tr } from "@patternfly/react-table";

import { StateError } from "./StateError";
import { StateNoData } from "./StateNoData";

interface ConditionalTableBodyProps {
  isLoading: boolean;
  isError: boolean;
  isNoData: boolean;
  numRenderedColumns: number;
  children: React.ReactNode;
}

export const ConditionalTableBody: React.FC<ConditionalTableBodyProps> = ({
  isLoading,
  isError,
  isNoData,
  numRenderedColumns,
  children,
}) => {
  if (isLoading) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={numRenderedColumns}>
            <Bullseye>
              <Spinner />
            </Bullseye>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  if (isError) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={numRenderedColumns}>
            <StateError />
          </Td>
        </Tr>
      </Tbody>
    );
  }

  if (isNoData) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={numRenderedColumns}>
            <StateNoData />
          </Td>
        </Tr>
      </Tbody>
    );
  }

  return <>{children}</>;
};
