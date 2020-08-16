const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");
jest.setTimeout(100000);
let devServer;
beforeAll(async () => {
  let demoDir = path.join(__dirname, "demo");
  let viteBin = path.join(__dirname, "../node_modules/vite/bin/vite.js");
  await execa("yarn", { cwd: demoDir });
  await new Promise((resolve) => {
    devServer = execa("vite", {
      cwd: demoDir,
    });
    devServer.stdout.on("data", (data) => {
      if (data.toString().match("running")) {
        console.log("dev server running.");
        resolve();
      }
    });
  });
  console.log("ok");
});
afterAll(async () => {
  //   if (browser) await browser.close();
  if (devServer) {
    devServer.kill("SIGTERM", {
      forceKillAfterTimeout: 2000,
    });
  }
});
describe("vite-electron", () => {
  beforeAll(() => {
    console.log("allen");
  });
  describe("build", () => {
    console.log("build");
    test("test", () => {
      console.log(123);
    });
  });
});
