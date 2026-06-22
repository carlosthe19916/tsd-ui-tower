#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

import { generateReviewData } from "./generate.js";

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      "config-dir": { type: "string" },
      output: { type: "string" },
    },
  });

  const configDir = values["config-dir"] ?? "config";
  const outputPath = values.output ?? "data.json";

  const output = await generateReviewData(configDir);

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`Wrote ${output.pull_requests.length} PRs to ${outputPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
