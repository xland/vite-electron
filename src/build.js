const esbuild = require("esbuild");
const { readFileSync } = require("fs");
const path = require("path");

let pkgJsonPath = path.join(process.cwd(), "package.json");
let localPkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));

esbuild.buildSync({
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
esbuild.buildSync({
  entryPoints: [path.join(process.cwd(), "src/vitetron.ts")],
  outfile: path.join(process.cwd(), "dist/index.js"),
  minify: true,
  bundle: true,
  platform: "node",
  external: ["electron"],
});
