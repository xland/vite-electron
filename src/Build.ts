const vite = require("vite");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
// const { spawn } = require("child_process");
const builder = require("electron-builder");
class Build {
  private releaseDir;
  private bundledDir;
  private config;
  private preparenConfig() {
    let configPath = path.join(process.cwd(), "vitetron.config.js");
    if (fs.existsSync(configPath)) {
      this.config = eval("require(configPath)");
    } else {
      //todo
      this.config = {
        main: "./src/background.ts",
        build: {
          appId: "com.xland.app",
          productName: "ViteElectron示例",
        },
        env: {
          dev: {
            SERVICE_BASE_URL: "https://dev.yourdomain.site",
          },
          test: {
            SERVICE_BASE_URL: "https://test.yourdomain.site",
          },
          release: {
            SERVICE_BASE_URL: "https://release.yourdomain.site",
          },
        },
      };
    }
  }
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
    //https://github.com/electron-userland/electron-builder/issues/4157#issuecomment-596419610
    localPkgJson.devDependencies.electron = localPkgJson.devDependencies.electron.replace(
      "^",
      ""
    );
    localPkgJson.main = path.join(this.bundledDir, "entry_by_vitetron.js");
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
  private async buildMain() {
    let outFilePath = path.join(this.bundledDir, "entry_by_vitetron.js");
    esbuild.buildSync({
      entryPoints: [path.join(process.cwd(), this.config.main)],
      outfile: outFilePath,
      minify: true,
      bundle: true,
      platform: "node",
      external: ["electron"],
    });
    let releaseEnv = this.config.env.release;
    releaseEnv.VITETRON = "release";
    let js = `process.env = {...process.env,...${JSON.stringify(releaseEnv)}};`;
    let data = fs.readFileSync(outFilePath);
    fs.writeFileSync(outFilePath, js + data);
    // var fd = fs.openSync(outFilePath, "w+");
    // fs.writeSync(fd, js, 0, js.length, 0);
    // fs.close(fd);
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
    this.preparenConfig();
    this.prepareDirs();
    await this.buildRender();
    this.preparePackageJson();
    await this.buildMain();
    await this.buildInstaller();
  }
}
export let build = new Build();
