const vite = require("vite");
const esbuild = require("esbuild");
const path = require("path");
class Build {
  private projectPath = process.cwd();
  private async viteBuild() {
    const options = {
      root: this.projectPath,
      enableEsbuild: true,
      outDir: path.join(this.projectPath, "dist"),
    };
    await vite.build(options);
  }
  private async ESBuild() {
    //todo 自动创建background.js
    esbuild
      .build({
        entryPoints: [path.join(this.projectPath, "src/background.js")],
        outfile: path.join(this.projectPath, "dist/background.js"),
        minify: true,
        bundle: true,
        platform: "node",
        external: ["electron"],
      })
      .catch(() => process.exit(1));
  }
  async start() {
    await this.viteBuild();
    await this.ESBuild();
  }
}
export let build = new Build();
