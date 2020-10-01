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
  // 暂时不屏蔽掉这些库，让它打包到最终的源码中
  external: Object.keys({
    ...(localPkgJson.dependencies || {}),
    ...(localPkgJson.devDependencies || {}),
    ...(localPkgJson.peerDependencies || {}),
  }),
});
esbuild.buildSync({
  entryPoints: [path.join(process.cwd(), "src/vitetron.ts")],
  outfile: path.join(process.cwd(), "dist/index.js"),
  minify: false,
  bundle: true,
  platform: "node",
  tsconfig: "./src/tsconfig.json",
  external: ["electron"],
});
