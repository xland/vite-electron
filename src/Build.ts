const vite = require("vite");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
// const { spawn } = require("child_process");
const builder = require("electron-builder");
class Build {
  private releaseDir;
  private bundledDir;
  private buildConfig;
  private prepareDirs() {
    this.releaseDir = path.join(process.cwd(), "release");
    this.bundledDir = path.join(this.releaseDir, "bundled");
    if (!fs.existsSync(this.releaseDir)) {
      fs.mkdirSync(this.releaseDir, { recursive: true });
    }
  }
  private preparePackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    this.buildConfig = localPkgJson.build;
    delete localPkgJson.build;
    //https://github.com/electron-userland/electron-builder/issues/4157#issuecomment-596419610
    localPkgJson.devDependencies.electron = localPkgJson.devDependencies.electron.replace(
      "^",
      ""
    );
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
  private buildMain() {
    esbuild
      .build({
        entryPoints: [path.join(process.cwd(), "src/background.js")],
        outfile: path.join(this.bundledDir, "background.js"),
        minify: false,
        bundle: true,
        platform: "node",
        external: ["electron"],
      })
      .catch(() => process.exit(1));
  }
  // private async ESBuild() {
  //   //todo 自动创建background.js
  //   esbuild
  //     .build({
  //       entryPoints: [path.join(this.projectPath, "src/background.js")],
  //       outfile: path.join(this.projectPath, "dist/background.js"),
  //       minify: true,
  //       bundle: true,
  //       platform: "node",
  //       external: ["electron"],
  //     })
  //     .catch(() => process.exit(1));
  // }
  // private async copyPakagejson() {
  //   fs.writeFileSync(
  //     path.join(this.projectPath, "dist/package.json"),
  //     fs.readFileSync(path.join(this.projectPath, "package.json"))
  //   );
  // }
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
        ...this.buildConfig,
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
    await this.buildMain();
    // await this.ESBuild();
    // this.copyPakagejson();
    await this.buildInstaller();
  }
}
export let build = new Build();
