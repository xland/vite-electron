const path = require("path");
const { createServer } = require("vite");
const { spawn } = require("child_process");
const { resolve } = require("path");
jest.setTimeout(100000);
let devServer;
let electronProcess;
beforeAll(async () => {
  let demoDir = path.join(__dirname, "demo");
  const options = { root: path.join(demoDir, "renderer") };
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
        ELECTRON_HMR_SOCKET_PATH: port,
      },
    }
  );
  electronProcess.stdout.on("data", (data) => {
    data = data.toString();
    console.log(data);
  });
});
afterAll(async () => {
  return new Promise((resolve) => {
    electronProcess.on("close", (exitCode) => {
      devServer.close();
      resolve();
    });
  });
});
describe("vite-electron", () => {
  describe("build", () => {
    test("test", () => {});
  });
});
