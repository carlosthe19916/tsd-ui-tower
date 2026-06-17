import { buildConsoleEnv, decodeEnv } from "@tsd-ui-tower/common";

export const ENV = buildConsoleEnv(decodeEnv(window._env));

export default ENV;
