import type React from "react";

import dayjs from "dayjs";
import { Tooltip } from "@patternfly/react-core";

import { getAgeColor, getAgeDays } from "@app/utils/pr-utils";

const COLOR_MAP: Record<string, string> = {
  default: "inherit",
  warning: "var(--pf-t--global--color--status--warning--default)",
  orange: "var(--pf-t--global--color--status--warning--default)",
  danger: "var(--pf-t--global--color--status--danger--default)",
};

interface AgeDisplayProps {
  dateString: string;
  colored?: boolean;
}

export const AgeDisplay: React.FC<AgeDisplayProps> = ({
  dateString,
  colored = false,
}) => {
  const relative = dayjs(dateString).fromNow();
  const absolute = dayjs(dateString).format("MMM D, YYYY h:mm A");
  const style = colored
    ? { color: COLOR_MAP[getAgeColor(getAgeDays(dateString))] }
    : undefined;

  return (
    <Tooltip content={absolute}>
      <span style={style}>{relative}</span>
    </Tooltip>
  );
};
