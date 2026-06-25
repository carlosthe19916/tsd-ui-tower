import type React from "react";

import { Icon, Tooltip } from "@patternfly/react-core";
import CircleIcon from "@patternfly/react-icons/dist/esm/icons/circle-icon";

import type { CIStatus } from "@app/api/models";

const STATUS_CONFIG: Record<
  string,
  { status: React.ComponentProps<typeof Icon>["status"]; label: string }
> = {
  SUCCESS: { status: "success", label: "Passing" },
  FAILURE: { status: "danger", label: "Failing" },
  PENDING: { status: "warning", label: "Pending" },
  ERROR: { status: "warning", label: "Error" },
};

const UNKNOWN_CONFIG = { status: "custom" as const, label: "Unknown" };

interface CIStatusIconProps {
  status: CIStatus;
}

export const CIStatusIcon: React.FC<CIStatusIconProps> = ({ status }) => {
  const config = status
    ? (STATUS_CONFIG[status] ?? UNKNOWN_CONFIG)
    : UNKNOWN_CONFIG;

  return (
    <Tooltip content={config.label}>
      <Icon size="sm" status={config.status}>
        <CircleIcon />
      </Icon>
    </Tooltip>
  );
};
