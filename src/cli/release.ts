import { Base } from "./base";
const vite = require("vite");
const builder = require("electron-builder");
class Build extends Base {
  private buildRender() {
    const options = {
      root: process.cwd(),
      enableEsbuild: true,
      outDir: this.bundledDir,
    };
    return vite.build(options);
  }
  private async buildInstaller() {
    //todo release目录
    return builder.build({
      config: {
        directories: {
          output: this.releaseDir,
          app: this.bundledDir,
        },
        files: ["**"],
        extends: null,
        ...this.config.build,
      },
      project: process.cwd(),
    });
  }
  async start(argv?) {
    await this.prepareDirs();
    await this.buildRender();
    await this.preparePackageJson();
    await this.buildMain("release");
    await this.buildInstaller();
  }
  constructor() {
    super();
  }
}
export let build = new Build();
