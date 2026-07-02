import type { Options } from "http-proxy-middleware";

import { CONSOLE_ENV } from "@tsd-ui-tower/common";

const logger =
  process.env.DEBUG === "1"
    ? console
    : {
        info() {},
        warn: console.warn,
        error: console.error,
      };

export const proxyMap: Record<string, Options> = {
  api: {
    pathFilter: "/api",
    target: CONSOLE_ENV.API_URL ?? "http://localhost:8080",
    logger,
    changeOrigin: true,
  },
};
