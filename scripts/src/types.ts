// --- Output types (what the pipeline produces) ---

export interface Output {
  generated_at: string;
  ui_settings?: UISettings;
  pull_requests: PullRequest[];
}

export interface UISettings {
  title?: string;
  logo?: string;
  favicon?: string;
  palette?: UIPalette;
}

export interface UIPalette {
  accent?: string;
  accent_dark?: string;
  accent_light?: string;
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
  ci_status: string | null;
  size: string | null;
  reviews: Reviews;
  unresolved_conversations: number;
  labels: string[];
}

export interface Author {
  login: string;
  avatar_url: string;
}

export interface Reviews {
  count: number;
  has_new_commits: boolean;
}

// --- Config types (what the YAML files define) ---

export interface Config {
  sources: SourcesConfig;
  authors: string[];
  ui: UIConfig;
}

export interface SourcesConfig {
  orgs: { name: string }[];
  repos: string[];
}

export interface UIConfig {
  title: string;
  logo: string;
  favicon: string;
  palette: UIPalette;
}

// --- GitHub client type ---

export interface GitHubClient {
  graphql: <T>(
    query: string,
    variables?: Record<string, unknown>,
  ) => Promise<T>;
}
