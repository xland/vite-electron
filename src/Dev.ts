const { createServer } = require("vite");
const path = require("path");
const { spawn } = require("child_process");
const chalk = require("chalk");
const esbuild = require("esbuild");
const fs = require("fs");

class Dev {
  private viteServerPort = 3000;
  private viteServer: any;
  private electronProcess: any;
  private projectPath = process.cwd();
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
  private viteServerOnErr(err) {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${this.viteServerPort} is in use, trying another one...`
      );
      setTimeout(() => {
        //todo 找一个可用的port
        this.viteServer.close();
        this.viteServerPort += 1;
        this.viteServer.listen(this.viteServerPort);
      }, 100);
    } else {
      console.error(chalk.red(`[vite] server error:`));
      console.error(err);
    }
  }
  private createViteServer() {
    return new Promise((resolve, reject) => {
      let options = {
        root: this.projectPath,
        enableEsbuild: true,
        outDir: path.join(this.projectPath, "dist"),
      };
      this.viteServer = createServer(options);
      this.viteServer.on("error", (e: any) => this.viteServerOnErr(e));
      this.viteServer.on("data", (e: any) => {
        console.log(e.toString());
      });
      this.viteServer.listen(this.viteServerPort, () => {
        console.log(`http://localhost:${this.viteServerPort}`);
        resolve();
      });
    });
  }
  private async buildMain() {
    let entryFilePath = path.join(this.projectPath, this.config.main);
    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile: entryFilePath + ".js",
      minify: true,
      bundle: true,
      platform: "node",
      sourcemap: true,
      external: ["electron"],
    });
  }
  private createElectronProcess() {
    //todo 自动创建background.js
    this.electronProcess = spawn(
      require("electron").toString(),
      [path.join(this.projectPath, this.config.main + ".js")],
      {
        env: {
          WEB_PORT: this.viteServerPort,
          VITETRON: "dev",
          ...this.config.env.dev,
        },
      }
    );
    this.electronProcess.on("close", () => {
      this.viteServer.close();
      process.exit();
    });
    this.electronProcess.stdout.on("data", (data: any) => {
      data = data.toString();
      console.log(data);
    });
  }
  async start() {
    this.preparenConfig();
    await this.createViteServer();
    this.buildMain();
    this.createElectronProcess();
  }
}
export let dev = new Dev();
