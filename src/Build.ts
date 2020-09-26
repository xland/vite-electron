const vite = require("vite");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
// const { spawn } = require("child_process");
const builder = require("electron-builder");
class Build {
  private projectPath = process.cwd();
  //   private builderProcess;
  private async viteBuild() {
    const options = {
      root: this.projectPath,
      enableEsbuild: true,
      outDir: path.join(this.projectPath, "dist"),
    };
    return vite.build(options);
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
  private async electronBuild() {
    let bundledDir = path.join(this.projectPath, "dist/bundled");
    fs.mkdirSync(bundledDir);
    fs.writeFileSync(
      path.join(bundledDir, "package.json"),
      fs.readFileSync(path.join(this.projectPath, "package.json"))
    );
    fs.mkdirSync(path.join(bundledDir, "node_modules"));
    esbuild
      .build({
        entryPoints: [path.join(this.projectPath, "src/background.js")],
        outfile: path.join(bundledDir, "background.js"),
        minify: false,
        bundle: true,
        platform: "node",
        external: ["electron"],
      })
      .catch(() => process.exit(1));
    //todo release目录
    return builder.build({
      config: {
        directories: {
          output: path.join(this.projectPath, "dist"),
          app: path.join(this.projectPath, "dist/bundled"),
        },
        files: ["**"],
        extends: null,
      },
      project: path.join(this.projectPath, "dist"),
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
    await this.viteBuild();
    // await this.ESBuild();
    // this.copyPakagejson();
    await this.electronBuild();
  }
}
export let build = new Build();
