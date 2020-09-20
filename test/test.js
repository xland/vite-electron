const path = require("path");
const { createServer, build: viteBuild } = require("vite");
const { spawn } = require("child_process");
const { build: esbuild } = require("esbuild");
jest.setTimeout(100000);
let devServer;
let electronProcess;
beforeAll(async () => {
  let demoDir = path.join(__dirname, "demo");
  const options = {
    root: path.join(demoDir, "renderer"),
    enableEsbuild: true,
    outDir: path.join(demoDir, "dist"),
  };
  await viteBuild(options);

  esbuild({
    entryPoints: [path.join(demoDir, "main/index.js")],
    outfile: path.join(demoDir, "dist/index.js"),
    minify: true,
    bundle: false,
    platform: "node",
    // external: ["fs", "path", "electron"],
  }).catch(() => process.exit(1));
  // export interface CliOptions extends PackagerOptions, PublishOptions {
  //   x64?: boolean
  //   ia32?: boolean
  //   armv7l?: boolean
  //   arm64?: boolean

  //   dir?: boolean
  // }
  return;
  devServer = createServer(options);
  let port = options.port || 3000;
  devServer.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use, trying another one...`);
      setTimeout(() => {
        devServer.close();
        devServer.listen(++port);
      }, 100);
    } else {
      console.error(chalk.red(`[vite] server error:`));
      console.error(e);
    }
  });
  await new Promise((resolve) => {
    devServer.listen(port, () => {
      console.log(`http://localhost:${port}`);
      resolve();
    });
  });
  electronProcess = spawn(
    require("electron").toString(),
    [path.join(demoDir, "main/index.js")],
    {
      env: {
        WEB_PORT: port,
      },
    }
  );
  electronProcess.stdout.on("data", (data) => {
    data = data.toString();
    console.log(data);
  });
});
afterAll(async () => {
  // return new Promise((resolve) => {
  //   electronProcess.on("close", (exitCode) => {
  //     devServer.close();
  //     resolve();
  //   });
  // });
});
describe("vite-electron", () => {
  describe("build", () => {
    test("test", () => {});
  });
});
