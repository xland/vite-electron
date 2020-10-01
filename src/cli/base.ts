const path = require("path");
const esbuild = require("esbuild");
const fs = require("fs");
const os = require("os");

export class Base {
  config;
  projectPath = process.cwd();
  private preparenConfig() {
    let configPath = path.join(process.cwd(), "vitetron.config.js");
    if (fs.existsSync(configPath)) {
      this.config = eval("require(configPath)");
    } else {
      this.config = {};
    }
    if (!this.config.main) this.config.main = "./src/background.ts";
    if (!this.config.build) this.config.build = {};
    if (!this.config.build.appId) this.config.build.appId = "com.vitetron.app";
    if (!this.config.build.appId)
      this.config.build.productName = "vitetron-demo";
    if (!this.config.env) this.config.env = {};
    if (!this.config.env.test) this.config.env.test = {};
    if (!this.config.env.dev) this.config.env.dev = {};
    if (!this.config.env.release) this.config.env.release = {};
  }
  protected buildMain(env = "dev", outfile = "") {
    //不能用this.config.main，因为它可能有子路径，主进程必须在根目录下，这样才能让他找到index.html
    let entryFilePath = path.join(this.projectPath, this.config.main);
    //这个方法得到的结果：{outputFiles: [ { contents: [Uint8Array], path: '<stdout>' } ]}
    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile,
      minify: env === "release",
      bundle: true,
      platform: "node",
      sourcemap: env === "dev",
      external: ["electron"],
    });
    let envObj = this.config.env[env];
    envObj.VITETRON = env;
    let js = `process.env={...process.env,...${JSON.stringify(envObj)}};${
      os.EOL
    }${fs.readFileSync(__dirname + "\\vitetron.js")};${os.EOL}${fs.readFileSync(
      entryFilePath + ".js"
    )}`;
    fs.writeFileSync(entryFilePath + ".js", js);
    // 追加到行首失败
    // var fd = fs.openSync(outFilePath, "w+");
    // fs.writeSync(fd, js, 0, js.length, 0);
    // fs.close(fd);
    // 内存编译失败，这个api不支持platform
    // let buildResult = esbuild.transformSync(
    //   path.join(process.cwd(), this.config.main),
    //   {
    //     minify: true,
    //     platform: "node",
    //     external: ["electron"],
    //     write: false,
    //   }
    // );
  }
  constructor() {
    this.preparenConfig();
  }
}
