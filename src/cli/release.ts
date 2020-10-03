import { Base } from "./base";

const vite = require("vite");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
// const { spawn } = require("child_process");
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
      project: this.releaseDir,
    });
    // //todo package.json配置main
    // this.builderProcess = spawn(
    //   "electron-builder",
    //   ["build", "--project", path.join(this.projectPath, "dist")],
    //   {
    //     cwd: this.projectPath,
    //   }
    // );
    // this.builderProcess.on("close", () => {
    //   process.exit();
    // });
    // this.builderProcess.stdout.on("data", (data: any) => {
    //   data = data.toString();
    //   console.log(data);
    // });
  }
  async start(argv?) {
    await this.buildRender();
    await this.buildMain("release");
    await this.buildInstaller();
  }
  constructor() {
    super();
  }
}
export let build = new Build();
