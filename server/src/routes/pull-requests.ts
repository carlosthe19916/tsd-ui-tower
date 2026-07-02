import { execFile } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { promisify } from "node:util";

import { Router } from "express";

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../..",
);

const pathToConfig = process.env.CONFIG_DIR ?? path.join(rootDir, "config");
const pathToCli = path.join(rootDir, "scripts/dist/cli.mjs");

export const createPullRequestsRouter = () => {
  let refreshInProgress = false;

  const outputDir = path.join(pathToConfig, "data");
  mkdirSync(outputDir, { recursive: true });

  const runRefresh = async () => {
    const outputPath = path.join(outputDir, "data.json");
    await execFileAsync(
      "node",
      [pathToCli, "--config-dir", pathToConfig, "--output", outputPath],
      { timeout: 120_000, env: process.env },
    );
  };

  const router = Router();

  router.get("/", async (_req, res) => {
    const dataPath = path.join(outputDir, "data.json");

    if (!existsSync(dataPath)) {
      if (refreshInProgress) {
        res
          .status(503)
          .json({ status: "error", message: "Data is being generated" });
        return;
      }

      refreshInProgress = true;
      try {
        await runRefresh();
      } catch (err) {
        console.error("Auto-refresh failed:", err);
        res
          .status(500)
          .json({ status: "error", message: "Failed to generate data" });
        return;
      } finally {
        refreshInProgress = false;
      }
    }

    try {
      const raw = await readFile(dataPath, "utf-8");
      res.type("json").send(raw);
    } catch (err) {
      console.error("Failed to read pull-request data:", err);
      res.status(500).json({ status: "error", message: "Failed to load data" });
    }
  });

  router.post("/refresh", async (_req, res) => {
    if (refreshInProgress) {
      res
        .status(409)
        .json({ status: "error", message: "Refresh already in progress" });
      return;
    }

    refreshInProgress = true;

    try {
      await runRefresh();
      res.json({ status: "ok" });
    } catch (err) {
      console.error("Refresh failed:", err);
      res.status(500).json({ status: "error", message: "Refresh failed" });
    } finally {
      refreshInProgress = false;
    }
  });

  return router;
};
