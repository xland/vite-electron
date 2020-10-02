# vitetron

Develop and build electron project with vite and vue3

## Install

```bash
$ yarn create vite-app project-name
$ cd project-name
$ yarn add vitetron --dev
$ yarn add electron --dev
$ yarn add electron-builder --dev
$ yarn add esbuild --dev
```

Add `background.ts` at the ./src folder

Set the file's content with:

```js
import { app, BrowserWindow } from "electron";
let win;
app.on("ready", () => {
  win = new BrowserWindow();
  vitetron.load(win, "index.html"); //vitetron will be injected automaticly.
});
```

add scripts to your package.json

```json
  "scripts": {
    "start": "vitetron start",
    "release": "vitetron release"
  }
```

run `yarn start` to develope,`yarn release` for build

## Config

Add `vitetron.config.js` at the root of the project

Set the file's content with

```js
module.exports = {
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
```

### main

The entry file of the main process,`.js` and `.ts` file are supported

### build

The [electron-builder's config](https://www.electron.build/configuration/configuration)

### env

The customized definition of `process.env`

## todo：

主进程可以调试

vitetron 有 TS 的类型

vue-cli 移除了哪些依赖

测试一下包含外部引用的主进程入口程序
