#!/usr/bin/env node

import { dev } from "../Dev";
import { build } from "../Build";
const argv = require("minimist")(process.argv.slice(2));

(async () => {
  const command = argv._[0];
  const { help, h, version, v } = argv;
  if (help || h) {
    //todo 输出帮助信息
    return;
  } else if (version || v) {
    //todo 输出版本信息
    return;
  }
  if (command === "start") {
    dev.start();
  } else if (command === "release") {
    build.start();
  }
})();

//todo cli
//"postinstall": "node ./dist/bin/cli.js",
