const esbuild = require("esbuild");
const { readFileSync } = require("fs");
const path = require("path");

let pkgJsonPath = path.join(process.cwd(), "package.json");
let localPkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));

esbuild.buildSync({
  entryPoints: ["./src/cli.ts"],
  outfile: "./dist/cli.js",
  bundle: true,
  platform: "node",
  external: Object.keys({
    ...(localPkgJson.dependencies || {}),
    ...(localPkgJson.devDependencies || {}),
    ...(localPkgJson.peerDependencies || {}),
  }),
});
esbuild.buildSync({
  entryPoints: [path.join(process.cwd(), "src/vitetron.ts")],
  outfile: path.join(process.cwd(), "dist/vitetron.js"),
  minify: true,
  bundle: true,
  platform: "node",
  external: ["electron"],
});
