import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
export default {
  strictDeprecations: true,

  input: {
    index: "src/index.ts",
    cli: "src/cli.ts",
  },

  output: {
    dir: "dist",
    entryFileNames: "[name].mjs",
    format: "esm",
    sourcemap: true,
  },

  external: [/node_modules/],

  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    json(),
    typescript(),
  ],
};
