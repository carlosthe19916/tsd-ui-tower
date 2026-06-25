import type React from "react";

import { Label } from "@patternfly/react-core";

import { SIZE_COLORS } from "@app/Constants";

interface SizeBadgeProps {
  size: string;
}

export const SizeBadge: React.FC<SizeBadgeProps> = ({ size }) => {
  const color = SIZE_COLORS[size] ?? "grey";

  return (
    <Label isCompact color={color}>
      {size}
    </Label>
  );
};
