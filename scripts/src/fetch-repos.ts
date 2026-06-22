import type { GitHubClient } from "./types.js";

interface OrgReposResponse {
  organization: {
    repositories: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: { nameWithOwner: string; isArchived: boolean }[];
    };
  };
}

const ORG_REPOS_QUERY = `
  query ($org: String!, $cursor: String) {
    organization(login: $org) {
      repositories(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          nameWithOwner
          isArchived
        }
      }
    }
  }
`;

export async function discoverOrgRepos(
  client: GitHubClient,
  org: string,
): Promise<string[]> {
  const repos: string[] = [];
  let cursor: string | null = null;

  for (;;) {
    const data: OrgReposResponse = await client.graphql(ORG_REPOS_QUERY, {
      org,
      cursor,
    });

    for (const repo of data.organization.repositories.nodes) {
      if (!repo.isArchived) {
        repos.push(repo.nameWithOwner);
      }
    }

    if (!data.organization.repositories.pageInfo.hasNextPage) break;
    cursor = data.organization.repositories.pageInfo.endCursor;
  }

  return repos;
}

export async function collectRepos(
  client: GitHubClient,
  orgs: string[],
  explicitRepos: string[],
): Promise<string[]> {
  const discovered: string[] = [];

  for (const org of orgs) {
    try {
      const repos = await discoverOrgRepos(client, org);
      discovered.push(...repos);
    } catch (err) {
      console.warn(`Warning: failed to discover repos for org ${org}: ${err}`);
    }
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const repo of discovered) {
    if (!seen.has(repo)) {
      seen.add(repo);
      result.push(repo);
    }
  }

  for (const repo of explicitRepos) {
    if (!seen.has(repo)) {
      seen.add(repo);
      result.push(repo);
    }
  }

  return result;
}
