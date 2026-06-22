export const DATA_URL = "data.json";

export const Paths = {
  pullRequests: "/",
} as const;

export const PR_TYPE_FILTERS = {
  REGULAR: "regular",
  AUTOMATED: "automated",
  WIP: "wip",
  ALL: "all",
} as const;

export type PRTypeFilter =
  (typeof PR_TYPE_FILTERS)[keyof typeof PR_TYPE_FILTERS];

export const SIZE_COLORS: Record<
  string,
  "green" | "yellow" | "orange" | "red"
> = {
  XS: "green",
  S: "green",
  M: "yellow",
  L: "orange",
  XL: "red",
  XXL: "red",
};

export const AGE_THRESHOLDS = {
  FRESH_DAYS: 3,
  MODERATE_DAYS: 7,
  STALE_DAYS: 14,
} as const;
