import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

import { parse } from "yaml";

import type { Config, UIConfig } from "./types.js";

const DEFAULT_UI: UIConfig = {
  title: "",
  logo: "",
  favicon: "",
  palette: {},
};

export function loadConfig(dir: string): Config {
  const sourcesPath = path.join(dir, "sources.yaml");
  const sourcesRaw = readFileSync(sourcesPath, "utf8");
  const sources = parse(sourcesRaw) as Record<string, unknown>;

  const cfg: Config = {
    sources: {
      orgs:
        ((sources.sources as Record<string, unknown>)?.orgs as {
          name: string;
        }[]) ?? [],
      repos:
        ((sources.sources as Record<string, unknown>)?.repos as string[]) ?? [],
    },
    authors: (sources.authors as string[]) ?? [],
    ui: { ...DEFAULT_UI },
  };

  validate(cfg);

  const uiPath = path.join(dir, "ui.yaml");
  if (existsSync(uiPath)) {
    const uiRaw = readFileSync(uiPath, "utf8");
    const ui = parse(uiRaw) as Partial<UIConfig>;
    cfg.ui = { ...DEFAULT_UI, ...ui };
  }

  return cfg;
}

function validate(cfg: Config): void {
  if (cfg.sources.orgs.length === 0 && cfg.sources.repos.length === 0) {
    throw new Error("config: at least one org or repo must be configured");
  }
}

export function orgNames(cfg: Config): string[] {
  return cfg.sources.orgs.map((o) => o.name);
}
