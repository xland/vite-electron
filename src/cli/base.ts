const path = require("path");
const esbuild = require("esbuild");
const fs = require("fs");
const os = require("os");

export class Base {
  protected config;
  protected projectPath = process.cwd();
  protected releaseDir;
  protected bundledDir;
  protected viteServerPort = 3000;
  protected prepareDirs() {
    this.releaseDir = path.join(this.projectPath, "release");
    this.bundledDir = path.join(this.releaseDir, "bundled");
    if (!fs.existsSync(this.bundledDir)) {
      fs.mkdirSync(this.bundledDir, { recursive: true });
      //防止electron-builder再安装一次依赖
      fs.mkdirSync(path.join(this.bundledDir, "node_modules"));
    }
  }
  protected preparenConfig() {
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
  protected preparePackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    //https://github.com/electron-userland/electron-builder/issues/4157#issuecomment-596419610
    let electronConfig = localPkgJson.devDependencies.electron.replace("^","");
    localPkgJson.main = "entry_by_vitetron.js";
    delete localPkgJson.scripts
    delete localPkgJson.devDependencies
    localPkgJson.devDependencies = {electron:electronConfig}
    console.log(path.join(this.bundledDir, "package.json"))
    fs.writeFileSync(
      path.join(this.bundledDir, "package.json"),
      JSON.stringify(localPkgJson)
    );
  }
  protected buildMain(env = "dev") {
    let targetDir = env === "dev"?path.join(this.projectPath,"src"):this.bundledDir
    let outfile = path.join(targetDir, "entry_by_vitetron.js");
    //不能用this.config.main，因为它可能有子路径，主进程必须在根目录下，这样才能让他找到index.html
    let entryFilePath = path.join(this.projectPath, this.config.main);
    //这个方法得到的结果：{outputFiles: [ { contents: [Uint8Array], path: '<stdout>' } ]}
    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile,
      minify: env === "release",
      bundle: true,
      platform: "node",
      // sourcemap: env === "dev",
      sourcemap: false,
      external: ["electron"],
    });
    let envObj = this.config.env[env];
    envObj.VITETRON = env;
    envObj.WEB_PORT = this.viteServerPort.toString();
    let envScript = `process.env={...process.env,...${JSON.stringify(envObj)}};`
    let js = `${envScript}${os.EOL}${fs.readFileSync(outfile)}`;
    fs.writeFileSync(outfile, js);
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
