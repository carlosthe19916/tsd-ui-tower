import React, { Suspense } from "react";

import { Bullseye, Spinner } from "@patternfly/react-core";

interface LazyRouteElementProps {
  component: React.ReactNode;
}

export const LazyRouteElement: React.FC<LazyRouteElementProps> = ({
  component,
}) => {
  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      {component}
    </Suspense>
  );
};
