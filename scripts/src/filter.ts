import type { PullRequest } from "./types.js";

export function filterPRs(
  prs: PullRequest[],
  coreOrgs: string[],
  teamAuthors: string[],
): PullRequest[] {
  const orgSet = new Set(coreOrgs.map((o) => o.toLowerCase()));
  const authorSet = new Set(teamAuthors.map((a) => a.toLowerCase()));

  return prs.filter((pr) => {
    const repoOrg = pr.repo.split("/")[0].toLowerCase();
    if (orgSet.has(repoOrg)) return true;
    if (authorSet.has(pr.author.login.toLowerCase())) return true;
    return false;
  });
}
