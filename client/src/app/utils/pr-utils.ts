import type { PullRequest } from "@app/api/models";
import { AGE_THRESHOLDS } from "@app/Constants";

const SIZE_LABEL_REGEX = /^size[:/]\s*(\S+)$/i;

export const extractSize = (pr: PullRequest): string | null => {
  if (pr.size) {
    return pr.size;
  }
  for (const label of pr.labels) {
    const match = SIZE_LABEL_REGEX.exec(label);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  return null;
};

export const isWIP = (pr: PullRequest): boolean => {
  return pr.is_draft || /\bWIP\b/i.test(pr.title);
};

export const isReadyForReview = (pr: PullRequest): boolean => {
  if (pr.is_draft) return false;
  if (pr.ci_status !== "SUCCESS" && pr.ci_status !== null) return false;
  return pr.reviews.count === 0 || pr.reviews.has_new_commits;
};

export const getAgeDays = (dateString: string): number => {
  const ms = Date.now() - new Date(dateString).getTime();
  return ms / (1000 * 60 * 60 * 24);
};

export const getAgeColor = (
  days: number,
): "default" | "warning" | "orange" | "danger" => {
  if (days >= AGE_THRESHOLDS.STALE_DAYS) return "danger";
  if (days >= AGE_THRESHOLDS.MODERATE_DAYS) return "orange";
  if (days >= AGE_THRESHOLDS.FRESH_DAYS) return "warning";
  return "default";
};
