export type CIStatus = "SUCCESS" | "FAILURE" | "PENDING" | "ERROR" | null;

export type ReviewDecision =
  "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | null;

export interface Author {
  login: string;
  avatar_url: string;
}

export interface Reviews {
  count: number;
  has_new_commits: boolean;
}

export interface PullRequest {
  title: string;
  url: string;
  number: number;
  repo: string;
  author: Author;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  is_automated: boolean;
  ci_status: CIStatus;
  size: string | null;
  reviews: Reviews;
  review_decision: ReviewDecision;
  unresolved_conversations: number;
  labels: string[];
}

export interface ReviewRotData {
  generated_at: string;
  pull_requests: PullRequest[];
}
