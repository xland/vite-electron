import { Base } from "./base";

const vite = require("vite");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
// const { spawn } = require("child_process");
const builder = require("electron-builder");
class Build extends Base {
  private releaseDir;
  private bundledDir;
  private prepareDirs() {
    this.releaseDir = path.join(this.projectPath, "release");
    this.bundledDir = path.join(this.releaseDir, "bundled");
    if (!fs.existsSync(this.releaseDir)) {
      fs.mkdirSync(this.releaseDir, { recursive: true });
    }
  }
  private preparePackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    //https://github.com/electron-userland/electron-builder/issues/4157#issuecomment-596419610
    localPkgJson.devDependencies.electron = localPkgJson.devDependencies.electron.replace(
      "^",
      ""
    );
    localPkgJson.main = "entry_by_vitetron.js";
    fs.writeFileSync(
      path.join(this.bundledDir, "package.json"),
      JSON.stringify(localPkgJson)
    );
    //防止electron-builder再安装一次依赖
    fs.mkdirSync(path.join(this.bundledDir, "node_modules"));
  }
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
  async start() {
    this.prepareDirs();
    await this.buildRender();
    this.preparePackageJson();
    await this.buildMain(
      "release",
      path.join(this.bundledDir, "entry_by_vitetron.js")
    );
    await this.buildInstaller();
  }
  constructor() {
    super();
  }
}
export let build = new Build();
