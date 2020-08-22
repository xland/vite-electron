const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const execa = require("execa");
const { createServer } = require("vite");
const { resolve } = require("path");
const argv = require("minimist")(process.argv.slice(2));
jest.setTimeout(100000);
let devServer;
beforeAll(async () => {
  console.log("create server");
  let demoDir = path.join(__dirname, "demo");
  await execa("yarn", { cwd: demoDir });
  const options = { root: demoDir };
  console.log("create server");
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
  return new Promise((resolve) => {
    devServer.listen(port, () => {
      console.log(`http://localhost:${port}`);
      resolve();
    });
  });

  // await execa("yarn", { cwd: demoDir });
  // await new Promise((resolve) => {
  //   devServer = execa(viteBin, { cwd: demoDir });
  //   devServer.stderr.on("data", (data) => {
  //     console.error(data.toString());
  //     resolve();
  //   });
  //   devServer.stdout.on("data", (data) => {
  //     if (data.toString().match("running")) {
  //       console.log("dev server running.");
  //       resolve();
  //     }
  //   });
  // });
  // console.log("ok");
});
afterAll(async () => {
  await new Promise((resolve) =>
    setTimeout(() => {
      devServer.close();
      resolve();
    }, 66000)
  );
});
describe("vite-electron", () => {
  describe("build", () => {
    test("test", () => {});
  });
});
