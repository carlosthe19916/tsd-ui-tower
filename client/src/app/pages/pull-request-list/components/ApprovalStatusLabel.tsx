import type React from "react";

import { Label, Tooltip } from "@patternfly/react-core";
import CheckCircleIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import OutlinedClockIcon from "@patternfly/react-icons/dist/esm/icons/outlined-clock-icon";

import type { ReviewDecision } from "@app/api/models";

interface StatusConfig {
  color: React.ComponentProps<typeof Label>["color"];
  label: string;
  icon: React.ReactElement;
}

const DECISION_CONFIG: Record<string, StatusConfig> = {
  APPROVED: {
    color: "green",
    label: "Approved",
    icon: <CheckCircleIcon />,
  },
  CHANGES_REQUESTED: {
    color: "orange",
    label: "Changes requested",
    icon: <ExclamationCircleIcon />,
  },
  REVIEW_REQUIRED: {
    color: "blue",
    label: "Review required",
    icon: <OutlinedClockIcon />,
  },
};

const PENDING_CONFIG: StatusConfig = {
  color: "grey",
  label: "Pending",
  icon: <OutlinedClockIcon />,
};

interface ApprovalStatusLabelProps {
  decision: ReviewDecision;
  reviewCount: number;
}

export const ApprovalStatusLabel: React.FC<ApprovalStatusLabelProps> = ({
  decision,
  reviewCount,
}) => {
  const config = decision
    ? (DECISION_CONFIG[decision] ?? PENDING_CONFIG)
    : PENDING_CONFIG;

  return (
    <Tooltip
      content={`${config.label} (${reviewCount} review${reviewCount !== 1 ? "s" : ""})`}
    >
      <Label isCompact color={config.color} icon={config.icon}>
        {config.label}
      </Label>
    </Tooltip>
  );
};
