import type React from "react";

import { Icon, Tooltip } from "@patternfly/react-core";
import CircleIcon from "@patternfly/react-icons/dist/esm/icons/circle-icon";

import type { CIStatus } from "@app/api/models";

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  SUCCESS: {
    color: "var(--pf-t--global--color--status--success--default)",
    label: "Passing",
  },
  FAILURE: {
    color: "var(--pf-t--global--color--status--danger--default)",
    label: "Failing",
  },
  PENDING: {
    color: "var(--pf-t--global--color--status--warning--default)",
    label: "Pending",
  },
  ERROR: {
    color: "var(--pf-t--global--color--status--warning--default)",
    label: "Error",
  },
};

const UNKNOWN_CONFIG = {
  color: "var(--pf-t--global--color--status--unreachable--default)",
  label: "Unknown",
};

interface CIStatusIconProps {
  status: CIStatus;
}

export const CIStatusIcon: React.FC<CIStatusIconProps> = ({ status }) => {
  const config = status
    ? (STATUS_CONFIG[status] ?? UNKNOWN_CONFIG)
    : UNKNOWN_CONFIG;

  return (
    <Tooltip content={config.label}>
      <Icon size="sm">
        <CircleIcon style={{ color: config.color }} />
      </Icon>
    </Tooltip>
  );
};
