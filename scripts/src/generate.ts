import { loadConfig, orgNames } from "./config.js";
import { fetchRepoPRs } from "./fetch-pull-requests.js";
import { collectRepos } from "./fetch-repos.js";
import { filterPRs } from "./filter.js";
import { createGitHubClient } from "./github-client.js";
import type { Output, PullRequest, UIConfig, UISettings } from "./types.js";

const TIMEOUT_MS = 10 * 60 * 1000;

export async function generateReviewData(configDir: string): Promise<Output> {
  const cfg = loadConfig(configDir);
  console.log(
    `Loaded config: ${cfg.sources.orgs.length} orgs, ${cfg.sources.repos.length} explicit repos, ${cfg.authors.length} authors`,
  );

  const client = createGitHubClient();

  const signal = AbortSignal.timeout(TIMEOUT_MS);
  signal.addEventListener("abort", () => {
    throw new Error("Pipeline timed out after 10 minutes");
  });

  const orgs = orgNames(cfg);
  const repos = await collectRepos(client, orgs, cfg.sources.repos);
  console.log(`Monitoring ${repos.length} repos`);

  const allPRs: PullRequest[] = [];
  for (const repo of repos) {
    try {
      const prs = await fetchRepoPRs(client, repo);
      allPRs.push(...prs);
    } catch (err) {
      console.warn(`Warning: failed to fetch PRs for ${repo}: ${err}`);
    }
  }
  console.log(`Fetched ${allPRs.length} total PRs`);

  const filtered = filterPRs(allPRs, orgs, cfg.authors);
  console.log(`After filtering: ${filtered.length} PRs`);

  return {
    generated_at: new Date().toISOString(),
    ui_settings: buildUISettings(cfg.ui),
    pull_requests: filtered,
  };
}

function buildUISettings(ui: UIConfig): UISettings | undefined {
  const hasPalette =
    !!ui.palette?.accent ||
    !!ui.palette?.accent_dark ||
    !!ui.palette?.accent_light;

  if (!ui.title && !ui.logo && !ui.favicon && !hasPalette) return undefined;

  const settings: UISettings = {};
  if (ui.title) settings.title = ui.title;
  if (ui.logo) settings.logo = ui.logo;
  if (ui.favicon) settings.favicon = ui.favicon;
  if (hasPalette) {
    settings.palette = {};
    if (ui.palette?.accent) settings.palette.accent = ui.palette.accent;
    if (ui.palette?.accent_dark)
      settings.palette.accent_dark = ui.palette.accent_dark;
    if (ui.palette?.accent_light)
      settings.palette.accent_light = ui.palette.accent_light;
  }

  return settings;
}
