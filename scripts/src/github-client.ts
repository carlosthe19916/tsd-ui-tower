import { graphql } from "@octokit/graphql";

import type { GitHubClient } from "./types.js";

const TOKEN_ENV = "GITHUB_TOKEN";
const REQUEST_TIMEOUT_MS = 30_000;

export function createGitHubClient(): GitHubClient {
  const token = process.env[TOKEN_ENV];
  if (!token) {
    throw new Error(`${TOKEN_ENV} environment variable is not set`);
  }

  const gql = graphql.defaults({
    headers: { authorization: `bearer ${token}` },
    request: { timeout: REQUEST_TIMEOUT_MS },
  });

  return { graphql: gql };
}
