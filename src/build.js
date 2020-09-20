const esbuild = require("esbuild");
const { readFileSync } = require("fs");
const path = require("path");

let pkgJsonPath = path.join(process.cwd(), "package.json");
let localPkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));

esbuild.build({
  format: "esm",
  outfile: "./dist/bin/cli.js",
  bundle: true,
  entryPoints: ["./src/bin/cli.ts"],
  platform: "node",
  external: Object.keys({
    ...(localPkgJson.dependencies || {}),
    ...(localPkgJson.devDependencies || {}),
    ...(localPkgJson.peerDependencies || {}),
  }),
});
