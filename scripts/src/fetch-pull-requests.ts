import type { GitHubClient, PullRequest, Reviews } from "./types.js";

interface PRQueryResponse {
  repository: {
    pullRequests: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: PRNode[];
    };
  };
  rateLimit: {
    cost: number;
    remaining: number;
    resetAt: string;
  };
}

interface PRNode {
  title: string;
  url: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
  headRefOid: string;
  reviewDecision: string | null;
  author: {
    __typename: string;
    login: string;
    avatarUrl: string;
  };
  labels: {
    nodes: { name: string }[];
  };
  commits: {
    nodes: {
      commit: {
        statusCheckRollup: { state: string } | null;
      };
    }[];
  };
  reviews: {
    nodes: {
      author: { __typename: string };
      commit: { oid: string };
    }[];
  };
  reviewThreads: {
    nodes: { isResolved: boolean }[];
  };
}

const PR_QUERY = `
  query ($owner: String!, $name: String!, $cursor: String) {
    repository(owner: $owner, name: $name) {
      pullRequests(first: 100, states: OPEN, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          title
          url
          number
          createdAt
          updatedAt
          isDraft
          headRefOid
          reviewDecision
          author {
            __typename
            login
            avatarUrl
          }
          labels(first: 20) {
            nodes {
              name
            }
          }
          commits(last: 1) {
            nodes {
              commit {
                statusCheckRollup {
                  state
                }
              }
            }
          }
          reviews(last: 100, states: [APPROVED, CHANGES_REQUESTED, COMMENTED]) {
            nodes {
              author {
                __typename
              }
              commit {
                oid
              }
            }
          }
          reviewThreads(first: 100) {
            nodes {
              isResolved
            }
          }
        }
      }
    }
    rateLimit {
      cost
      remaining
      resetAt
    }
  }
`;

export async function fetchRepoPRs(
  client: GitHubClient,
  repoFullName: string,
): Promise<PullRequest[]> {
  const parts = repoFullName.split("/");
  if (parts.length !== 2) {
    console.warn(`Warning: invalid repo name "${repoFullName}", skipping`);
    return [];
  }
  const [owner, name] = parts;

  const allPRs: PullRequest[] = [];
  let cursor: string | null = null;

  for (;;) {
    const data: PRQueryResponse = await client.graphql(PR_QUERY, {
      owner,
      name,
      cursor,
    });

    console.log(
      `  ${repoFullName}: fetched ${data.repository.pullRequests.nodes.length} PRs (rate limit: ${data.rateLimit.remaining} remaining, resets ${data.rateLimit.resetAt})`,
    );

    for (const node of data.repository.pullRequests.nodes) {
      allPRs.push(transformPR(node, repoFullName));
    }

    if (!data.repository.pullRequests.pageInfo.hasNextPage) break;
    cursor = data.repository.pullRequests.pageInfo.endCursor;
  }

  return allPRs;
}

function transformPR(node: PRNode, repo: string): PullRequest {
  return {
    title: node.title,
    url: node.url,
    number: node.number,
    repo,
    author: {
      login: node.author.login,
      avatar_url: node.author.avatarUrl,
    },
    created_at: node.createdAt,
    updated_at: node.updatedAt,
    is_draft: node.isDraft,
    is_automated: node.author.__typename === "Bot",
    ci_status: extractCIStatus(node),
    size: extractSize(node),
    reviews: extractReviews(node),
    review_decision: node.reviewDecision ?? null,
    unresolved_conversations: countUnresolved(node),
    labels: node.labels.nodes.map((l) => l.name),
  };
}

function extractCIStatus(node: PRNode): string | null {
  if (node.commits.nodes.length === 0) return null;
  const rollup = node.commits.nodes[0].commit.statusCheckRollup;
  return rollup?.state ?? null;
}

function extractSize(node: PRNode): string | null {
  for (const label of node.labels.nodes) {
    if (label.name.startsWith("size: ")) {
      return label.name.slice("size: ".length);
    }
  }
  return null;
}

function extractReviews(node: PRNode): Reviews {
  let count = 0;
  let lastHumanReviewOID = "";

  for (const review of node.reviews.nodes) {
    if (review.author.__typename === "Bot") continue;
    count++;
    lastHumanReviewOID = review.commit.oid;
  }

  return {
    count,
    has_new_commits: count > 0 && lastHumanReviewOID !== node.headRefOid,
  };
}

function countUnresolved(node: PRNode): number {
  let count = 0;
  for (const thread of node.reviewThreads.nodes) {
    if (!thread.isResolved) count++;
  }
  return count;
}
