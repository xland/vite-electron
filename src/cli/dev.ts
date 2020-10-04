import { spawn, ChildProcess } from "child_process";
import { Server } from "http";
import * as vite from "vite";
import { Base } from "./base";
const path = require("path");
const chalk = require("chalk");

class Dev extends Base {
  private viteServer: Server;
  private electronProcess: ChildProcess;

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
      this.viteServer = vite.createServer(options);
      this.viteServer.on("error", (e: any) => this.viteServerOnErr(e));
      this.viteServer.on("data", (e: any) => {
        console.log(e.toString());
      });
      this.viteServer.listen(this.viteServerPort, () => {
        //todo 端口占用的问题
        console.log(`http://localhost:${this.viteServerPort}`);
        resolve();
      });
    });
  }
  private createElectronProcess() {
    //todo 自动创建background.js
    this.electronProcess = spawn(
      require("electron").toString(),
      [path.join(this.projectPath,"src/entry_by_vitetron.js")],
      {
        env: { },
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
  async start(argv?) {
    await this.createViteServer();
    await this.buildMain("dev");
    if (argv && argv.debug) {
      console.log("launch electron through your debugger");
      return;
    }
    this.createElectronProcess();
  }
  constructor() {
    super();
  }
}
export let dev = new Dev();
